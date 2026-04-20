import Link from 'next/link'
import styles from './PortalCard.module.css'
import type { PortalCardProps } from '@/lib/types'

export default function PortalCard({
  icon,
  title,
  description,
  href,
  stats,
  variant = 'story'
}: PortalCardProps) {
  return (
    <Link href={href} className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.footer}>
        <span className={styles.stats}>{stats}</span>
        <span className={styles.arrow}>进入 →</span>
      </div>
    </Link>
  )
}
