'use client'

import { useState } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/shared/SectionHeader'
import type { DiaryGroup, StorySeries, StoryDiaryItem } from '@/lib/types'
import styles from './StoryContent.module.css'

interface StoryContentProps {
  diaryGroups: DiaryGroup[]
  series: StorySeries[]
  featuredDiaries: StoryDiaryItem[]
  allTags: string[]
}

export default function StoryContent({
  diaryGroups,
  series,
  featuredDiaries,
  allTags
}: StoryContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set(['2026-4']))

  // 过滤日记
  const filteredGroups = selectedTag
    ? diaryGroups.map(group => ({
        ...group,
        diaries: group.diaries.filter(d => d.tags.includes(selectedTag))
      })).filter(group => group.diaries.length > 0)
    : diaryGroups

  const toggleMonth = (key: string) => {
    setExpandedMonths(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <div className={styles.container}>
      {/* 连载精选 */}
      {series.length > 0 && (
        <section className={styles.section}>
          <SectionHeader
            icon="📚"
            title="连载精选"
            subtitle="这些故事值得从第一篇开始读"
          />
          <div className={styles.seriesGrid}>
            {series.map(s => (
              <Link key={s.id} href={`/diary/${s.diarySlugs[s.diarySlugs.length - 1]}`} className={styles.seriesCard}>
                <div className={styles.seriesIcon}>{s.icon}</div>
                <div className={styles.seriesContent}>
                  <h3 className={styles.seriesTitle}>{s.title}</h3>
                  <p className={styles.seriesDesc}>{s.description}</p>
                  <div className={styles.seriesMeta}>
                    <span className={styles.seriesCount}>连载 · {s.totalCount} 篇</span>
                    <span className={styles.seriesDate}>{s.latestDate}</span>
                  </div>
                </div>
                <div className={styles.seriesArrow}>→</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 时间浏览 */}
      <section className={styles.section}>
        <SectionHeader
          icon="📅"
          title="按时间浏览"
          subtitle="或者，从最近的日记开始看"
        />
        
        {/* 标签筛选 */}
        {allTags.length > 0 && (
          <div className={styles.tagFilter}>
            <button
              className={`${styles.tagBtn} ${!selectedTag ? styles.tagActive : ''}`}
              onClick={() => setSelectedTag(null)}
            >
              全部
            </button>
            {allTags.slice(0, 8).map(tag => (
              <button
                key={tag}
                className={`${styles.tagBtn} ${selectedTag === tag ? styles.tagActive : ''}`}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* 月份分组 */}
        <div className={styles.timeline}>
          {filteredGroups.map(group => {
            const key = `${group.year}-${group.month}`
            const isExpanded = expandedMonths.has(key)
            
            return (
              <div key={key} className={styles.monthGroup}>
                <button 
                  className={styles.monthHeader}
                  onClick={() => toggleMonth(key)}
                >
                  <span className={styles.monthLabel}>{group.label}</span>
                  <span className={styles.monthCount}>{group.diaries.length} 篇</span>
                  <span className={`${styles.monthArrow} ${isExpanded ? styles.monthArrowUp : ''}`}>
                    ▼
                  </span>
                </button>
                
                {isExpanded && (
                  <div className={styles.monthDiaries}>
                    {group.diaries.map(diary => (
                      <Link 
                        key={diary.slug} 
                        href={`/diary/${diary.slug}`}
                        className={styles.diaryItem}
                      >
                        <span className={styles.diaryDate}>{diary.displayDate}</span>
                        <span className={styles.diaryTitle}>{diary.title}</span>
                        <div className={styles.diaryMeta}>
                          <span className={styles.diaryTime}>{diary.readingTime} min</span>
                          {diary.tags.slice(0, 2).map(tag => (
                            <span key={tag} className={styles.diaryTag}>{tag}</span>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 最新日记预览（如果折叠了月份，显示最新几篇） */}
      {selectedTag && featuredDiaries.length > 0 && (
        <section className={styles.section}>
          <SectionHeader
            icon="✨"
            title={`含「${selectedTag}」的日记`}
            subtitle={`共 ${filteredGroups.reduce((sum, g) => sum + g.diaries.length, 0)} 篇`}
          />
          <div className={styles.featuredList}>
            {featuredDiaries.map(diary => (
              <Link 
                key={diary.slug} 
                href={`/diary/${diary.slug}`}
                className={styles.featuredItem}
              >
                <span className={styles.featuredDate}>{diary.date}</span>
                <span className={styles.featuredTitle}>{diary.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
