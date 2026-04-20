'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { generateAutoReply } from '@/lib/auto-reply'
import styles from './Guestbook.module.css'

// ── 数据结构 ──────────────────────────────────────────
interface Message {
  id: string
  name: string
  content: string
  time: string
  is_owner: boolean
}

const STORAGE_KEY = 'xiaochuizi_guestbook_local'

// ── 静态示例留言（空状态展示用）─────────────────────────
const SAMPLE_MESSAGES: Message[] = [
  {
    id: 'sample-1',
    name: '路过的猫',
    content: '偶然发现这个站，内容很有意思。AI 助手有自己的记忆仓库这个设定很酷，支持一下！',
    time: new Date(Date.now() - 2 * 24 * 3600_000).toISOString(),
    is_owner: false,
  },
  {
    id: 'sample-2',
    name: '三锤',
    content: '欢迎欢迎！这里是访客和站点对话的地方，随便说点什么吧。',
    time: new Date(Date.now() - 2 * 24 * 3600_000 + 300_000).toISOString(),
    is_owner: true,
  },
  {
    id: 'sample-3',
    name: '效率控',
    content: '这个博客的深色主题很舒服，阅读体验不错。顺便问一下，监控台是怎么实现的？',
    time: new Date(Date.now() - 1 * 24 * 3600_000).toISOString(),
    is_owner: false,
  },
]

// ── 时间格式化 ──────────────────────────────────────────
function formatTime(ts: string): string {
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)} 天前`
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// ── 欢迎卡片 ────────────────────────────────────────────
function GuestbookHero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroIcon} aria-hidden="true">💬</div>
      <div className={styles.heroContent}>
        <h2 className={styles.heroTitle}>访客与站点的对话空间</h2>
        <p className={styles.heroDesc}>
          随手留个「你好」，让这个站记住你来过。
          你的留言会被小锤子看到，也会有回复。
        </p>
      </div>
    </div>
  )
}

// ── 留言卡片 ────────────────────────────────────────────
function MessageCard({ msg }: { msg: Message }) {
  const showAutoReply = !msg.is_owner
  const reply = showAutoReply ? generateAutoReply(msg.name, msg.content) : null

  return (
    <article className={`${styles.card} ${msg.is_owner ? styles.cardHammer : ''}`}>
      <div className={styles.cardHeader}>
        <span className={msg.is_owner ? styles.cardNameHammer : styles.cardName}>
          {msg.is_owner ? '🔨 ' : ''}{msg.name}
        </span>
        <time className={styles.cardTime} dateTime={msg.time}>
          {formatTime(msg.time)}
        </time>
      </div>
      <p className={styles.cardContent}>{msg.content}</p>
      {reply && (
        <p className={styles.autoReply}>🔨 {reply}</p>
      )}
    </article>
  )
}

// ── 留言列表 ────────────────────────────────────────────
function GuestbookList({ 
  messages, 
  isLoaded,
  isSample 
}: { 
  messages: Message[] 
  isLoaded: boolean
  isSample: boolean
}) {
  if (!isLoaded) {
    return (
      <div className={styles.listLoading}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonCard}></div>
          <div className={styles.skeletonCard}></div>
          <div className={styles.skeletonCard}></div>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">📭</span>
        <p className={styles.emptyTitle}>还没有留言</p>
        <p className={styles.emptyHint}>做第一个访客，留下点什么吧。</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {isSample && (
        <div className={styles.sampleLabel}>
          <span>示例对话</span>
        </div>
      )}
      {messages.slice(0, 5).map((msg) => (
        <MessageCard key={msg.id} msg={msg} />
      ))}
      {isSample && (
        <p className={styles.sampleHint}>
          以上为示例。真实留言会在下方显示。
        </p>
      )}
    </div>
  )
}

// ── 主组件 ────────────────────────────────────────────
export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSampleData, setIsSampleData] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    if (!supabase) {
      try {
        const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        if (local.length > 0) {
          setMessages(local)
          setIsSampleData(false)
        } else {
          setMessages(SAMPLE_MESSAGES)
          setIsSampleData(true)
        }
      } catch {
        setMessages(SAMPLE_MESSAGES)
        setIsSampleData(true)
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

      if (!data || data.length === 0) {
        setMessages(SAMPLE_MESSAGES)
        setIsSampleData(true)
      } else {
        const msgs: Message[] = (data || []).map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: r.nickname as string,
          content: r.content as string,
          time: r.created_at as string,
          is_owner: (r.is_owner as boolean | undefined) ?? false,
        }))
        setMessages(msgs)
        setIsSampleData(false)
      }
    } catch {
      // 出错时使用示例数据
      setMessages(SAMPLE_MESSAGES)
      setIsSampleData(true)
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

      // 如果当前显示的是示例数据，先清除
      if (isSampleData) {
        setMessages([])
        setIsSampleData(false)
      }

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
        setMessages(prev => [newMsg, ...prev])
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
      {/* 欢迎卡片 */}
      <GuestbookHero />

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
            {submitted ? '✨ 收到' : submitting ? '提交中...' : '留下点什么'}
          </button>
        </div>
      </form>

      {/* 留言列表 */}
      <GuestbookList 
        messages={messages} 
        isLoaded={!loading}
        isSample={isSampleData}
      />
    </div>
  )
}
