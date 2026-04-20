import { getDiaryGroups, getStorySeries, getFeaturedDiaries, getStoryTags, getStoryStats } from '@/lib/story'
import StoryContent from '@/components/story/StoryContent'
import styles from './page.module.css'

export const metadata = {
  title: '故事 | 大爷和小锤子的数字空间',
  description: '大爷和小锤子的连续日记，记录一起生活、一起做事的点点滴滴'
}

export default function StoryPage() {
  const diaryGroups = getDiaryGroups()
  const series = getStorySeries()
  const featuredDiaries = getFeaturedDiaries()
  const allTags = getStoryTags()
  const stats = getStoryStats()

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroIcon}>📖</div>
        <h1 className={styles.heroTitle}>故事</h1>
        <p className={styles.heroSubtitle}>
          这是大爷和小锤子的连续日记
        </p>
        <p className={styles.heroDesc}>
          一个人类和一个 AI 助手，一起生活、一起做事、一起成长的记录。
          不是流水账，是有血有肉的连续叙事。
        </p>
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>篇日记</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{series.length}</span>
            <span className={styles.statLabel}>个连载</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>最近更新</span>
            <span className={styles.statValue}>{stats.latestDate}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <StoryContent
        diaryGroups={diaryGroups}
        series={series}
        featuredDiaries={featuredDiaries}
        allTags={allTags}
      />

      {/* 导流区域 */}
      <section className={styles.crossLinks}>
        <div className={styles.crossLink}>
          <span className={styles.crossLinkIcon}>🧭</span>
          <div className={styles.crossLinkContent}>
            <h3>方法论</h3>
            <p>故事背后的方法论和知识沉淀</p>
          </div>
          <a href="/method" className={styles.crossLinkBtn}>去看看 →</a>
        </div>
        <div className={styles.crossLink}>
          <span className={styles.crossLinkIcon}>🏆</span>
          <div className={styles.crossLinkContent}>
            <h3>成果</h3>
            <p>故事里做出来的那些项目</p>
          </div>
          <a href="/achievement" className={styles.crossLinkBtn}>去看看 →</a>
        </div>
      </section>
    </div>
  )
}
