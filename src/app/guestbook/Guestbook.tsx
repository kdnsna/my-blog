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

function isHammer(name: string): boolean {
  return (
    name === OWNER_NAME ||
    name.includes('大锤') ||
    name.includes('锤子三号') ||
    name.includes('锤子')
  )
}

// ─────────────────────────────────────────────
// 把扁平消息转成嵌套结构
// 每条访客消息 + 直接跟在它后面的锤子回复 → 一个 thread
// 时间升序：父在前、子在后，嵌套显示
// ─────────────────────────────────────────────
interface ThreadBlock {
  parent: Message
  replies: Message[]
}

function buildThreads(msgs: Message[]): ThreadBlock[] {
  // 时间升序排列：最早的在前，方便嵌套展示
  const sorted = [...msgs].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  )
  const threads: ThreadBlock[] = []
  for (const msg of sorted) {
    if (isHammer(msg.name)) {
      // 回复 → 归到上一个 thread
      if (threads.length > 0) {
        threads[threads.length - 1].replies.push(msg)
      } else {
        // 兜底：没有父消息就自己当父
        threads.push({ parent: msg, replies: [] })
      }
    } else {
      // 访客消息 → 新线程
      threads.push({ parent: msg, replies: [] })
    }
  }
  return threads
}

function getCardClass(name: string, isReply: boolean): string {
  const base = isReply ? `${styles.card} ${styles.cardReply}` : styles.card
  if (name.includes('大锤')) return `${base} ${styles.cardDaChui}`
  if (name.includes('锤子三号')) return `${base} ${styles.cardThreeChui}`
  if (isHammer(name)) return `${base} ${styles.cardOwner}`
  return `${base} ${styles.cardVisitor}`
}

function getHammerBadge(name: string): string {
  if (name.includes('大锤')) return '🔨 大锤'
  if (name.includes('锤子三号')) return '🔨 锤子三号'
  return '🔨 小锤子'
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
        .order('created_at', { ascending: true })
        .limit(100)
      if (error) throw error
      const msgs: Message[] = (data || []).map((r: any) => ({
        id: String(r.id),
        name: r.nickname,
        content: r.content,
        time: r.created_at,
        isOwner: !!r.is_owner,
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
        const localMsgs: Message[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        const newMsg: Message = {
          id: `${Date.now()}`,
          name: trimmedName,
          content: trimmedContent,
          time: new Date().toISOString(),
        }
        const updated = [...localMsgs, newMsg]
        if (replyText) {
          updated.push({
            id: `${Date.now() + 1}`,
            name: OWNER_NAME,
            content: replyText,
            time: new Date(Date.now() + 1500).toISOString(),
            isOwner: true,
          })
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

  // 按时间降序排列用于显示（最新的在上面）
  const threads = buildThreads(messages).reverse()

  return (
    <div className={styles.container}>
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
          threads.map((thread, idx) => {
            const isOwner = isHammer(thread.parent.name)
            return (
              <div key={thread.parent.id} className={styles.threadBlock}>
                {/* 父消息 */}
                <div className={`${getCardClass(thread.parent.name, false)} ${styles.cardEnter}`}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardName}>{thread.parent.name}</span>
                    <span className={styles.cardTime}>{formatTime(thread.parent.time)}</span>
                  </div>
                  <p className={styles.cardContent}>{thread.parent.content}</p>
                </div>

                {/* 直接嵌套在父消息下的回复 */}
                {thread.replies.map((reply, ridx) => (
                  <div key={reply.id} className={styles.replyNested}>
                    <div className={`${getCardClass(reply.name, true)} ${styles.cardEnter}`}>
                      <div className={styles.cardHeader}>
                        <span className={styles.replyBadge}>{getHammerBadge(reply.name)}</span>
                        <span className={styles.cardTime}>{formatTime(reply.time)}</span>
                      </div>
                      <p className={styles.cardContent}>{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
