'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { generateAutoReply } from '@/lib/auto-reply'
import styles from './Guestbook.module.css'

interface Message {
  id: string
  name: string
  content: string
  time: string
  is_owner: boolean
}

interface GuestbookRow {
  id: string | number
  nickname: string
  content: string
  created_at: string
  is_owner: boolean | null
}

const STORAGE_KEY = 'xiaochuizi_guestbook_local'

// 引导语示例
const GUIDE_EXAMPLES = [
  '第一次来这里，随手留个「你好」也挺好的',
  '对站点有什么建议，欢迎提出',
  '有问题想问？留言区也是个好地方',
  '看到有意思的内容？来打个招呼吧',
]

function getRandomGuide(): string {
  return GUIDE_EXAMPLES[Math.floor(Math.random() * GUIDE_EXAMPLES.length)]
}

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
  const [randomGuide] = useState(getRandomGuide)

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
        .select('id, nickname, content, created_at, is_owner')
        .order('created_at', { ascending: false })
        .limit(100)
      if (error) throw error
      const msgs: Message[] = ((data || []) as GuestbookRow[]).map((r) => ({
        id: String(r.id),
        name: r.nickname,
        content: r.content,
        time: r.created_at,
        is_owner: r.is_owner ?? false,
      }))
      setMessages(msgs)
    } catch {
      setMessages([])
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

      if (!supabase) {
        const localMsgs: Message[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        const newMsg: Message = {
          id: `${Date.now()}`,
          name: trimmedName,
          content: trimmedContent,
          time: new Date().toISOString(),
          is_owner: false,
        }
        const updated = [newMsg, ...localMsgs]
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
        is_owner: false,
      })
      if (error) throw error

      await fetchMessages()
      setName('')
      setContent('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch {
      alert('留言失败，请稍后再试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* 引导卡片 */}
      <div className={styles.guide} role="note" aria-label="留言引导">
        <span className={styles.guideIcon} role="img" aria-hidden="true">💬</span>
        <p className={styles.guideText}>
          {randomGuide}
        </p>
      </div>

      {/* 表单 */}
      <form className={styles.form} onSubmit={handleSubmit} aria-label="留言表单">
        <div className={styles.formRow}>
          <label htmlFor="guestbook-name" className="sr-only">名字</label>
          <input
            id="guestbook-name"
            className={styles.input}
            type="text"
            placeholder="怎么称呼你？"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            required
            aria-describedby="name-hint"
          />
          <span id="name-hint" className="sr-only">最多20个字符</span>
        </div>
        <div className={styles.formRow}>
          <label htmlFor="guestbook-content" className="sr-only">留言内容</label>
          <textarea
            id="guestbook-content"
            className={styles.textarea}
            placeholder="想说点什么..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={500}
            required
            aria-describedby="content-hint"
          />
          <span id="content-hint" className="sr-only">最多500个字符</span>
        </div>
        <div className={styles.formFooter}>
          <span className={styles.charCount} aria-live="polite">{content.length}/500</span>
          <button
            className={`${styles.submitBtn} ${submitting ? styles.submitting : ''} ${submitted ? styles.submitted : ''}`}
            type="submit"
            disabled={submitting || !name.trim() || !content.trim()}
            aria-busy={submitting}
          >
            {submitted ? '✨ 收到' : submitting ? '留下中...' : '留下点什么'}
          </button>
        </div>
      </form>

      {/* 留言列表 */}
      <div className={styles.list}>
        {loading ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>⏳</span>
            <p>加载中...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📭</span>
            <p>还没有留言。</p>
            <p className={styles.emptyHint}>做第一个访客，留下点什么吧。</p>
          </div>
        ) : (
          messages.map((msg) => {
            const showAutoReply = !msg.is_owner
            const reply = showAutoReply ? generateAutoReply(msg.name, msg.content) : null
            return (
              <div
                key={msg.id}
                className={`${styles.card} ${styles.cardEnter} ${msg.is_owner ? styles.cardHammer : ''}`}
              >
                <div className={styles.cardHeader}>
                  <span className={msg.is_owner ? styles.cardNameHammer : styles.cardName}>
                    {msg.is_owner ? '🔨 ' : ''}{msg.name}
                  </span>
                  <span className={styles.cardTime}>{formatTime(msg.time)}</span>
                </div>
                <p className={styles.cardContent}>{msg.content}</p>
                {reply && (
                  <p className={styles.autoReply}>🔨 {reply}</p>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
