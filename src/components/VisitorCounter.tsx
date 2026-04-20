'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './VisitorCounter.module.css'

const STORAGE_KEY = 'xiaochuizi_visitor_count'

// 提前声明函数，避免访问顺序问题
async function fetchCount(
  supabaseClient: typeof supabase,
  setCount: (v: string | null) => void
) {
  if (!supabaseClient) {
    const stored = localStorage.getItem('xiaochuizi_total_visit')
    setCount(stored || '0')
    return
  }
  try {
    const { data, error } = await supabaseClient
      .from('counter')
      .select('count')
      .eq('id', 1)
      .single()
    if (error) throw error
    setCount(String(Number(data?.count ?? 0)))
  } catch {
    const stored = localStorage.getItem('xiaochuizi_total_visit')
    setCount(stored || '0')
  }
}

async function incrementAndFetch(
  supabaseClient: typeof supabase,
  setCount: (v: string | null) => void
) {
  if (!supabaseClient) {
    const total = parseInt(localStorage.getItem('xiaochuizi_total_visit') || '0', 10) + 1
    localStorage.setItem('xiaochuizi_total_visit', String(total))
    setCount(String(total))
    return
  }
  try {
    const { data, error: err1 } = await supabaseClient
      .from('counter')
      .select('count')
      .eq('id', 1)
      .single()
    if (err1) throw err1
    const newCount = Number(data?.count ?? 0) + 1
    const { error: err2 } = await supabaseClient
      .from('counter')
      .update({ count: newCount })
      .eq('id', 1)
    if (err2) throw err2
    setCount(String(newCount))
  } catch {
    const total = parseInt(localStorage.getItem('xiaochuizi_total_visit') || '0', 10) + 1
    localStorage.setItem('xiaochuizi_total_visit', String(total))
    setCount(String(total))
  }
}

export default function VisitorCounter() {
  // null 表示未加载，不显示任何占位
  const [count, setCount] = useState<string | null>(null)
  const [isNewVisitor, setIsNewVisitor] = useState(false)

  useEffect(() => {
    const visitTimer = window.setTimeout(() => {
      const prev = localStorage.getItem(STORAGE_KEY)
      const now = Date.now()
      const dayKey = new Date().toDateString()
      const todayKey = 'xiaochuizi_visit_day'
      const isSameSession = prev && now - parseInt(prev) < 30 * 60 * 1000

      if (isSameSession) {
        fetchCount(supabase, setCount)
        return
      }

      incrementAndFetch(supabase, setCount)
      localStorage.setItem(STORAGE_KEY, String(now))

      // 延迟设置新访客标记
      const lastDay = localStorage.getItem(todayKey)
      if (lastDay !== dayKey) {
        window.setTimeout(() => setIsNewVisitor(true), 100)
        localStorage.setItem(todayKey, dayKey)
      }
    }, 0)

    return () => window.clearTimeout(visitTimer)
  }, [])

  // 加载完成前不渲染组件
  if (count === null) {
    return null
  }

  return (
    <div className={styles.counter}>
      <span className={styles.icon}>👀</span>
      <span className={styles.label}>已接待</span>
      <span className={styles.number}>{count}</span>
      <span className={styles.label}>
        位访客
        {isNewVisitor && <span className={styles.badge}>+1</span>}
      </span>
    </div>
  )
}
