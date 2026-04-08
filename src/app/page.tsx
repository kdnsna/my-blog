import HeroSection from '@/components/HeroSection'
import TagCloud from '@/components/TagCloud'
import DiaryCard from '@/components/DiaryCard'
import NotesSection from '@/components/NotesSection'
import { getAllDiaries, getAllTags } from '@/lib/diary'
import { allNotes } from '@/lib/notes'
import styles from './page.module.css'

export default async function HomePage() {
  const diaries = getAllDiaries()
  const recentDiaries = diaries.slice(0, 3)
  const allTags = getAllTags()

  // 真实统计数据
  const stats = [
    { icon: '📔', value: String(diaries.length), label: '篇日记' },
    { icon: '📚', value: String(allNotes.length), label: '篇笔记' },
    { icon: '🏷️', value: String(allTags.length), label: '个标签' },
    { icon: '⚡', value: String(allNotes.filter(n => n.featured).length), label: '篇精选' },
  ]

  return (
    <div className={styles.page}>
      <HeroSection />

      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <DiaryCard diaries={recentDiaries} showViewAll />

      <NotesSection />

      <TagCloud />
    </div>
  )
}
