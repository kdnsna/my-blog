import { NextRequest, NextResponse } from 'next/server'
import { getDiaryBySlug } from '@/lib/diary'

/**
 * API route for serving markdown content
 * Accessible via /api/markdown/[...path].md
 */

interface RouteParams {
  params: Promise<{
    path: string[]
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { path } = await params
  const segments = path.join('/').replace(/\.md$/, '')
  
  // Handle diary content
  if (path[0] === 'diary' && path.length >= 2) {
    const slug = path.slice(1).join('/')
    const diary = getDiaryBySlug(slug)
    
    if (!diary) {
      return new NextResponse('Not found', { status: 404 })
    }
    
    // Build markdown content with frontmatter
    const markdown = `---
title: "${diary.title}"
date: "${diary.date}"
tags: [${diary.tags.map(t => `"${t}"`).join(', ')}]
excerpt: "${diary.excerpt}"
---

# ${diary.title}

${diary.content}
`
    
    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
  
  return new NextResponse('Not found', { status: 404 })
}
