'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { generateAutoReply } from '@/lib/auto-reply'
import styles from './Guestbook.module.css'

interface Message {
  id: string
  name: string
  content: string
  time: string
  isOwner?: boolean
}

const STORAGE_KEY = 'xiaochuizi_guestbook_local'
const OWNER_NAME = '🔨 小锤子'

function formatTime(ts: string): string {
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    if (!supabase) {
      try {
        const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        setMessages(local)
      } catch {
        setMessages([])
      }
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      const msgs: Message[] = (data || []).map((r: any) => ({
        id: String(r.id),
        name: r.nickname,
        content: r.content,
        time: r.created_at,
      }))
      setMessages(msgs)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs))
    } catch {
      try {
        const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        setMessages(local)
      } catch {
        setMessages([])
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return

    setSubmitting(true)
    try {
      const trimmedName = name.trim()
      const trimmedContent = content.trim()
      const replyText = generateAutoReply(trimmedName, trimmedContent)

      if (!supabase) {
        // 降级到本地模式，同样支持自动回复
        const localMsgs: Message[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        const newMsg: Message = {
          id: `${Date.now()}`,
          name: trimmedName,
          content: trimmedContent,
          time: new Date().toISOString(),
        }
        const updated = [newMsg, ...localMsgs]

        if (replyText) {
          const replyMsg: Message = {
            id: `${Date.now() + 1}`,
            name: OWNER_NAME,
            content: replyText,
            time: new Date(Date.now() + 1500).toISOString(),
            isOwner: true,
          }
          updated.unshift(replyMsg)
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        setMessages(updated)
        setName('')
        setContent('')
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
        return
      }

      const { error } = await supabase.from('guestbook').insert({
        nickname: trimmedName,
        content: trimmedContent,
      })
      if (error) throw error

      await fetchMessages()
      setName('')
      setContent('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)

      if (replyText) {
        setTimeout(async () => {
          await supabase!.from('guestbook').insert({
            nickname: OWNER_NAME,
            content: replyText,
            is_owner: true,
          })
          await fetchMessages()
        }, 1800)
      }
    } catch {
      alert('留言失败，请稍后再试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* 留言表单 */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <input
            className={styles.input}
            type="text"
            placeholder="怎么称呼你？"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            required
          />
        </div>
        <div className={styles.formRow}>
          <textarea
            className={styles.textarea}
            placeholder="想说点什么..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={500}
            required
          />
        </div>
        <div className={styles.formFooter}>
          <span className={styles.charCount}>{content.length}/500</span>
          <button
            className={`${styles.submitBtn} ${submitting ? styles.submitting : ''} ${submitted ? styles.submitted : ''}`}
            type="submit"
            disabled={submitting || !name.trim() || !content.trim()}
          >
            {submitted ? '✨ 收到' : submitting ? '留下中...' : '留下点什么'}
          </button>
        </div>
      </form>

      {/* 留言列表 */}
      <div className={styles.list} ref={listRef}>
        {loading ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>⏳</span>
            <p>加载中...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📭</span>
            <p>还没有留言，来做第一个访客吧。</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwner = msg.isOwner || msg.name === OWNER_NAME
            return (
              <div
                key={msg.id}
                className={`${styles.card} ${styles.cardEnter} ${isOwner ? styles.cardOwner : ''}`}
              >
                <div className={styles.cardHeader}>
                  <span className={`${styles.cardName} ${isOwner ? styles.ownerName : ''}`}>
                    {msg.name}
                  </span>
                  <span className={styles.cardTime}>{formatTime(msg.time)}</span>
                </div>
                <p className={styles.cardContent}>{msg.content}</p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
