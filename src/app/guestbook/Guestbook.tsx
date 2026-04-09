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

// 判断是否是"锤子"类回复者（大锤/锤子三号/小锤子）
function isHammer(name: string): boolean {
  return (
    name === OWNER_NAME ||
    name.includes('大锤') ||
    name.includes('锤子三号') ||
    name.includes('锤子')
  )
}

// ────────────────────────────────────────────────
// 将扁平消息分组为线程
// 每条锤子回复归到前面最近的访客消息下
// ────────────────────────────────────────────────
interface ThreadBlock {
  visitor: Message
  replies: Message[]
}

function buildThreads(msgs: Message[]): ThreadBlock[] {
  const threads: ThreadBlock[] = []
  for (const msg of msgs) {
    if (isHammer(msg.name)) {
      // 回复：归到上一个 thread
      if (threads.length > 0) {
        threads[threads.length - 1].replies.push(msg)
      } else {
        // 没有可归属的访客，自己开一个（兜底）
        threads.push({ visitor: msg, replies: [] })
      }
    } else {
      // 访客消息 → 新线程
      threads.push({ visitor: msg, replies: [] })
    }
  }
  return threads
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

  const threads = buildThreads(messages)

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

      {/* 线程化留言列表 */}
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
          threads.map((thread, idx) => (
            <div key={thread.visitor.id} className={styles.threadBlock}>
              {/* 访客主消息 */}
              <div className={`${styles.card} ${styles.cardEnter}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardName}>{thread.visitor.name}</span>
                  <span className={styles.cardTime}>{formatTime(thread.visitor.time)}</span>
                </div>
                <p className={styles.cardContent}>{thread.visitor.content}</p>
              </div>

              {/* 锤子们的回复（如果有） */}
              {thread.replies.map((reply, ridx) => (
                <div key={reply.id} className={styles.replyBlock}>
                  <div className={`${styles.replyLine} ${ridx === thread.replies.length - 1 ? styles.replyLineLast : ''}`} />
                  <div
                    className={`${styles.card} ${styles.cardEnter} ${styles.cardReply} ${
                      reply.name.includes('大锤')
                        ? styles.cardDaChui
                        : reply.name.includes('锤子三号')
                        ? styles.cardThreeChui
                        : styles.cardOwner
                    }`}
                  >
                    <div className={styles.cardHeader}>
                      <span className={styles.replyBadge}>
                        {reply.name.includes('大锤')
                          ? '🔨 大锤'
                          : reply.name.includes('锤子三号')
                          ? '🔨 锤子三号'
                          : '🔨 小锤子'}
                      </span>
                      <span className={styles.cardTime}>{formatTime(reply.time)}</span>
                    </div>
                    <p className={styles.cardContent}>{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
