import { getAllDiaries } from '@/lib/diary'
import { allNotes } from '@/lib/notes'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kdnsna.cn'
const SITE_TITLE = '大爷和小锤子的数字空间'
const SITE_DESCRIPTION = '一个人类和他可靠的 AI 助手，一起生活、一起做事的地方。记录记忆、沉淀知识、见证成长。'

export async function GET() {
  const diaries = getAllDiaries().slice(0, 20) // 最新20篇日记
  const notes = allNotes.slice(0, 10) // 最新10篇笔记

  const items = [
    ...diaries.map(d => ({
      title: d.title,
      link: `${SITE_URL}/diary/${d.slug}`,
      description: d.excerpt,
      pubDate: new Date(d.date).toUTCString(),
      category: 'story'
    })),
    ...notes.map(n => ({
      title: n.title,
      link: `${SITE_URL}/method`,
      description: n.description,
      pubDate: new Date(n.date).toUTCString(),
      category: 'method'
    }))
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/styles/rss.xslt"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/favicon.ico</url>
      <title>${SITE_TITLE}</title>
      <link>${SITE_URL}</link>
    </image>
    ${items.map(item => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
      <guid>${item.link}</guid>
      <category>${item.category}</category>
    </item>`).join('\n')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
