import Link from 'next/link'
import styles from './FeaturedCard.module.css'
import type { FeaturedCardProps } from '@/lib/types'

export default function FeaturedCard({
  icon,
  title,
  description,
  category,
  categoryColor,
  href,
  tags,
  date
}: FeaturedCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span
          className={styles.category}
          style={{ backgroundColor: `${categoryColor}1a`, color: categoryColor }}
        >
          {category}
        </span>
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      <div className={styles.footer}>
        {tags && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
        {date && <span className={styles.date}>{date}</span>}
      </div>
    </Link>
  )
}
