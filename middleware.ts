import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for Agent-friendly enhancements
 * 1. RFC 8288 Link headers for discovery
 * 2. Content negotiation for text/markdown
 */

const BASE_URL = 'https://kdnsna.cn'

// Link header targets for discovery
const LINK_TARGETS = [
  { rel: 'sitemap', url: `${BASE_URL}/sitemap.xml` },
  { rel: 'alternate', type: 'application/json', url: `${BASE_URL}/.well-known/api-catalog` },
  { rel: 'related', type: 'application/json', url: `${BASE_URL}/.well-known/mcp-server` },
]

// Paths that can return markdown content
const MARKDOWN_PATTERNS = ['/diary/', '/method/', '/achievement/', '/story/']

function buildLinkHeader(): string {
  return LINK_TARGETS
    .map(target => {
      const parts = [`<${target.url}>`, `rel="${target.rel}"`]
      if (target.type) {
        parts.push(`type="${target.type}"`)
      }
      return parts.join('; ')
    })
    .join(', ')
}

function shouldReturnMarkdown(request: NextRequest, pathname: string): boolean {
  // Check if Accept header contains text/markdown
  const accept = request.headers.get('accept') || ''
  
  if (!accept.includes('text/markdown')) {
    return false
  }
  
  // Check if the path matches content patterns
  return MARKDOWN_PATTERNS.some(pattern => pathname.startsWith(pattern))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Add Link headers for discovery (RFC 8288)
  const response = NextResponse.next()
  response.headers.set('Link', buildLinkHeader())
  
  // 2. Handle content negotiation for markdown
  if (shouldReturnMarkdown(request, pathname)) {
    // For now, redirect to a .md suffix endpoint
    // The actual markdown conversion can be handled by an API route
    const markdownUrl = new URL(pathname + '.md', request.url)
    const markdownResponse = NextResponse.rewrite(markdownUrl)
    markdownResponse.headers.set('Content-Type', 'text/markdown; charset=utf-8')
    markdownResponse.headers.set('Link', buildLinkHeader())
    return markdownResponse
  }
  
  return response
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)).*)',
  ],
}
