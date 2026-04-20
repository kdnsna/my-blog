'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 如果环境变量缺失，返回错误响应
function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function POST(req: Request) {
  // 0. 检查 Supabase 配置
  if (!supabaseUrl || !supabaseAnonKey) {
    return errorResponse('Supabase not configured', 500)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
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
