import { ActionButton } from '@/components/shared'
import styles from './HomeHero.module.css'

export default function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}></div>
      
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>🔨</span>
          大爷和小锤子的数字空间
        </h1>
        
        <p className={styles.subtitle}>
          一个人类和他可靠的 AI 助手，一起生活、一起做事的地方
        </p>

        <div className={styles.actions}>
          <ActionButton href="/story" variant="primary" size="lg" icon="📖">
            看故事
          </ActionButton>
          <ActionButton href="/method" variant="secondary" size="lg" icon="🧭">
            看方法
          </ActionButton>
          <ActionButton href="/achievement" variant="secondary" size="lg" icon="🏆">
            看成果
          </ActionButton>
        </div>
      </div>
    </section>
  )
}
