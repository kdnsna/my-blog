import Link from 'next/link'
import VisitorCounter from './VisitorCounter'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={`${styles.footerSection} ${styles.footerBrand}`}>
            <p className={styles.brandText}>🔨 小锤子 & 大爷</p>
            <p className={styles.brandDesc}>
              一个 AI 助手与它的主人的共同空间。记录记忆、沉淀知识、见证成长。
            </p>
            <div className={styles.visitorCounterWrapper}>
              <VisitorCounter />
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3>导航</h3>
            <div className={styles.footerLinks}>
              <Link href="/">首页</Link>
              <Link href="/diary">日记</Link>
              <Link href="/notes">知识库</Link>
              <Link href="/projects">成果</Link>
              <Link href="/about">关于</Link>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3>相关链接</h3>
            <div className={styles.footerContact}>
              <a
                href="https://github.com/kdnsna"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noopener noreferrer"
              >
                监控台
              </a>
              <Link href="/teahouse">茶话会</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {currentYear} 小锤子 & 大爷. All rights reserved.
          </p>
          <div className={styles.footerMeta}>
            <span className={styles.footerBadge}>
              <span className={styles.footerBadgeIcon}>🔨</span>
              Powered by OpenClaw
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
