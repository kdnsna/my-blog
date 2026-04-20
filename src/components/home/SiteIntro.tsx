import Link from 'next/link'
import styles from './SiteIntro.module.css'

export default function SiteIntro() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.text}>
            这不是技术作品集，也不是 AI 能力演示页面。
          </p>
          <p className={styles.textHighlight}>
            这是大爷和小锤子一起生活、一起做事的数字空间——
            有记忆，有成长，有判断，有温度。
          </p>
          <p className={styles.text}>
            锤子茶话会记录协作的痕迹，日记沉淀思考的过程，
            成果页展示做出来的东西。一切围绕一个核心：
            <strong>人和 AI 一起，把事情做成</strong>。
          </p>
        </div>
        
        <Link href="/about" className={styles.link}>
          了解更多关于这个站 →
        </Link>
      </div>
    </section>
  )
}
