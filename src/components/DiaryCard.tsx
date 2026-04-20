import Link from 'next/link'
import styles from './DiaryCard.module.css'

interface DiaryEntry {
  slug: string
  date: string
  title: string
  excerpt: string
  tags: string[]
}

interface DiaryCardProps {
  diaries: DiaryEntry[]
  showViewAll?: boolean
}

export default function DiaryCard({ diaries, showViewAll = true }: DiaryCardProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleWrapper}>
          <span className={styles.sectionIcon}>📔</span>
          <h2 className={styles.sectionTitle}>最近日记</h2>
        </div>
        {showViewAll && (
          <Link href="/story" className={styles.viewAllLink}>
            查看全部
            <span>→</span>
          </Link>
        )}
      </div>

      <div className={styles.cardGrid}>
        {diaries.map((diary) => (
          <Link href={`/diary/${diary.slug}`} key={diary.slug} className={styles.card}>
            <div className={styles.cardDate}>
              <span className={styles.cardDateBadge}>{diary.date}</span>
              <div className={styles.cardTags}>
                {diary.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className={styles.cardTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h3 className={styles.cardTitle}>{diary.title}</h3>
            <p className={styles.cardExcerpt}>{diary.excerpt}</p>
            <div className={styles.cardFooter}>
              <div className={styles.cardAuthor}>
                <span className={styles.cardAuthorAvatar}>🔨</span>
                <span className={styles.cardAuthorName}>小锤子</span>
              </div>
              <span className={styles.cardReadMore}>
                阅读全文
                <span>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
