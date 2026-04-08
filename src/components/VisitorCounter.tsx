'use client'

import { useEffect, useState } from 'react'
import styles from './VisitorCounter.module.css'

const STORAGE_KEY = 'xiaochuizi_visitor_count'
const SUPABASE_CONFIGURED = false // 配好 Supabase 后改为 true 并配置 url + key

async function fetchSupabaseCount(): Promise<number | null> {
  if (!SUPABASE_CONFIGURED) return null
  try {
    const res = await fetch('/api/visitor-count')
    if (!res.ok) return null
    const data = await res.json()
    return data.count
  } catch {
    return null
  }
}

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)
  const [isNewVisitor, setIsNewVisitor] = useState(false)

  useEffect(() => {
    const prev = localStorage.getItem(STORAGE_KEY)
    const now = Date.now()
    const dayKey = new Date().toDateString()
    const todayKey = `xiaochuizi_visit_day`

    if (prev) {
      const last = parseInt(prev, 10)
      const diff = now - last
      // 30 分钟内的回访不重复计数
      if (diff < 30 * 60 * 1000) {
        setCount(parseInt(localStorage.getItem('xiaochuizi_total_visit') || '0', 10))
        return
      }
    }

    // 新访客或超时回访
    const total = parseInt(localStorage.getItem('xiaochuizi_total_visit') || '0', 10) + 1
    localStorage.setItem(STORAGE_KEY, String(now))
    localStorage.setItem('xiaochuizi_total_visit', String(total))

    const lastDay = localStorage.getItem(todayKey)
    if (lastDay !== dayKey) {
      setIsNewVisitor(true)
      localStorage.setItem(todayKey, dayKey)
    }

    setCount(total)
  }, [])

  if (count === null) return null

  return (
    <div className={styles.counter}>
      <span className={styles.icon}>👀</span>
      <span className={styles.label}>
        已接待
      </span>
      <span className={styles.number}>{count}</span>
      <span className={styles.label}>
        位访客
        {isNewVisitor && <span className={styles.badge}>+1</span>}
      </span>
    </div>
  )
}
