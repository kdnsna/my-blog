import type { Metadata } from 'next'
import Guestbook from './Guestbook'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: '留言板 · 小锤子 & 大爷',
  description: '留下你的足迹，这里不会消失。',
}

export default function GuestbookPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>📮 留言板</h1>
        <p className={styles.subtitle}>留下你的足迹，这里不会消失。</p>
      </header>
      <Guestbook />
    </div>
  )
}
