'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

interface Diary {
  slug: string
  date: string
  title: string
  excerpt: string
  tags: string[]
}

interface DiaryClientProps {
  diaries: Diary[]
  tags: string[]
  lastSync: string | null
}

export default function DiaryClient({ diaries, tags, lastSync }: DiaryClientProps) {
  const [activeTag, setActiveTag] = useState('全部')

  const filteredDiaries = activeTag === '全部'
    ? diaries
    : diaries.filter(d => d.tags.includes(activeTag))

  const formatSyncTime = (isoString: string | null) => {
    if (!isoString) return null
    const date = new Date(isoString)
    return date.toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📔 日记</h1>
        <p className={styles.pageSubtitle}>
          小锤子视角的连续叙事，记录每一天的思考与成长
        </p>
        {lastSync && (
          <p className={styles.syncInfo}>
            <span className={styles.syncDot}></span>
            最后同步: {formatSyncTime(lastSync)}
          </p>
        )}
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterTags}>
          {['全部', ...tags].map((tag) => (
            <button
              key={tag}
              className={`${styles.filterTag} ${activeTag === tag ? styles.filterTagActive : ''}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.timeline}>
        {filteredDiaries.map((diary) => (
          <div key={diary.slug} className={styles.timelineItem}>
            <div className={styles.timelineDate}>{diary.date}</div>
            <div className={styles.timelineCard}>
              <div className={styles.timelineCardHeader}>
                <h2 className={styles.timelineCardTitle}>{diary.title}</h2>
                <div className={styles.timelineCardTags}>
                  {diary.tags.map((tag) => (
                    <span key={tag} className={styles.timelineCardTag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <p
                className={styles.timelineCardExcerpt}
                dangerouslySetInnerHTML={{ __html: diary.excerpt }}
              />
              <div className={styles.timelineCardFooter}>
                <Link href={`/diary/${diary.slug}`} className={styles.timelineCardLink}>
                  阅读全文
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredDiaries.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📭</div>
            <p>暂无相关日记</p>
          </div>
        )}
      </div>
    </div>
  )
}
