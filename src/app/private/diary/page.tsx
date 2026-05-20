import Link from 'next/link'
import styles from '../page.module.css'
import { getAllPrivateDiaries } from '@/lib/private-diary'

export default function PrivateDiaryPage() {
  const diaries = getAllPrivateDiaries()

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>📔 工作日记</h1>
        <p className={styles.subtitle}>
          完整日记存档，包含未脱敏的工作细节和内部信息。仅大爷可见。
        </p>
      </header>

      {diaries.length === 0 ? (
        <p className={styles.empty}>暂无日记。</p>
      ) : (
        <>
          <p className={styles.count}>共 {diaries.length} 篇</p>
          <div className={styles.list}>
            {diaries.map((d) => (
              <Link
                key={d.slug}
                href={`/private/diary/${d.slug}`}
                className={styles.item}
              >
                <span className={styles.itemDate}>{d.date}</span>
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>{d.title}</span>
                  {d.excerpt && (
                    <span className={styles.itemExcerpt}>{d.excerpt}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <footer className={styles.footer}>
        <Link href="/private" className={styles.backLink}>← 返回私人空间</Link>
      </footer>
    </main>
  )
}
