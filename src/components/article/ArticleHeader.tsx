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
  diary: { icon: '📔', label: '日记', color: 'var(--amber)' },
  method: { icon: '🧭', label: '方法', color: 'var(--blue)' },
  project: { icon: '🏆', label: '项目', color: 'var(--purple)' }
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
  excerpt,
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
  status,
  startDate,
  endDate
}: ArticleHeaderProps) {
  const config = TYPE_CONFIG[type]
  const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className={styles.header}>
      {/* 类型标签 */}
      <div className={styles.typeTag} style={{ color: config.color }}>
        <span className={styles.typeIcon}>{config.icon}</span>
        <span className={styles.typeLabel}>{config.label}</span>
      </div>

      {/* 标题 */}
      <h1 className={styles.title}>{title}</h1>

      {/* 日记摘要 */}
      {summary && (
        <blockquote className={styles.summary}>
          {summary}
        </blockquote>
      )}

      {/* 方法分类 */}
      {type === 'method' && category && (
        <div className={styles.metaTags}>
          <span 
            className={styles.categoryTag}
            style={{ background: `${categoryColor}20`, color: categoryColor }}
          >
            {category}
          </span>
          {difficulty && (
            <span className={styles.difficultyTag}>{difficulty}</span>
          )}
        </div>
      )}

      {/* 项目状态 */}
      {type === 'project' && status && (
        <div className={styles.projectMeta}>
          <span 
            className={styles.statusTag}
            style={{ borderColor: STATUS_CONFIG[status].color, color: STATUS_CONFIG[status].color }}
          >
            {STATUS_CONFIG[status].label}
          </span>
          {startDate && (
            <span className={styles.dateRange}>
              {new Date(startDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              {endDate && ` ~ ${new Date(endDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}`}
            </span>
          )}
        </div>
      )}

      {/* 日记元信息 */}
      {type === 'diary' && (weather || mood) && (
        <div className={styles.diaryMeta}>
          {weather && <span>{weather}</span>}
          {mood && <span>{mood}</span>}
        </div>
      )}

      {/* 通用元信息 */}
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}>📅</span>
          <span>{formattedDate}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}>⏱️</span>
          <span>{readingTime} 分钟</span>
        </div>
        {author && (
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>👤</span>
            <span>{author.name}</span>
          </div>
        )}
      </div>

      {/* 标签 */}
      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map(tag => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 连载信息 */}
      {series && (
        <div className={styles.series}>
          <span className={styles.seriesLabel}>📚 {series.name}</span>
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
