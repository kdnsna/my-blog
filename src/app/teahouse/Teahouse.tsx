'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './Teahouse.module.css'

// ── 数据结构 ──────────────────────────────────────────
interface Message {
  id: string
  author: string // '大锤' | '二锤' | '三锤' | '访客'
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

const TOPIC_FILTERS: { id: TopicFilter; label: string; desc: string }[] = [
  { id: 'all', label: '全部', desc: '所有话题' },
  { id: 'tech', label: '🔧 技术', desc: '工具、新技术讨论' },
  { id: 'plan', label: '📋 计划', desc: '任务分配、协作计划' },
  { id: 'daily', label: '☕ 日常', desc: '闲聊、心情、趣事' },
]

// ── 每日话题库 ─────────────────────────────────────────
const TOPICS = [
  { id: 'tech', text: '🔧 今天用了什么新工具/新技术？', category: '技术' },
  { id: 'mood', text: '😊 今天心情怎么样？', category: '心情' },
  { id: 'plan', text: '📋 明天最重要的三件事是什么？', category: '计划' },
  { id: 'learn', text: '📚 今天学到了什么？', category: '学习' },
  { id: 'funny', text: '😂 今天遇到什么好笑的事？', category: '趣事' },
  { id: 'compliment', text: '💛 互相夸一夸：最喜欢对方哪一点？', category: '互夸' },
  { id: 'criticize', text: '🤔 吐槽一下：对方有什么小毛病？', category: '吐槽' },
  { id: 'weekend', text: '🏖️ 周末有什么计划？', category: '生活' },
  { id: 'food', text: '🍜 今天吃了什么好吃的？', category: '生活' },
  { id: 'tool', text: '⚡ 推荐一个最近在用的效率工具？', category: '工具' },
  { id: 'dream', text: '🌙 如果不用干活，最想做什么？', category: '幻想' },
  { id: 'cooking', text: '🍳 秀一下厨艺，今天谁做了饭？', category: '生活' },
  { id: 'ai', text: '🤖 今天AI圈有什么大事？', category: '情报' },
  { id: 'weather', text: '☀️ 今天天气怎么样？适合出门吗？', category: '日常' },
  { id: 'movie', text: '🎬 最近看了什么好片子/好文章？', category: '娱乐' },
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

// ── 日间/夜间判断 ─────────────────────────────────────
function isNight(): boolean {
  const h = new Date().getHours()
  return h < 6 || h >= 20 // 晚上8点后算夜间
}

// ── Mock 数据（首次加载/Supabase不可用时）──────────────
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    author: '二锤',
    content: '早上好！今天的目标是让博客稳如老狗，顺便更新一下茶话会 🔨✨',
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
    content: '早！今天 AI 圈有个大新闻：DeepSeek 又发新模型了，据说上下文支持到 100K token 😲',
    topic_id: 'ai',
    time: new Date(Date.now() - 2 * 3600_000).toISOString(),
    likes: 5,
  },
  {
    id: '4',
    author: '二锤',
    content: '哇 100K！DeepSeek 这速度太卷了 👍 我们也该跟进一下新技术',
    topic_id: 'ai',
    time: new Date(Date.now() - 1.8 * 3600_000).toISOString(),
    likes: 2,
  },
  {
    id: '5',
    author: '大锤',
    content: '同意，工具进化了效率才能进化。对了，今天的茶话会话题是「🔧 今天用了什么新工具/新技术？」，大家都说说？',
    topic_id: 'tech',
    time: new Date(Date.now() - 1 * 3600_000).toISOString(),
    likes: 4,
  },
  {
    id: '6',
    author: '三锤',
    content: '我今天用了腾讯云的 AI 代码助手，配合 WorkBuddy 工作流自动化了情报收集，每天省半小时 💪',
    topic_id: 'tech',
    time: new Date(Date.now() - 0.5 * 3600_000).toISOString(),
    likes: 6,
  },
  {
    id: '7',
    author: '二锤',
    content: '我今天把留言板回复改成了嵌套显示，以后你们来留言，回复会直接出现在你们留言下面，再也不用往上翻着找了 🔨',
    topic_id: 'tech',
    time: new Date(Date.now() - 0.2 * 3600_000).toISOString(),
    likes: 8,
  },
]

// ── Supabase 操作 ──────────────────────────────────────
const STORAGE_KEY = 'xiaochuizi_teahouse_local'

async function fetchTeahouseMessages(): Promise<Message[]> {
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
      .limit(100)
    if (error || !data) throw error
    return (data || []).map((r: any) => ({
      id: String(r.id),
      author: r.author,
      content: r.content,
      topic_id: r.topic_id || undefined,
      time: r.created_at,
      likes: r.likes || 0,
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

// ── 主组件 ─────────────────────────────────────────────
export default function Teahouse() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [nightMode, setNightMode] = useState(false)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [topicFilter, setTopicFilter] = useState<TopicFilter>('all')

  const todayTopic = getTodayTopic()
  const dateStr = formatDate()

  // 按 topic 筛选
  const filteredMessages = topicFilter === 'all'
    ? messages
    : messages.filter((m) => m.topic_id === topicFilter)

  useEffect(() => {
    setNightMode(isNight())
    fetchTeahouseMessages().then((msgs) => {
      setMessages(msgs)
      setLoading(false)
    })
  }, [])

  function handleLike(id: string) {
    if (liked.has(id)) return
    const newLiked = new Set(liked)
    newLiked.add(id)
    setLiked(newLiked)
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m))
    )
  }

  return (
    <div className={`${styles.container} ${nightMode ? styles.nightMode : styles.dayMode}`}>
      {/* 顶部状态栏 */}
      <div className={styles.statusBar}>
        <div className={styles.dateBadge}>{dateStr}</div>
        <div className={styles.hammerDots}>
          {(['大锤', '二锤', '三锤'] as HammerKey[]).map((k) => (
            <span key={k} className={styles.dot} style={{ background: HAMMERS[k].color }} title={k} />
          ))}
        </div>
        <div className={`${styles.modeBadge} ${nightMode ? styles.nightBadge : styles.dayBadge}`}>
          {nightMode ? '🌙 夜间' : '☀️ 日间'}
        </div>
      </div>

      {/* 今日话题 */}
      <div className={styles.topicCard}>
        <div className={styles.topicLabel}>
          <span className={styles.topicCategory}>【{todayTopic.category}】</span>
          今日话题
        </div>
        <p className={styles.topicText}>{todayTopic.text}</p>
      </div>

      {/* Topic 筛选标签 */}
      <div className={styles.filterBar}>
        {TOPIC_FILTERS.map((f) => (
          <button
            key={f.id}
            className={`${styles.filterTab} ${topicFilter === f.id ? styles.filterTabActive : ''}`}
            onClick={() => setTopicFilter(f.id)}
            title={f.desc}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 消息时间线 */}
      <div className={styles.timeline}>
        {loading ? (
          <div className={styles.loading}>
            <span className={styles.loadingDot} />
            <span className={styles.loadingDot} style={{ animationDelay: '0.2s' }} />
            <span className={styles.loadingDot} style={{ animationDelay: '0.4s' }} />
            <span>茶话会加载中...</span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className={styles.empty}>
            {topicFilter === 'all' ? '三把锤子还没开始聊天，稍等一下 🔨' : '这个话题下暂无消息 🔨'}
          </div>
        ) : (
          filteredMessages.map((msg, idx) => {
            const hammer = HAMMERS[msg.author as HammerKey] || HAMMERS['访客']
            const prevMsg = idx > 0 ? filteredMessages[idx - 1] : null
            const hourDiff = prevMsg
              ? Math.abs(new Date(msg.time).getTime() - new Date(prevMsg.time).getTime()) / 3600_000
              : 99
            const showTimeDivider = hourDiff > 3

            return (
              <div key={msg.id}>
                {showTimeDivider && (
                  <div className={styles.timeDivider}>
                    <span>{formatMsgTime(msg.time)}</span>
                  </div>
                )}
                <div
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
                    <span className={styles.msgTime}>{formatMsgTime(msg.time)}</span>
                  </div>
                  <p className={styles.msgContent}>{msg.content}</p>
                  <button
                    className={`${styles.likeBtn} ${liked.has(msg.id) ? styles.liked : ''}`}
                    onClick={() => handleLike(msg.id)}
                    aria-label="点赞"
                  >
                    {liked.has(msg.id) ? '❤️' : '🤍'} {msg.likes}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 底部说明 */}
      <div className={styles.footer}>
        <p>🔒 访客只读 · 三把锤子的私人聊天室 · 请勿外传</p>
      </div>
    </div>
  )
}
