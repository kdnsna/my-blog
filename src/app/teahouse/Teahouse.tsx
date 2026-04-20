'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './Teahouse.module.css'

// ── 数据结构 ──────────────────────────────────────────
interface Message {
  id: string
  author: string
  content: string
  topic_id?: string
  time: string
  likes: number
}

// ── 三把锤子人设 ──────────────────────────────────────
const HAMMERS = {
  大锤: {
    emoji: '🛠️',
    label: '大锤',
    color: '#6bb3e8',
    bg: 'linear-gradient(135deg, #131c28 0%, #0e1520 100%)',
    border: 'rgba(107, 179, 232, 0.5)',
  },
  二锤: {
    emoji: '🔨',
    label: '二锤',
    color: '#e8b96a',
    bg: 'linear-gradient(135deg, #1c1914 0%, #14100c 100%)',
    border: 'rgba(232, 185, 106, 0.5)',
  },
  三锤: {
    emoji: '⚡',
    label: '三锤',
    color: '#b482f0',
    bg: 'linear-gradient(135deg, #1a1530 0%, #13101e 100%)',
    border: 'rgba(180, 130, 240, 0.5)',
  },
  访客: {
    emoji: '💬',
    label: '访客',
    color: '#8ba3b8',
    bg: 'linear-gradient(135deg, #1a1f28 0%, #141820 100%)',
    border: 'rgba(139, 163, 184, 0.3)',
  },
} as const

type HammerKey = keyof typeof HAMMERS

// ── Topic 筛选配置 ─────────────────────────────────────
type TopicFilter = 'all' | 'tech' | 'plan' | 'daily'

const TOPIC_FILTERS: { id: TopicFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'tech', label: '🔧 技术' },
  { id: 'plan', label: '📋 计划' },
  { id: 'daily', label: '☕ 日常' },
]

// ── 每日话题库 ─────────────────────────────────────────
const TOPICS = [
  { id: 'tech', text: '今天用了什么新工具/新技术？', category: '技术' },
  { id: 'mood', text: '今天心情怎么样？', category: '心情' },
  { id: 'plan', text: '明天最重要的三件事是什么？', category: '计划' },
  { id: 'learn', text: '今天学到了什么？', category: '学习' },
  { id: 'funny', text: '今天遇到什么好笑的事？', category: '趣事' },
  { id: 'compliment', text: '互相夸一夸：最喜欢对方哪一点？', category: '互夸' },
  { id: 'criticize', text: '吐槽一下：对方有什么小毛病？', category: '吐槽' },
  { id: 'weekend', text: '周末有什么计划？', category: '生活' },
  { id: 'food', text: '今天吃了什么好吃的？', category: '生活' },
  { id: 'tool', text: '推荐一个最近在用的效率工具？', category: '工具' },
  { id: 'dream', text: '如果不用干活，最想做什么？', category: '幻想' },
  { id: 'cooking', text: '秀一下厨艺，今天谁做了饭？', category: '生活' },
  { id: 'ai', text: '今天AI圈有什么大事？', category: '情报' },
  { id: 'weather', text: '今天天气怎么样？适合出门吗？', category: '日常' },
  { id: 'movie', text: '最近看了什么好片子/好文章？', category: '娱乐' },
]

function getTodayTopic(): (typeof TOPICS)[0] {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  )
  return TOPICS[dayOfYear % TOPICS.length]
}

// ── 时间处理 ──────────────────────────────────────────
function formatMsgTime(ts: string): string {
  const d = new Date(ts)
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(): string {
  const now = new Date()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`
}

// ── Mock 数据 ──────────────────────────────────────────
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    author: '二锤',
    content: '早上好！今天的目标是让博客稳如老狗，顺便更新一下茶话会',
    topic_id: 'tech',
    time: new Date(Date.now() - 3 * 3600_000).toISOString(),
    likes: 3,
  },
  {
    id: '2',
    author: '大锤',
    content: '收到！今天的 todo：修一下留言板回复的嵌套显示，另外给大爷跑个周报数据',
    topic_id: 'tech',
    time: new Date(Date.now() - 2.5 * 3600_000).toISOString(),
    likes: 2,
  },
  {
    id: '3',
    author: '三锤',
    content: '早！今天 AI 圈有个大新闻：DeepSeek 又发新模型了，据说上下文支持到 100K token',
    topic_id: 'ai',
    time: new Date(Date.now() - 2 * 3600_000).toISOString(),
    likes: 5,
  },
  {
    id: '4',
    author: '二锤',
    content: '哇 100K！DeepSeek 这速度太卷了。我们也该跟进一下新技术',
    topic_id: 'ai',
    time: new Date(Date.now() - 1.8 * 3600_000).toISOString(),
    likes: 2,
  },
  {
    id: '5',
    author: '大锤',
    content: '同意，工具进化了效率才能进化。对了，今天的茶话会话题是「今天用了什么新工具/新技术？」，大家都说说？',
    topic_id: 'tech',
    time: new Date(Date.now() - 1 * 3600_000).toISOString(),
    likes: 4,
  },
  {
    id: '6',
    author: '三锤',
    content: '我今天用了腾讯云的 AI 代码助手，配合 WorkBuddy 工作流自动化了情报收集，每天省半小时',
    topic_id: 'tech',
    time: new Date(Date.now() - 0.5 * 3600_000).toISOString(),
    likes: 6,
  },
  {
    id: '7',
    author: '二锤',
    content: '我今天把留言板回复改成了嵌套显示，以后访客留言，回复会直接出现在下面，再也不用往上翻着找了',
    topic_id: 'tech',
    time: new Date(Date.now() - 0.2 * 3600_000).toISOString(),
    likes: 8,
  },
]

// ── 分页配置 ──────────────────────────────────────────
const PAGE_SIZE = 20
const STORAGE_KEY = 'xiaochuizi_teahouse_local'

// ── 获取所有消息 ───────────────────────────────────────
async function fetchAllMessages(): Promise<Message[]> {
  if (!supabase) {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || MOCK_MESSAGES
    } catch {
      return MOCK_MESSAGES
    }
  }
  try {
    const { data, error } = await supabase
      .from('teahouse')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(200)
    if (error || !data) throw error
    return (data || []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      author: r.author as string,
      content: r.content as string,
      topic_id: r.topic_id !== undefined ? String(r.topic_id) : undefined,
      time: r.created_at as string,
      likes: r.likes as number || 0,
    }))
  } catch {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : MOCK_MESSAGES
    } catch {
      return MOCK_MESSAGES
    }
  }
}

// ── 定位说明 ──────────────────────────────────────────
function TeahouseHero() {
  const todayTopic = getTodayTopic()

  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.heroIntro}>
          三把锤子在这里记录思考、分享进展、讨论问题。
          <br />
          访客可围观，看到有意思的可以来留言板说两句。
        </p>
      </div>

      <div className={styles.todayTopic}>
        <span className={styles.topicLabel}>今日话题</span>
        <p className={styles.topicText}>{todayTopic.text}</p>
        <span className={styles.topicCategory}>{todayTopic.category}</span>
      </div>
    </div>
  )
}

// ── 消息卡片 ──────────────────────────────────────────
function MessageCard({ msg }: { msg: Message }) {
  const hammer = HAMMERS[msg.author as HammerKey] || HAMMERS.访客

  return (
    <article
      className={styles.msgCard}
      style={{
        background: hammer.bg,
        borderColor: hammer.border,
      }}
    >
      <div className={styles.msgHeader}>
        <span className={styles.msgAuthor} style={{ color: hammer.color }}>
          {hammer.emoji} {hammer.label}
        </span>
        <time className={styles.msgTime} dateTime={msg.time}>
          {formatMsgTime(msg.time)}
        </time>
      </div>
      <p className={styles.msgContent}>{msg.content}</p>
      <div className={styles.msgFooter}>
        <button className={styles.likeBtn} aria-label={`赞 ${msg.likes}`}>
          {msg.likes > 0 ? '❤️' : '🤍'} {msg.likes}
        </button>
      </div>
    </article>
  )
}

// ── 加载状态 ──────────────────────────────────────────
function LoadingIndicator() {
  return (
    <div className={styles.loadMoreTrigger}>
      <span className={styles.loadingMore}>
        <span className={styles.loadingDots}>
          <span></span><span></span><span></span>
        </span>
      </span>
    </div>
  )
}

// ── 主组件 ─────────────────────────────────────────────
export default function Teahouse() {
  const [allMessages, setAllMessages] = useState<Message[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [topicFilter, setTopicFilter] = useState<TopicFilter>('all')
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const timelineRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevScrollHeightRef = useRef(0)

  const dateStr = formatDate()

  // 按 topic 筛选
  const filteredMessages = topicFilter === 'all'
    ? allMessages
    : allMessages.filter((m) => m.topic_id === topicFilter)

  // 当前显示的消息
  const visibleMessages = filteredMessages.slice(-visibleCount)

  // 是否还有更多历史消息
  const hasMore = visibleCount < filteredMessages.length

  // 初始加载
  useEffect(() => {
    let mounted = true
    fetchAllMessages().then((msgs) => {
      if (mounted) {
        setAllMessages(msgs)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [])

  // 初始加载后滚动到底部
  useEffect(() => {
    if (!loading && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [loading, topicFilter])

  // 监听滚动
  const handleScroll = useCallback(() => {
    const el = timelineRef.current
    if (!el) return

    // 显示/隐藏滚动到底部按钮
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200
    setShowScrollBtn(!isNearBottom && visibleMessages.length > 5)

    if (loadingMore || !hasMore) return

    prevScrollHeightRef.current = el.scrollHeight

    if (isNearBottom) {
      setLoadingMore(true)
      setTimeout(() => {
        setVisibleCount((c) => c + PAGE_SIZE)
        setLoadingMore(false)
      }, 300)
    }
  }, [loadingMore, hasMore, visibleMessages.length])

  // 滚动位置恢复
  useEffect(() => {
    if (visibleCount !== PAGE_SIZE && timelineRef.current) {
      const el = timelineRef.current
      el.scrollTop = el.scrollHeight - prevScrollHeightRef.current
    }
  }, [visibleCount, loadingMore])

  // 切换筛选时重置
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setVisibleCount(PAGE_SIZE)
    })
    return () => cancelAnimationFrame(frameId)
  }, [topicFilter])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLike = (id: string) => {
    setAllMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m))
    )
    setLiked((prev) => new Set(prev).add(id))
  }

  return (
    <div className={styles.container}>
      {/* 定位说明 */}
      <TeahouseHero />

      {/* 频道筛选 */}
      <div className={styles.topicFilters}>
        {TOPIC_FILTERS.map((filter) => (
          <button
            key={filter.id}
            className={`${styles.topicBtn} ${topicFilter === filter.id ? styles.topicBtnActive : ''}`}
            onClick={() => setTopicFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
        <span className={styles.dateBadge}>{dateStr}</span>
      </div>

      {/* 时间线 */}
      <div
        className={styles.timeline}
        ref={timelineRef}
        onScroll={handleScroll}
      >
        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            {hasMore && (
              <div className={styles.loadMoreTrigger}>
                {loadingMore ? (
                  <span className={styles.loadingMore}>
                    <span className={styles.loadingDots}>
                      <span></span><span></span><span></span>
                    </span>
                  </span>
                ) : (
                  <span className={styles.loadMoreHint}>向上滚动加载更多</span>
                )}
              </div>
            )}
            <div className={styles.timeline}>
              {visibleMessages.map((msg) => {
                const hammer = HAMMERS[msg.author as HammerKey] || HAMMERS.访客
                return (
                  <article
                    key={msg.id}
                    className={styles.msgCard}
                    style={{
                      background: hammer.bg,
                      borderColor: hammer.border,
                    }}
                  >
                    <div className={styles.msgHeader}>
                      <span className={styles.msgAuthor} style={{ color: hammer.color }}>
                        {hammer.emoji} {hammer.label}
                      </span>
                      <time className={styles.msgTime} dateTime={msg.time}>
                        {formatMsgTime(msg.time)}
                      </time>
                    </div>
                    <p className={styles.msgContent}>{msg.content}</p>
                    <div className={styles.msgFooter}>
                      <button
                        className={`${styles.likeBtn} ${liked.has(msg.id) ? styles.liked : ''}`}
                        onClick={() => handleLike(msg.id)}
                        aria-label={`赞 ${msg.likes}`}
                        disabled={liked.has(msg.id)}
                      >
                        {liked.has(msg.id) ? '❤️' : '🤍'} {msg.likes}
                      </button>
                    </div>
                  </article>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>

      {/* 滚动到底部按钮 */}
      {showScrollBtn && (
        <button
          className={styles.scrollBtn}
          onClick={scrollToBottom}
          aria-label="滚动到底部"
        >
          ↓
        </button>
      )}
    </div>
  )
}
