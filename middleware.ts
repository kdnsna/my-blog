import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Single active edge middleware.
 * - Protects the private area with a signed JWT cookie.
 * - Adds discovery Link headers to public pages.
 * - Supports markdown content negotiation for public article routes.
 */

const BASE_URL = 'https://kdnsna.cn'
const PUBLIC_PRIVATE_PATHS = ['/private/login']

const LINK_TARGETS = [
  { rel: 'sitemap', url: `${BASE_URL}/sitemap.xml` },
  { rel: 'alternate', type: 'application/json', url: `${BASE_URL}/.well-known/api-catalog` },
  { rel: 'related', type: 'application/json', url: `${BASE_URL}/.well-known/mcp-server` },
]

const MARKDOWN_PATTERNS = ['/diary/', '/method/', '/achievement/', '/story/']

function buildLinkHeader(): string {
  return LINK_TARGETS
    .map((target) => {
      const parts = [`<${target.url}>`, `rel="${target.rel}"`]
      if (target.type) parts.push(`type="${target.type}"`)
      return parts.join('; ')
    })
    .join(', ')
}

function shouldReturnMarkdown(request: NextRequest, pathname: string): boolean {
  const accept = request.headers.get('accept') || ''
  return accept.includes('text/markdown') && MARKDOWN_PATTERNS.some((pattern) => pathname.startsWith(pattern))
}

async function authorizePrivateRequest(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/private') || PUBLIC_PRIVATE_PATHS.includes(pathname)) {
    return null
  }

  const token = request.cookies.get('private_token')?.value
  if (!token) {
    const loginUrl = new URL('/private/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const authSecret = process.env.PRIVATE_AUTH_SECRET
  if (!authSecret) {
    return new NextResponse('Private section not configured', { status: 500 })
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(authSecret))
    return null
  } catch {
    const loginUrl = new URL('/private/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('private_token')
    return response
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authorizationResponse = await authorizePrivateRequest(request)
  if (authorizationResponse) return authorizationResponse

  const response = NextResponse.next()
  response.headers.set('Link', buildLinkHeader())

  if (shouldReturnMarkdown(request, pathname)) {
    const markdownResponse = NextResponse.rewrite(new URL(pathname + '.md', request.url))
    markdownResponse.headers.set('Content-Type', 'text/markdown; charset=utf-8')
    markdownResponse.headers.set('Link', buildLinkHeader())
    return markdownResponse
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)).*)'],
}
