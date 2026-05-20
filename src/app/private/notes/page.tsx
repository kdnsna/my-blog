import Link from 'next/link'
import styles from '../page.module.css'

export default function PrivateNotesPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>📝 内部笔记</h1>
        <p className={styles.subtitle}>
          工作方法、项目细节、内部知识库。这些内容包含未脱敏信息，不对外公开。
        </p>
      </header>

      <p className={styles.empty}>
        在 `src/lib/private-notes.ts` 中添加笔记数据，格式与公开的方法页相同。
      </p>

      <footer className={styles.footer}>
        <Link href="/private" className={styles.backLink}>← 返回私人空间</Link>
      </footer>
    </main>
  )
}
