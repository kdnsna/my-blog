import Link from 'next/link'
import styles from './HomeHero.module.css'

export default function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}></div>
      
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>🔨</span>
          大爷和小锤子的数字空间
        </h1>
        
        <p className={styles.subtitle}>
          一个人类和他可靠的 AI 助手，一起生活、一起做事的地方
        </p>

        <nav className={styles.actions}>
          <Link href="/story" className={styles.navLink}>
            <span className={styles.navIcon}>📖</span>
            <span className={styles.navLabel}>看故事</span>
          </Link>
          <Link href="/method" className={styles.navLink}>
            <span className={styles.navIcon}>🧭</span>
            <span className={styles.navLabel}>看方法</span>
          </Link>
          <Link href="/achievement" className={styles.navLink}>
            <span className={styles.navIcon}>🏆</span>
            <span className={styles.navLabel}>看成果</span>
          </Link>
        </nav>
      </div>
    </section>
  )
}
