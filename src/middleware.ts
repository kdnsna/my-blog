import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

// 不需要鉴权的 /private 子路径
const PUBLIC_PRIVATE_PATHS = ['/private/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 只保护 /private 下的路径
  if (!pathname.startsWith('/private')) {
    return NextResponse.next()
  }

  // 登录页和 API 放行
  if (
    PUBLIC_PRIVATE_PATHS.includes(pathname) ||
    pathname.startsWith('/api/auth/')
  ) {
    return NextResponse.next()
  }

  // 检查 cookie 中的 token
  const token = request.cookies.get('private_token')?.value

  if (!token) {
    // 未登录 → 重定向到登录页
    const loginUrl = new URL('/private/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const authSecret = process.env.PRIVATE_AUTH_SECRET

  if (!authSecret) {
    // 未配置密钥 → 拒绝访问
    return new NextResponse('Private section not configured', { status: 500 })
  }

  try {
    const secret = new TextEncoder().encode(authSecret)
    await jwtVerify(token, secret)
    // Token 有效 → 放行
    return NextResponse.next()
  } catch {
    // Token 无效/过期 → 清除 cookie 并重定向
    const loginUrl = new URL('/private/login', request.url)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('private_token')
    return response
  }
}

export const config = {
  matcher: ['/private/:path*'],
}
