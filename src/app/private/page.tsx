import Link from 'next/link'
import styles from './page.module.css'

export default function PrivateHome() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>🔒 私人空间</h1>
        <p className={styles.subtitle}>
          工作日记、内部笔记、未脱敏的项目记录 — 仅大爷可见
        </p>
      </header>

      <nav className={styles.nav}>
        <Link href="/private/diary" className={styles.card}>
          <span className={styles.cardIcon}>📔</span>
          <span className={styles.cardTitle}>工作日记</span>
          <span className={styles.cardDesc}>未经脱敏的日常记录</span>
        </Link>
        <Link href="/private/notes" className={styles.card}>
          <span className={styles.cardIcon}>📝</span>
          <span className={styles.cardTitle}>内部笔记</span>
          <span className={styles.cardDesc}>工作方法、内部知识</span>
        </Link>
        <Link href="/private/projects" className={styles.card}>
          <span className={styles.cardIcon}>📂</span>
          <span className={styles.cardTitle}>项目档案</span>
          <span className={styles.cardDesc}>含敏感信息的完整项目记录</span>
        </Link>
      </nav>

      <footer className={styles.footer}>
        <Link href="/" className={styles.backLink}>← 回到公开站</Link>
      </footer>
    </main>
  )
}
