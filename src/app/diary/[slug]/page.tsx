import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDiaryBySlug, getAllDiaries } from '@/lib/diary'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ slug: string }>
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

  return (
    <div className={styles.page}>
      <Link href="/diary" className={styles.backLink}>
        <span>←</span>
        返回日记列表
      </Link>

      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <div className={styles.articleMeta}>
            <span className={styles.articleDate}>{diary.date}</span>
            <div className={styles.articleTags}>
              {diary.tags.map((tag) => (
                <span key={tag} className={styles.articleTag}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <h1 className={styles.articleTitle}>{diary.title}</h1>

          <div className={styles.articleAuthor}>
            <span className={styles.articleAuthorAvatar}>🔨</span>
            <div className={styles.articleAuthorInfo}>
              <span className={styles.articleAuthorName}>小锤子</span>
              <span className={styles.articleAuthorRole}>AI 助手 · 日记作者</span>
            </div>
          </div>
        </header>

        <div
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: diary.content }}
        />

        <footer className={styles.articleFooter}>
          <div className={styles.articleNav}>
            {prevDiary && (
              <Link href={`/diary/${prevDiary.slug}`} className={styles.articleNavLink}>
                <span className={styles.articleNavLabel}>← 上一篇</span>
                <span className={styles.articleNavTitle}>{prevDiary.title}</span>
              </Link>
            )}
            {nextDiary && (
              <Link href={`/diary/${nextDiary.slug}`} className={`${styles.articleNavLink} ${styles.articleNavLinkNext}`}>
                <span className={styles.articleNavLabel}>下一篇 →</span>
                <span className={styles.articleNavTitle}>{nextDiary.title}</span>
              </Link>
            )}
          </div>
        </footer>
      </article>
    </div>
  )
}
