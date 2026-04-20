'use client'

import { useState, useEffect } from 'react'
import styles from './TableOfContents.module.css'

export interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  items: TocItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 检测是否为移动端
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0
      }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [items])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
      setActiveId(id)
      // 移动端点击后收起
      if (isMobile) {
        setIsExpanded(false)
      }
    }
  }

  if (items.length === 0) {
    return null
  }

  // 移动端：悬浮按钮 + 弹出层
  if (isMobile) {
    return (
      <>
        <button
          className={styles.mobileToggle}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? '收起目录' : '展开目录'}
          aria-expanded={isExpanded}
        >
          📑
        </button>
        {isExpanded && (
          <div
            className={styles.mobileOverlay}
            onClick={() => setIsExpanded(false)}
          >
            <nav
              className={styles.mobileToc}
              aria-label="文章目录"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.header}>
                <span className={styles.title}>目录</span>
                <button
                  className={styles.closeBtn}
                  onClick={() => setIsExpanded(false)}
                  aria-label="关闭目录"
                >
                  ✕
                </button>
              </div>
              <ul className={styles.list}>
                {items.map((item) => (
                  <li key={item.id} className={`${styles.item} ${styles[`level${item.level}`]}`}>
                    <a
                      href={`#${item.id}`}
                      className={`${styles.link} ${activeId === item.id ? styles.active : ''}`}
                      onClick={(e) => handleClick(e, item.id)}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </>
    )
  }

  // 桌面端：侧边栏目录
  return (
    <nav className={styles.toc} aria-label="文章目录">
      <div className={styles.header}>
        <span className={styles.title}>目录</span>
      </div>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={`${styles.item} ${styles[`level${item.level}`]}`}>
            <a
              href={`#${item.id}`}
              className={`${styles.link} ${activeId === item.id ? styles.active : ''}`}
              onClick={(e) => handleClick(e, item.id)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
