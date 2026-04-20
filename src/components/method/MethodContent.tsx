'use client'

import { useState } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/shared/SectionHeader'
import type { NoteCategory, MethodNoteItem } from '@/lib/types'
import styles from './MethodContent.module.css'

interface MethodContentProps {
  categories: NoteCategory[]
  notes: MethodNoteItem[]
  featuredNotes: MethodNoteItem[]
  stats: { totalNotes: number; totalCategories: number; latestDate: string }
}

export default function MethodContent({
  categories,
  notes,
  featuredNotes,
  stats
}: MethodContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredNotes = selectedCategory
    ? notes.filter(n => n.category === selectedCategory)
    : notes

  return (
    <div className={styles.container}>
      {/* 分类导航 - 紧凑标签式 */}
      <section className={styles.section}>
        <SectionHeader
          icon="📂"
          title="分类导航"
          subtitle="按主题找到你需要的内容"
        />
        
        {/* 标签式筛选器 */}
        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${selectedCategory === null ? styles.filterTabActive : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            全部
            <span className={styles.filterCount}>{stats.totalNotes}</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`${styles.filterTab} ${selectedCategory === cat.name ? styles.filterTabActive : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              style={{ '--tab-color': cat.color } as React.CSSProperties}
            >
              {cat.icon} {cat.name}
              <span className={styles.filterCount}>{cat.count}</span>
            </button>
          ))}
        </div>

        {/* 选中分类说明 */}
        {selectedCategory && (
          <div className={styles.categoryIntro}>
            {(() => {
              const cat = categories.find(c => c.name === selectedCategory)
              return cat ? (
                <>
                  <span className={styles.categoryIntroIcon}>{cat.icon}</span>
                  <div className={styles.categoryIntroText}>
                    <h3 className={styles.categoryIntroTitle}>{selectedCategory}</h3>
                    <p className={styles.categoryIntroDesc}>{cat.description}</p>
                  </div>
                  <button 
                    className={styles.categoryIntroBack}
                    onClick={() => setSelectedCategory(null)}
                  >
                    ← 返回全部
                  </button>
                </>
              ) : null
            })()}
          </div>
        )}
      </section>

      {/* 精选方法 - 仅全部时显示 */}
      {featuredNotes.length > 0 && !selectedCategory && (
        <section className={styles.section}>
          <SectionHeader
            icon="⭐"
            title="精选方法"
            subtitle="这些方法经过验证，值得深入学习"
          />
          <div className={styles.featuredGrid}>
            {featuredNotes.map(note => (
              <Link key={note.id} href={note.href} className={styles.featuredCard}>
                <div 
                  className={styles.featuredAccent}
                  style={{ background: note.categoryColor }}
                />
                <div className={styles.featuredContent}>
                  <div className={styles.featuredHeader}>
                    <span className={styles.featuredIcon}>{note.icon}</span>
                    <span 
                      className={styles.featuredCategory}
                      style={{ color: note.categoryColor }}
                    >
                      {note.category}
                    </span>
                  </div>
                  <h3 className={styles.featuredTitle}>{note.title}</h3>
                  <p className={styles.featuredDesc}>{note.description}</p>
                  <div className={styles.featuredTags}>
                    {note.tags.slice(0, 3).map(tag => (
                      <span key={tag} className={styles.featuredTag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.featuredArrow}>→</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 笔记列表 */}
      <section className={styles.section}>
        <SectionHeader
          icon="📝"
          title={selectedCategory ? `${selectedCategory}笔记` : '全部笔记'}
          subtitle={selectedCategory 
            ? `${filteredNotes.length} 篇` 
            : `${stats.totalNotes} 篇笔记，${stats.totalCategories} 个分类`
          }
        />

        <div className={styles.notesList}>
          {filteredNotes.map(note => (
            <Link key={note.id} href={note.href} className={styles.noteItem}>
              <div className={styles.noteIcon}>{note.icon}</div>
              <div className={styles.noteContent}>
                <div className={styles.noteHeader}>
                  <h3 className={styles.noteTitle}>{note.title}</h3>
                  <span 
                    className={styles.noteCategory}
                    style={{ background: `${note.categoryColor}20`, color: note.categoryColor }}
                  >
                    {note.category}
                  </span>
                </div>
                <p className={styles.noteDesc}>{note.description}</p>
                <div className={styles.noteMeta}>
                  <span className={styles.noteDate}>{note.date}</span>
                  {note.tags.slice(0, 3).map(tag => (
                    <span key={tag} className={styles.noteTag}>{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📭</span>
            <p>该分类下暂无笔记</p>
          </div>
        )}
      </section>
    </div>
  )
}
