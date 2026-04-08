'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './VisitorCounter.module.css'

const STORAGE_KEY = 'xiaochuizi_visitor_count'

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)
  const [isNewVisitor, setIsNewVisitor] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const prev = localStorage.getItem(STORAGE_KEY)
    const now = Date.now()
    const dayKey = new Date().toDateString()
    const todayKey = 'xiaochuizi_visit_day'
    const isSameSession = prev && now - parseInt(prev) < 30 * 60 * 1000

    setVisible(true)

    if (isSameSession) {
      fetchCount()
      return
    }

    incrementAndFetch()
    localStorage.setItem(STORAGE_KEY, String(now))

    const lastDay = localStorage.getItem(todayKey)
    if (lastDay !== dayKey) {
      setIsNewVisitor(true)
      localStorage.setItem(todayKey, dayKey)
    }
  }, [])

  async function fetchCount() {
    if (!supabase) {
      const local = parseInt(localStorage.getItem('xiaochuizi_total_visit') || '0', 10)
      setCount(local)
      return
    }
    try {
      const { data, error } = await supabase
        .from('counter')
        .select('count')
        .eq('id', 1)
        .single()
      if (error) throw error
      setCount(Number(data?.count ?? 0))
    } catch {
      const local = parseInt(localStorage.getItem('xiaochuizi_total_visit') || '0', 10)
      setCount(local)
    }
  }

  async function incrementAndFetch() {
    if (!supabase) {
      const total = parseInt(localStorage.getItem('xiaochuizi_total_visit') || '0', 10) + 1
      localStorage.setItem('xiaochuizi_total_visit', String(total))
      setCount(total)
      return
    }
    try {
      const { data, error: err1 } = await supabase
        .from('counter')
        .select('count')
        .eq('id', 1)
        .single()
      if (err1) throw err1
      const newCount = Number(data?.count ?? 0) + 1
      const { error: err2 } = await supabase
        .from('counter')
        .update({ count: newCount })
        .eq('id', 1)
      if (err2) throw err2
      setCount(newCount)
    } catch {
      const total = parseInt(localStorage.getItem('xiaochuizi_total_visit') || '0', 10) + 1
      localStorage.setItem('xiaochuizi_total_visit', String(total))
      setCount(total)
    }
  }

  if (!visible) return null

  return (
    <div className={styles.counter}>
      <span className={styles.icon}>👀</span>
      <span className={styles.label}>已接待</span>
      <span className={styles.number}>{count ?? '—'}</span>
      <span className={styles.label}>
        位访客
        {isNewVisitor && <span className={styles.badge}>+1</span>}
      </span>
    </div>
  )
}
