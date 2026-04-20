import Link from 'next/link'
import styles from './ArticleFooter.module.css'

interface RelatedArticle {
  id: string
  title: string
  excerpt: string
  date: string
  readingTime: number
  href: string
  type: 'diary' | 'method' | 'project'
  tags?: string[]
}

interface ArticleFooterProps {
  type: 'diary' | 'method' | 'project'
  relatedArticles?: RelatedArticle[]
  series?: {
    id: string
    name: string
    index: number
    total: number
    prev?: { title: string; href: string }
    next?: { title: string; href: string }
  }
  nextArticle?: {
    title: string
    href: string
    date: string
  }
}

const TYPE_CONFIG = {
  diary: { icon: '📔', label: '日记' },
  method: { icon: '🧭', label: '方法' },
  project: { icon: '🏆', label: '项目' }
}

export default function ArticleFooter({
  type,
  relatedArticles = [],
  series,
  nextArticle
}: ArticleFooterProps) {
  const config = TYPE_CONFIG[type]

  return (
    <footer className={styles.footer}>
      {/* 结束标记 */}
      <div className={styles.endMark}>
        <span>─</span>
        <span> END </span>
        <span>─</span>
      </div>

      {/* 继续阅读 */}
      {relatedArticles.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span>📖</span> 继续阅读
          </h3>
          <p className={styles.sectionSubtitle}>
            基于标签和分类的智能推荐
          </p>
          <div className={styles.relatedGrid}>
            {relatedArticles.slice(0, 3).map((article) => (
              <Link 
                key={article.id} 
                href={article.href}
                className={styles.relatedCard}
              >
                <div className={styles.relatedMeta}>
                  <span className={styles.relatedType}>
                    {TYPE_CONFIG[article.type].icon}
                  </span>
                  <span className={styles.relatedDate}>
                    {new Date(article.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h4 className={styles.relatedTitle}>{article.title}</h4>
                <p className={styles.relatedExcerpt}>{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 所属专题 */}
      {series && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span>📚</span> {series.name}
          </h3>
          <p className={styles.sectionSubtitle}>
            连载中 · 第 {series.index} 篇 / 共 {series.total} 篇
          </p>
          <div className={styles.seriesNav}>
            {series.prev ? (
              <Link href={series.prev.href} className={styles.seriesLink}>
                <span className={styles.seriesArrow}>←</span>
                <span className={styles.seriesLinkTitle}>{series.prev.title}</span>
              </Link>
            ) : (
              <span className={styles.seriesPlaceholder}>第一篇</span>
            )}
            {series.next && (
              <Link href={series.next.href} className={styles.seriesLink}>
                <span className={styles.seriesLinkTitle}>{series.next.title}</span>
                <span className={styles.seriesArrow}>→</span>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* 下一步阅读 */}
      {nextArticle && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span>🔗</span> 下一步阅读
          </h3>
          <Link href={nextArticle.href} className={styles.nextArticle}>
            <span className={styles.nextDate}>
              {new Date(nextArticle.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
            </span>
            <span className={styles.nextTitle}>{nextArticle.title}</span>
            <span className={styles.nextArrow}>→</span>
          </Link>
        </section>
      )}

      {/* 返回链接 */}
      <div className={styles.backLink}>
        <Link href={`/${type === 'diary' ? 'story' : type === 'method' ? 'method' : 'achievement'}`}>
          ← 返回{type === 'diary' ? '故事' : type === 'method' ? '方法' : '成果'}
        </Link>
      </div>
    </footer>
  )
}
