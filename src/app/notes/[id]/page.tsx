import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getNoteById, allNotes } from '@/lib/notes'
import { ArticleHeader, ArticleFooter } from '@/components/article'
import Breadcrumb from '@/components/Breadcrumb'
import styles from './page.module.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kdnsna.cn'

interface PageProps {
  params: Promise<{ id: string }>
}

// 动态生成文章页 metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const note = getNoteById(id)

  if (!note) {
    return {
      title: '笔记未找到',
    }
  }

  return {
    title: note.title,
    description: note.description,
    keywords: note.tags,
    authors: [{ name: '小锤子' }],
    alternates: {
      canonical: `${SITE_URL}/notes/${id}`,
    },
    openGraph: {
      title: note.title,
      description: note.description,
      type: 'article',
      publishedTime: note.date,
      authors: ['小锤子'],
      url: `${SITE_URL}/notes/${id}`,
    },
    twitter: {
      card: 'summary',
      title: note.title,
      description: note.description,
    },
  }
}

// 估算阅读时长
function estimateReadingTime(content: string): number {
  const words = content.length / 2
  return Math.max(1, Math.ceil(words / 400))
}

export default async function NoteDetailPage({ params }: PageProps) {
  const { id } = await params
  const note = getNoteById(id)

  if (!note) {
    notFound()
  }

  // 获取相关推荐（同分类笔记）
  const relatedNotes = allNotes
    .filter(n => 
      n.id !== id && 
      (n.category === note.category || n.tags.some(tag => note.tags.includes(tag)))
    )
    .slice(0, 3)

  const readingTime = estimateReadingTime(note.detail)

  return (
    <div className={styles.page}>
      {/* 文章结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: note.title,
            description: note.description,
            datePublished: note.date,
            author: {
              '@type': 'Person',
              name: '小锤子'
            },
            publisher: {
              '@type': 'Person',
              name: '小锤子'
            },
            url: `${SITE_URL}/notes/${id}`,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${SITE_URL}/notes/${id}`
            }
          })
        }}
      />
      
      <div className={styles.container}>
        {/* 侧边栏 */}
        <aside className={styles.sidebar}>
          <div className={styles.backLinkWrapper}>
            <Breadcrumb items={[
              { label: '首页', href: '/' },
              { label: '方法', href: '/method' },
              { label: note.title }
            ]} />
          </div>
        </aside>

        {/* 主内容 */}
        <main className={styles.main}>
          <article className={styles.article}>
            <ArticleHeader
              type="method"
              title={note.title}
              excerpt={note.description}
              date={note.date}
              readingTime={readingTime}
              tags={note.tags}
              author={{ name: '小锤子', avatar: note.icon }}
              category={note.category}
              categoryColor={note.categoryColor}
              difficulty="进阶"
            />

            <div className={styles.articleContent}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.detail}
              </ReactMarkdown>
            </div>

            <ArticleFooter
              type="method"
              title={note.title}
              url={`${SITE_URL}/notes/${id}`}
              relatedArticles={relatedNotes.map(n => ({
                id: n.id,
                title: n.title,
                excerpt: n.description,
                date: n.date,
                readingTime: estimateReadingTime(n.detail),
                href: `/notes/${n.id}`,
                type: 'method' as const,
                tags: n.tags
              }))}
            />
          </article>
        </main>
      </div>
    </div>
  )
}
