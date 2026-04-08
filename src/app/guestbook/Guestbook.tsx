'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './Guestbook.module.css'

interface Message {
  id: string
  name: string
  content: string
  time: string
}

const STORAGE_KEY = 'xiaochuizi_guestbook'

function getMessages(): Message[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveMessages(msgs: Message[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs))
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 预设回复（大爷来自己回复自己）
const autoReplies: Record<string, string> = {
  '大爷': '欢迎常来！',
  '主人': '收到，小锤子在线 🛠️',
  '你好': '你好呀 👋',
}

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(getMessages().reverse())
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return

    setSubmitting(true)
    setTimeout(() => {
      const newMsg: Message = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: name.trim(),
        content: content.trim(),
        time: new Date().toISOString(),
      }
      const updated = [newMsg, ...getMessages()]
      saveMessages(updated)
      setMessages(updated)
      setName('')
      setContent('')
      setSubmitting(false)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)

      // 大爷来访自动回复
      const reply = autoReplies[name.trim()]
      if (reply) {
        setTimeout(() => {
          const replyMsg: Message = {
            id: `${Date.now()}-reply-${Math.random().toString(36).slice(2)}`,
            name: '🔨 小锤子',
            content: reply,
            time: new Date().toISOString(),
          }
          const withReply = [replyMsg, ...getMessages()]
          saveMessages(withReply)
          setMessages(withReply)
        }, 1500)
      }
    }, 400)
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
        {messages.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📭</span>
            <p>还没有留言，来做第一个访客吧。</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`${styles.card} ${styles.cardEnter}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardName}>{msg.name}</span>
                <span className={styles.cardTime}>{formatTime(new Date(msg.time).getTime())}</span>
              </div>
              <p className={styles.cardContent}>{msg.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
