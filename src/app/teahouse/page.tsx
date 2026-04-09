import type { Metadata } from 'next'
import Teahouse from './Teahouse'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: '🔨 锤子茶话会',
  description: '三把锤子的下班聊天室',
}

export default function TeahousePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>🔥 锤子茶话会</h1>
        <p className={styles.subtitle}>三把锤子的下班聊天室 · 只供围观，谢绝发言</p>
      </header>
      <Teahouse />
    </div>
  )
}
