import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// GET /api/teahouse/teahouse-list
// 可选参数: topic_id (过滤话题), limit (默认50, 最大200), offset (分页偏移)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const topicId = searchParams.get('topic_id')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    let url = `${SUPABASE_URL}/rest/v1/teahouse`
    const queries: string[] = [`select=*`, `order=created_at.asc`, `limit=${limit}`, `offset=${offset}`]

    if (topicId) {
      queries.push(`topic_id=eq.${topicId}`)
    }

    url += '?' + queries.join('&')

    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=none',
      },
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[teahouse-list] Supabase error:', err)
      return NextResponse.json({ error: 'Failed to fetch messages', detail: err }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({
      success: true,
      data,
      count: Array.isArray(data) ? data.length : 0,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[teahouse-list] Error:', err)
    return NextResponse.json({ error: 'Internal error', detail: message }, { status: 500 })
  }
}
