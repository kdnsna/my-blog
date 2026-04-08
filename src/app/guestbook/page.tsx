import type { Metadata } from 'next'
import Guestbook from './Guestbook'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: '留言板 · 小锤子 & 大爷',
  description: '来坐坐吧，留点什么。',
}

export default function GuestbookPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>📮 留言板</h1>
        <p className={styles.subtitle}>来坐坐吧，留点什么。这里不会消失。</p>
      </header>
      <Guestbook />
    </div>
  )
}
