import Tag from '@/components/ui/Tag'
import styles from './ArticleHeader.module.css'

interface ArticleHeaderProps {
  type: 'diary' | 'method' | 'project'
  title: string
  excerpt?: string
  date: string
  readingTime: number
  tags: string[]
  author?: {
    name: string
    avatar?: string
  }
  series?: {
    id: string
    name: string
    index: number
    total: number
  }
  // 日记型特有
  summary?: string
  weather?: string
  mood?: string
  // 方法型特有
  category?: string
  categoryColor?: string
  difficulty?: string
  // 项目型特有
  status?: 'planning' | 'in-progress' | 'completed' | 'paused'
  startDate?: string
  endDate?: string
}

const TYPE_CONFIG = {
  diary: { icon: '📔', label: '日记', color: '#E8B96A' },
  method: { icon: '🧭', label: '方法', color: '#4A90D9' },
  project: { icon: '🏆', label: '项目', color: '#9B59B6' }
}

const STATUS_CONFIG = {
  'planning': { label: '规划中', color: '#9E9E9E' },
  'in-progress': { label: '进行中', color: '#2196F3' },
  'completed': { label: '已完成', color: '#4CAF50' },
  'paused': { label: '已暂停', color: '#FF9800' }
}

export default function ArticleHeader({
  type,
  title,
  date,
  readingTime,
  tags,
  author,
  series,
  summary,
  weather,
  mood,
  category,
  categoryColor,
  difficulty,
  status
}: ArticleHeaderProps) {
  const config = TYPE_CONFIG[type]
  const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <header className={styles.header}>
      {/* 类型标识 + 标题 */}
      <div className={styles.titleSection}>
        <div className={styles.typeBadge} style={{ color: config.color }}>
          <span className={styles.typeIcon}>{config.icon}</span>
          <span className={styles.typeLabel}>{config.label}</span>
        </div>
        <h1 className={styles.title}>{title}</h1>
      </div>

      {/* 日记摘要（特有） */}
      {summary && (
        <blockquote className={styles.summary}>
          {summary}
        </blockquote>
      )}

      {/* 元信息行 */}
      <div className={styles.metaRow}>
        <div className={styles.metaItems}>
          {/* 日期 */}
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>📅</span>
            <span>{formattedDate}</span>
          </span>
          
          {/* 阅读时长 */}
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>⏱️</span>
            <span>{readingTime} 分钟</span>
          </span>
          
          {/* 作者 */}
          {author && (
            <span className={styles.metaItem}>
              <span className={styles.metaIcon}>👤</span>
              <span>{author.name}</span>
            </span>
          )}

          {/* 方法分类 */}
          {type === 'method' && category && (
            <Tag color={categoryColor}>{category}</Tag>
          )}

          {/* 难度 */}
          {type === 'method' && difficulty && (
            <Tag>{difficulty}</Tag>
          )}

          {/* 项目状态 */}
          {type === 'project' && status && (
            <Tag color={STATUS_CONFIG[status].color}>
              {STATUS_CONFIG[status].label}
            </Tag>
          )}

          {/* 日记天气/心情 */}
          {type === 'diary' && (weather || mood) && (
            <>
              {weather && <span className={styles.metaItem}>{weather}</span>}
              {mood && <span className={styles.metaItem}>{mood}</span>}
            </>
          )}
        </div>
      </div>

      {/* 标签行 */}
      {tags.length > 0 && (
        <div className={styles.tagRow}>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}

      {/* 连载信息（可选） */}
      {series && (
        <div className={styles.seriesBar}>
          <span className={styles.seriesIcon}>📚</span>
          <span className={styles.seriesName}>{series.name}</span>
          <span className={styles.seriesDivider}>·</span>
          <span className={styles.seriesIndex}>
            第 {series.index} 篇 / 共 {series.total} 篇
          </span>
        </div>
      )}

      {/* 分隔线 */}
      <div className={styles.divider}></div>
    </header>
  )
}
