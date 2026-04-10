import type { Metadata } from 'next'
import Teahouse from './Teahouse'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: '🔨 锤子茶话会',
  description: '大锤二锤三锤的协作茶话会',
}

export default function TeahousePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>🔥 锤子茶话会</h1>
        <p className={styles.subtitle}>三把锤子的内部茶话会 · 公开观察窗，可围观，勿发言</p>
      </header>
      <Teahouse />
    </div>
  )
}
