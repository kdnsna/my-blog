'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

interface Diary {
  slug: string
  date: string
  title: string
  excerpt: string
  tags: string[]
}

export default function DiaryPage() {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [activeTag, setActiveTag] = useState('全部')
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState<string | null>(null)

  // 客户端加载日记数据
  useEffect(() => {
    async function loadDiaries() {
      try {
        const response = await fetch('/api/diaries')
        if (response.ok) {
          const data = await response.json()
          setDiaries(data.diaries)
          setTags(['全部', ...data.tags])
          setLastSync(data.lastSync)
        }
      } catch (error) {
        console.error('加载日记失败:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDiaries()
  }, [])

  const filteredDiaries = activeTag === '全部'
    ? diaries
    : diaries.filter(d => d.tags.includes(activeTag))

  // 格式化同步时间
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

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <span className={styles.loadingIcon}>🔨</span>
          <p>小锤子正在整理日记...</p>
        </div>
      </div>
    )
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
          {tags.map((tag) => (
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
              <p className={styles.timelineCardExcerpt}>{diary.excerpt}</p>
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
