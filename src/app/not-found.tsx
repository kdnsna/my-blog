import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>页面走丢了</h1>
        <p className={styles.description}>
          这个页面似乎已经不在这里了，就像一个被删掉的 commit。
        </p>
        <div className={styles.hint}>
          <span className={styles.hintIcon}>🔨</span>
          <span>也许你想回到首页？</span>
        </div>
        <Link href="/" className={styles.homeLink}>
          <span className={styles.linkIcon}>←</span>
          返回首页
        </Link>
      </div>
    </div>
  )
}
