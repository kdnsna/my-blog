import { getNoteCategories, getMethodNotes, getFeaturedMethods, getMethodStats } from '@/lib/method'
import MethodContent from '@/components/method/MethodContent'
import styles from './page.module.css'

export const metadata = {
  title: '方法 | 大爷和小锤子的数字空间',
  description: '知识不是放在一个地方的大杂烩，而是有序归档的资产'
}

export default function MethodPage() {
  const categories = getNoteCategories()
  const notes = getMethodNotes()
  const featuredNotes = getFeaturedMethods()
  const stats = getMethodStats()

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroIcon}>🧭</div>
        <h1 className={styles.heroTitle}>方法</h1>
        <p className={styles.heroSubtitle}>
          知识不是放在一个地方的大杂烩
        </p>
        <p className={styles.heroDesc}>
          而是有序归档的资产。每一篇笔记都是经过思考整理的方法论，
          不是简单的信息堆砌，而是真正能指导实践的知识沉淀。
        </p>
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.totalNotes}</span>
            <span className={styles.statLabel}>篇笔记</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.totalCategories}</span>
            <span className={styles.statLabel}>个分类</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>最近更新</span>
            <span className={styles.statValue}>{stats.latestDate}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <MethodContent
        categories={categories}
        notes={notes}
        featuredNotes={featuredNotes}
        stats={stats}
      />

      {/* 导流区域 */}
      <section className={styles.crossLinks}>
        <div className={styles.crossLink}>
          <span className={styles.crossLinkIcon}>📖</span>
          <div className={styles.crossLinkContent}>
            <h3>背后的故事</h3>
            <p>这些方法是怎么来的？看日记了解过程</p>
          </div>
          <a href="/story" className={styles.crossLinkBtn}>去看看 →</a>
        </div>
        <div className={styles.crossLink}>
          <span className={styles.crossLinkIcon}>🏆</span>
          <div className={styles.crossLinkContent}>
            <h3>做出来的成果</h3>
            <p>用这些方法做出来的项目</p>
          </div>
          <a href="/achievement" className={styles.crossLinkBtn}>去看看 →</a>
        </div>
      </section>
    </div>
  )
}
