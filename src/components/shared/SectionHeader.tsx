import Link from 'next/link'
import styles from './SectionHeader.module.css'
import type { SectionHeaderProps } from '@/lib/types'

export default function SectionHeader({
  title,
  subtitle,
  action,
  icon,
  center = false
}: SectionHeaderProps) {
  return (
    <div className={`${styles.header} ${center ? styles.center : ''}`}>
      <div className={styles.titleWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <div className={styles.textWrapper}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {action && (
        <Link href={action.href} className={styles.action}>
          {action.label}
          <span className={styles.arrow}>→</span>
        </Link>
      )}
    </div>
  )
}
