import { getProjectAchievements, getCaseAchievements, getChangelog, getAchievementStats } from '@/lib/achievement'
import AchievementContent from '@/components/achievement/AchievementContent'
import styles from './page.module.css'

export const metadata = {
  title: '成果 | 大爷和小锤子的数字空间',
  description: '做出来的东西，比说出来的想法更值钱'
}

export default function AchievementPage() {
  const projects = getProjectAchievements()
  const cases = getCaseAchievements()
  const changelog = getChangelog()
  const stats = getAchievementStats()

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroIcon}>🏆</div>
        <h1 className={styles.heroTitle}>成果</h1>
        <p className={styles.heroSubtitle}>
          做出来的东西，比说出来的想法更值钱
        </p>
        <p className={styles.heroDesc}>
          每一个成果都有完整的背景、目标和结果。
          不是简单的作品展示，而是真正做到了什么的证明。
        </p>
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.totalProjects}</span>
            <span className={styles.statLabel}>个项目</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.completedProjects}</span>
            <span className={styles.statLabel}>个已完成</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.totalCases}</span>
            <span className={styles.statLabel}>个案例</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <AchievementContent
        projects={projects}
        cases={cases}
        changelog={changelog}
        stats={stats}
      />

      {/* 导流区域 */}
      <section className={styles.crossLinks}>
        <div className={styles.crossLink}>
          <span className={styles.crossLinkIcon}>📖</span>
          <div className={styles.crossLinkContent}>
            <h3>背后的故事</h3>
            <p>这些成果是怎么做出来的？日记里有记录</p>
          </div>
          <a href="/story" className={styles.crossLinkBtn}>去看看 →</a>
        </div>
        <div className={styles.crossLink}>
          <span className={styles.crossLinkIcon}>🧭</span>
          <div className={styles.crossLinkContent}>
            <h3>用到的方法</h3>
            <p>这些项目用了哪些方法论？</p>
          </div>
          <a href="/method" className={styles.crossLinkBtn}>去看看 →</a>
        </div>
      </section>
    </div>
  )
}
