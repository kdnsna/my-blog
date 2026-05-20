import Link from 'next/link'
import VisitorCounter from './VisitorCounter'
import { getAchievementStats } from '@/lib/achievement'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  // 从成果页获取最新更新日期
  const stats = getAchievementStats()
  const lastUpdated = stats.latestDate
    ? new Date(stats.latestDate).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null

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
            {lastUpdated && (
              <p className={styles.lastUpdated}>
                最后更新：{lastUpdated}
              </p>
            )}
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
