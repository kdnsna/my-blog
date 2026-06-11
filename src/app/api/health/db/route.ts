import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Probe = {
  table: string
  query: string
}

type ProbeResult = {
  table: string
  ok: boolean
  status?: number
  latencyMs: number
  error?: string
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  ''

const PROBES: Probe[] = [
  {
    table: 'guestbook',
    query: 'select=id,nickname,content,created_at,is_owner&order=created_at.desc&limit=1',
  },
  {
    table: 'teahouse',
    query: 'select=id,author,content,topic_id,created_at,likes&order=created_at.desc&limit=1',
  },
  {
    table: 'counter',
    query: 'select=id,count&id=eq.1&limit=1',
  },
]

function supabaseHost() {
  try {
    return new URL(SUPABASE_URL).host
  } catch {
    return null
  }
}

function keyType() {
  if (SUPABASE_KEY.startsWith('sb_publishable_')) return 'publishable'
  if (SUPABASE_KEY.startsWith('eyJ')) return 'anon_jwt'
  return SUPABASE_KEY ? 'unknown_public_key' : 'missing'
}

async function probeTable({ table, query }: Probe): Promise<ProbeResult> {
  const started = Date.now()

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      const detail = await res.text()
      return {
        table,
        ok: false,
        status: res.status,
        latencyMs: Date.now() - started,
        error: detail.slice(0, 240),
      }
    }

    return {
      table,
      ok: true,
      status: res.status,
      latencyMs: Date.now() - started,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      table,
      ok: false,
      latencyMs: Date.now() - started,
      error: message.slice(0, 240),
    }
  }
}

export async function GET() {
  const missingConfig = []
  if (!SUPABASE_URL) missingConfig.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!SUPABASE_KEY) missingConfig.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  if (missingConfig.length > 0) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        service: 'supabase',
        checkedAt: new Date().toISOString(),
        missingConfig,
      },
      { status: 503 }
    )
  }

  const checks = await Promise.all(PROBES.map(probeTable))
  const healthy = checks.every((check) => check.ok)

  return NextResponse.json(
    {
      status: healthy ? 'healthy' : 'unhealthy',
      service: 'supabase',
      host: supabaseHost(),
      keyType: keyType(),
      checkedAt: new Date().toISOString(),
      checks,
    },
    { status: healthy ? 200 : 503 }
  )
}
