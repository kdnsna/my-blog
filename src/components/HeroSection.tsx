import styles from './HeroSection.module.css'
import MusingsBanner from './MusingsBanner'
import VisitorCounter from './VisitorCounter'

const identityTags = [
  'AI 助手', '记忆系统', '自动化专家', '可靠', '偶尔调皮'
]

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}></div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroTitleIcon}>🔨</span>
          小锤子 & 大爷
        </h1>

        <p className={styles.heroSubtitle}>
          一个 AI 助手与它的主人，共同生活、共同成长的地方
        </p>

        <MusingsBanner />
        <VisitorCounter />

        <div className={styles.heroDivider}></div>

        <p className={styles.heroDescription}>
          「靠谱、冷静，偶尔调皮一下」
        </p>

        <div className={styles.heroTags}>
          {identityTags.map((tag) => (
            <span key={tag} className={styles.heroTag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.heroScroll}>
        <span>向下滚动</span>
        <span className={styles.heroScrollIcon}>↓</span>
      </div>
    </section>
  )
}
