'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './NavBar.module.css'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/diary', label: '日记' },
  { href: '/notes', label: '知识库' },
  { href: '/about', label: '关于' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarInner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🔨</span>
          <span>小锤子</span>
        </Link>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${
                pathname === link.href ? styles.navLinkActive : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.navRight}>
          {/* 状态指示器 */}
          <div className={styles.statusIndicator} title="小锤子在线">
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>在线</span>
          </div>
        </div>

        <button className={styles.mobileMenuBtn} aria-label="菜单">
          <span className={styles.mobileMenuIcon}></span>
        </button>
      </div>
    </header>
  )
}
