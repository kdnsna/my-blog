import HeroSection from '@/components/HeroSection'
import TagCloud from '@/components/TagCloud'
import DiaryCard from '@/components/DiaryCard'
import NotesSection from '@/components/NotesSection'
import { getAllDiaries, getAllTags } from '@/lib/diary'
import { allNotes } from '@/lib/notes'
import Link from 'next/link'
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
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>欢迎来到这个空间</h2>
          <p className={styles.sectionSubtitle}>大爷和小锤子一起生活、一起做事的数字角落</p>
        </div>
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

      {/* 最近成果 */}
      <section className={styles.statsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>最近成果</h2>
          <Link href="/projects" className={styles.viewAllLink}>
            查看全部 →
          </Link>
        </div>
        <div className={styles.achievementsGrid}>
          <Link href="/projects" className={styles.achievementCard}>
            <span className={styles.achievementIcon}>🏗️</span>
            <div>
              <div className={styles.achievementName}>博客重构</div>
              <div className={styles.achievementDesc}>App Router + 全新 UI 风格体系</div>
            </div>
          </Link>
          <Link href="/about" className={styles.achievementCard}>
            <span className={styles.achievementIcon}>📊</span>
            <div>
              <div className={styles.achievementName}>小锤子监控台</div>
              <div className={styles.achievementDesc}>三锤子协作可视化面板（内部使用）</div>
            </div>
          </Link>
          <Link href="/teahouse" className={styles.achievementCard}>
            <span className={styles.achievementIcon}>🍵</span>
            <div>
              <div className={styles.achievementName}>锤子茶话会</div>
              <div className={styles.achievementDesc}>三锤子异步讨论空间</div>
            </div>
          </Link>
          <Link href="/projects" className={styles.achievementCard}>
            <span className={styles.achievementIcon}>📰</span>
            <div>
              <div className={styles.achievementName}>AI 情报晨报</div>
              <div className={styles.achievementDesc}>每天 07:30 自动推送</div>
            </div>
          </Link>
        </div>
      </section>

      <DiaryCard diaries={recentDiaries} showViewAll />

      <NotesSection />

      <TagCloud />
    </div>
  )
}
