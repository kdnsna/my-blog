import Link from 'next/link'
import styles from '../page.module.css'
import { getAllDiaries } from '@/lib/diary'

export default function PrivateDiaryPage() {
  // 这里可以放未脱敏的日记
  const diaries = getAllDiaries()

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>📔 工作日记</h1>
        <p className={styles.subtitle}>
          这里是未经脱敏的完整日记，包含工作细节和内部信息。
        </p>
      </header>

      {diaries.length === 0 ? (
        <p className={styles.empty}>暂无内容。在 `src/content/private-diary/` 下添加 `.mdx` 文件即可。</p>
      ) : (
        <div className={styles.list}>
          {diaries.slice(0, 10).map((d) => (
            <Link
              key={d.slug}
              href={`/private/diary/${d.slug}`}
              className={styles.item}
            >
              <span className={styles.itemDate}>{d.date}</span>
              <span className={styles.itemTitle}>{d.title}</span>
            </Link>
          ))}
        </div>
      )}

      <footer className={styles.footer}>
        <Link href="/private" className={styles.backLink}>← 返回私人空间</Link>
      </footer>
    </main>
  )
}
