'use client'

import { useState } from 'react'
import Link from 'next/link'
import { allNotes } from '@/lib/notes'
import styles from './page.module.css'

const categories = ['全部', '自动化', '记忆系统', '苹果生态', '项目', '学习', '安全', '日记', '备份']

export default function NotesPage() {
  const [activeCategory, setActiveCategory] = useState('全部')

  const filteredNotes = activeCategory === '全部'
    ? allNotes
    : allNotes.filter(note => note.category === activeCategory)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🗂️ 知识库</h1>
        <p className={styles.pageSubtitle}>沉淀经验、记录项目、整理学习的知识空间</p>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterTabs}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.filterTab} ${activeCategory === category ? styles.filterTabActive : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.bentoGrid}>
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`${styles.bentoCard} ${note.featured ? styles.bentoCardLarge : ''}`}
            style={{ '--card-accent': note.categoryColor } as React.CSSProperties}
          >
            <div className={styles.bentoHeader}>
              <span className={styles.bentoIcon}>{note.icon}</span>
              <span className={styles.bentoCategory}>{note.category}</span>
            </div>
            <h2 className={styles.bentoTitle}>{note.title}</h2>
            <p className={styles.bentoDescription}>{note.description}</p>
            <div className={styles.bentoTags}>
              {note.tags.map((tag) => (
                <span key={tag} className={styles.bentoTag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.bentoFooter}>
              <span className={styles.bentoDate}>{note.date}</span>
              <Link href={`/notes/${note.id}`} className={styles.bentoLink}>
                查看详情
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📭</div>
            <p>暂无相关笔记</p>
          </div>
        )}
      </div>
    </div>
  )
}
