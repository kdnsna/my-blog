import { NextResponse } from 'next/server'
import { getAllDiaries, getAllTags, getSyncMeta } from '@/lib/diary'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const diaries = getAllDiaries()
    const tags = getAllTags()
    const meta = getSyncMeta()

    return NextResponse.json({
      diaries,
      tags,
      lastSync: meta?.lastSync || null
    })
  } catch (error) {
    console.error('API 错误:', error)
    return NextResponse.json(
      { error: '获取日记失败' },
      { status: 500 }
    )
  }
}
