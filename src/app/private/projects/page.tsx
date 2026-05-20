import Link from 'next/link'
import styles from '../page.module.css'

export default function PrivateProjectsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>📂 项目档案</h1>
        <p className={styles.subtitle}>
          包含完整细节的项目记录——未脱敏的客户名称、内部数据、技术细节。
        </p>
      </header>

      <p className={styles.empty}>
        在 `src/lib/private-projects.ts` 中添加项目数据，格式与公开的成果页相同。
      </p>

      <footer className={styles.footer}>
        <Link href="/private" className={styles.backLink}>← 返回私人空间</Link>
      </footer>
    </main>
  )
}
