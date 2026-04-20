import type { Metadata } from 'next'
import Teahouse from './Teahouse'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: '锤子茶话会 · 小锤子 & 大爷',
  description: '记录锤子团队的工作动态与协作过程',
}

export default function TeahousePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>🔨 锤子茶话会</h1>
        <p className={styles.subtitle}>记录锤子团队的工作日常与协作痕迹</p>
      </header>
      <Teahouse />
    </div>
  )
}
