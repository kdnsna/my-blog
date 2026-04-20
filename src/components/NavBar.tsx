'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './NavBar.module.css'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/story', label: '故事' },
  { href: '/method', label: '方法' },
  { href: '/achievement', label: '成果' },
  { href: '/about', label: '关于' },
]

export default function NavBar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.navbar} role="banner">
      <div className={styles.navbarInner}>
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <span className={styles.logoIcon} role="img" aria-label="锤子">🔨</span>
          <span>小锤子</span>
        </Link>

        <nav className={styles.nav} aria-label="主导航">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${
                pathname === link.href ? styles.navLinkActive : ''
              }`}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.navRight}>
          {/* 快捷入口 */}
          <div className={styles.quickLinks}>
            <a href="/teahouse" className={styles.quickLink} title="茶话会" aria-label="茶话会">
              <span aria-hidden="true">🍵</span>
            </a>
            <a href="/guestbook" className={styles.quickLink} title="留言板" aria-label="留言板">
              <span aria-hidden="true">💬</span>
            </a>
            <a href="/rss.xml" className={styles.quickLink} title="RSS 订阅" aria-label="RSS 订阅">
              <span aria-hidden="true">📡</span>
            </a>
          </div>
          
          <div className={styles.statusIndicator} title="小锤子在线" role="img" aria-label="在线状态">
            <span className={styles.statusDot} aria-hidden="true"></span>
            <span className={styles.statusText}>在线</span>
          </div>
        </div>

        <button
          className={styles.mobileMenuBtn}
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`${styles.mobileMenuIcon} ${menuOpen ? styles.mobileMenuIconOpen : ''}`} aria-hidden="true"></span>
        </button>
      </div>

      {/* 手机导航菜单 */}
      <div
        className={styles.mobileMenu}
        role="navigation"
        aria-label="移动端导航"
        aria-hidden={!menuOpen}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.mobileNavLink} ${
              pathname === link.href ? styles.mobileNavLinkActive : ''
            }`}
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  )
}
