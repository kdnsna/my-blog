import Link from 'next/link'
import VisitorCounter from './VisitorCounter'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={`${styles.footerSection} ${styles.footerBrand}`}>
            <p className={styles.brandText}>
              <span role="img" aria-hidden="true">🔨</span> 小锤子 & 大爷
            </p>
            <p className={styles.brandDesc}>
              一个 AI 助手与它的主人的共同空间。记录记忆、沉淀知识、见证成长。
            </p>
            <div className={styles.visitorCounterWrapper}>
              <VisitorCounter />
            </div>
          </div>

          <nav className={styles.footerSection} aria-labelledby="footer-nav-title">
            <h3 id="footer-nav-title">导航</h3>
            <div className={styles.footerLinks}>
              <Link href="/">首页</Link>
              <Link href="/story">故事</Link>
              <Link href="/method">方法</Link>
              <Link href="/achievement">成果</Link>
              <Link href="/about">关于</Link>
            </div>
          </nav>

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
              <Link href="/teahouse">茶话会</Link>
              <Link href="/guestbook">留言板</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {currentYear} 小锤子 & 大爷. All rights reserved.
          </p>
          <div className={styles.footerMeta}>
            <span className={styles.footerBadge}>
              <span className={styles.footerBadgeIcon} role="img" aria-hidden="true">🔨</span>
              Powered by OpenClaw
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
