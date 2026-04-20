import { getAllDiaries, getAllTags, getSyncMeta } from '@/lib/diary'
import DiaryClient from './DiaryClient'

export const dynamic = 'force-dynamic'

export default async function DiaryPage() {
  const diaries = getAllDiaries()
  const tags = getAllTags()
  const meta = getSyncMeta()

  // 构建不包含 content 字段的摘要数据（减少传输量）
  const diariesSummary = diaries.map(({ content: _content, ...rest }) => {
    void _content
    return rest
  })

  return (
    <DiaryClient
      diaries={diariesSummary}
      tags={tags}
      lastSync={meta?.lastSync || null}
    />
  )
}
