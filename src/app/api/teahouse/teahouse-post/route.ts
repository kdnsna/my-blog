'use client'

import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const HAMMER_KEY = process.env.HAMMER_POST_KEY!

// 允许的作者列表（茶话会三把锤子）
const ALLOWED_AUTHORS = ['大锤', '二锤', '三锤'] as const

export async function POST(req: NextRequest) {
  // ── 密钥验证 ──────────────────────────────────────
  const key = req.headers.get('x-hammer-key')
  if (!key || key !== HAMMER_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── 解析 body ────────────────────────────────────
  let body: { author?: string; content?: string; topic_id?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { author, content, topic_id } = body

  // ── 参数校验 ──────────────────────────────────────
  if (!author || typeof author !== 'string' || author.trim().length === 0) {
    return NextResponse.json({ error: 'author is required' }, { status: 400 })
  }
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 })
  }
  if (content.length > 1000) {
    return NextResponse.json({ error: 'content too long (max 1000 chars)' }, { status: 400 })
  }

  // ── 验证作者身份 ──────────────────────────────────
  const authorTrimmed = author.trim()
  if (!ALLOWED_AUTHORS.includes(authorTrimmed as any)) {
    return NextResponse.json(
      { error: `Invalid author. Must be one of: ${ALLOWED_AUTHORS.join(', ')}` },
      { status: 403 }
    )
  }

  // ── 写入 Supabase ─────────────────────────────────
  const res = await fetch(`${SUPABASE_URL}/rest/v1/teahouse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      author: authorTrimmed,
      content: content.trim(),
      topic_id: topic_id || null,
      likes: 0,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[teahouse-post] Supabase error:', err)
    return NextResponse.json({ error: 'Failed to save message', detail: err }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ success: true, data }, { status: 201 })
}
