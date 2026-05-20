import { SignJWT } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

// 限速：5 次/15分钟/IP
const rateLimitMap = new Map<string, { attempts: number; lockUntil: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  // 清理过期记录
  if (record && record.lockUntil < now) {
    rateLimitMap.delete(ip)
    return true
  }

  if (!record) {
    rateLimitMap.set(ip, { attempts: 1, lockUntil: 0 })
    return true
  }

  if (record.lockUntil > now) {
    return false // 还在锁定期
  }

  record.attempts++
  if (record.attempts >= 5) {
    record.lockUntil = now + 15 * 60 * 1000 // 锁 15 分钟
  }
  return record.lockUntil === 0
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const authSecret = process.env.PRIVATE_AUTH_SECRET

  if (!authSecret) {
    return NextResponse.json(
      { error: '服务未配置' },
      { status: 500 }
    )
  }

  // 限速检查
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: '尝试次数过多，请 15 分钟后再试' },
      { status: 429 }
    )
  }

  try {
    const { password } = await request.json()

    if (password !== process.env.PRIVATE_ACCESS_KEY) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }

    // 密码正确 → 签发 JWT，有效期 7 天
    const secret = new TextEncoder().encode(authSecret)
    const token = await new SignJWT({ sub: 'daye' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    const response = NextResponse.json({ ok: true })

    // httpOnly cookie，JS 读不到，防止 XSS 窃取
    response.cookies.set('private_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/private',
      maxAge: 7 * 24 * 60 * 60, // 7 天
    })

    // 登录成功 → 清除限速记录
    rateLimitMap.delete(ip)

    return response
  } catch {
    return NextResponse.json(
      { error: '请求格式错误' },
      { status: 400 }
    )
  }
}
