import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDiaryBySlug, getAllDiaries } from '@/lib/diary'
import { ArticleHeader, ArticleFooter } from '@/components/article'
import Breadcrumb from '@/components/Breadcrumb'
import styles from './page.module.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kdnsna.cn'

interface PageProps {
  params: Promise<{ slug: string }>
}

// 动态生成文章页 metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const diary = getDiaryBySlug(slug)

  if (!diary) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: diary.title,
    description: diary.excerpt,
    keywords: diary.tags,
    authors: [{ name: '小锤子' }],
    alternates: {
      canonical: `${SITE_URL}/diary/${slug}`,
    },
    openGraph: {
      title: diary.title,
      description: diary.excerpt,
      type: 'article',
      publishedTime: diary.date,
      authors: ['小锤子'],
      url: `${SITE_URL}/diary/${slug}`,
    },
    twitter: {
      card: 'summary',
      title: diary.title,
      description: diary.excerpt,
    },
  }
}

// 估算阅读时长
function estimateReadingTime(content: string): number {
  const words = content.length / 2
  return Math.max(1, Math.ceil(words / 400))
}

/**
 * 移除 HTML 内容中与标题重复的第一个 h1 标签
 * MDX 渲染后的 HTML 可能包含与 frontmatter title 相同的 h1 标签
 */
function removeDuplicateTitle(html: string, title: string): string {
  // 移除标题中的特殊字符用于比较
  const normalizeTitle = (t: string) => t.replace(/\s+/g, ' ').trim().toLowerCase()
  const normalizedTarget = normalizeTitle(title)

  // 匹配第一个 h1 标签（支持不同格式）
  const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/i
  const match = html.match(h1Regex)

  if (!match) return html

  // 提取 h1 的纯文本内容
  const h1Content = match[1]
    .replace(/<[^>]+>/g, '') // 移除所有 HTML 标签
    .replace(/\s+/g, ' ')
    .trim()

  // 比较是否与标题相同
  if (normalizeTitle(h1Content) === normalizedTarget) {
    // 移除第一个 h1 标签及其后的空行
    return html
      .replace(h1Regex, '')
      .replace(/^[\s\n\r]*/, '') // 移除开头的空白
  }

  return html
}

export default async function DiaryDetailPage({ params }: PageProps) {
  const { slug } = await params
  const diary = getDiaryBySlug(slug)

  if (!diary) {
    notFound()
  }

  // 按日期排序（最新在前）
  const allDiaries = getAllDiaries()
  const currentIndex = allDiaries.findIndex(d => d.slug === slug)
  const prevDiary = currentIndex < allDiaries.length - 1 ? allDiaries[currentIndex + 1] : null
  const nextDiary = currentIndex > 0 ? allDiaries[currentIndex - 1] : null

  // 获取相关推荐（同标签日记）
  const relatedDiaries = allDiaries
    .filter(d => 
      d.slug !== slug && 
      d.tags.some(tag => diary.tags.includes(tag))
    )
    .slice(0, 3)

  const readingTime = estimateReadingTime(diary.content)

  // 处理内容，移除重复标题
  const cleanContent = removeDuplicateTitle(diary.content, diary.title)

  // 检测连载系列
  const seriesMatch = diary.title.match(/(.+?)[··]第?\s*(\d+)\s*篇/)
  const series = seriesMatch ? {
    id: seriesMatch[1].trim(),
    name: seriesMatch[1].trim() + '系列',
    index: parseInt(seriesMatch[2]),
    total: allDiaries.filter(d => d.title.includes(seriesMatch![1])).length,
    prev: prevDiary ? { title: prevDiary.title, href: `/diary/${prevDiary.slug}` } : undefined,
    next: nextDiary ? { title: nextDiary.title, href: `/diary/${nextDiary.slug}` } : undefined
  } : undefined

  return (
    <div className={styles.page}>
      {/* 文章结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: diary.title,
            description: diary.excerpt,
            datePublished: diary.date,
            author: {
              '@type': 'Person',
              name: '小锤子'
            },
            publisher: {
              '@type': 'Person',
              name: '小锤子'
            },
            url: `${SITE_URL}/diary/${slug}`,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${SITE_URL}/diary/${slug}`
            }
          })
        }}
      />
      
      <div className={styles.container}>
        {/* 左侧目录（桌面端） */}
        <aside className={styles.sidebar}>
          <div className={styles.backLinkWrapper}>
            <Breadcrumb items={[
              { label: '首页', href: '/' },
              { label: '故事', href: '/story' },
              { label: diary.title }
            ]} />
          </div>
        </aside>

        {/* 主内容 */}
        <main className={styles.main}>
          <article className={styles.article}>
            <ArticleHeader
              type="diary"
              title={diary.title}
              excerpt={diary.excerpt}
              date={diary.date}
              readingTime={readingTime}
              tags={diary.tags}
              author={{ name: '小锤子', avatar: '🔨' }}
              series={series}
            />

            <div
              className={styles.articleContent}
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />

            <ArticleFooter
              type="diary"
              title={diary.title}
              url={`${SITE_URL}/diary/${slug}`}
              relatedArticles={relatedDiaries.map(d => ({
                id: d.slug,
                title: d.title,
                excerpt: d.excerpt,
                date: d.date,
                readingTime: estimateReadingTime(d.content),
                href: `/diary/${d.slug}`,
                type: 'diary' as const,
                tags: d.tags
              }))}
              series={series}
              nextArticle={nextDiary ? {
                title: nextDiary.title,
                href: `/diary/${nextDiary.slug}`,
                date: nextDiary.date
              } : undefined}
            />
          </article>
        </main>
      </div>
    </div>
  )
}
