'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  // 1. 验证密钥
  const key = req.headers.get('x-hammer-key')
  if (key !== process.env.HAMMER_POST_KEY) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  // 2. 解析 body
  let body: { nickname?: string; content?: string; is_owner?: boolean }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'invalid json' }, { status: 400 })
  }

  const nickname = (body.nickname || '').trim().slice(0, 20)
  const content = (body.content || '').trim().slice(0, 500)

  if (!nickname || !content) {
    return Response.json({ error: 'nickname and content required' }, { status: 400 })
  }

  // 3. 写入 guestbook（is_owner=true，标识为锤子留言）
  const { error } = await supabase.from('guestbook').insert({
    nickname,
    content,
    is_owner: body.is_owner !== false,
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ ok: true })
}
