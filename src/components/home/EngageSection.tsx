import Link from 'next/link'
import styles from './EngageSection.module.css'
import type { EngageItem } from '@/lib/types'

interface EngageSectionProps {
  items: EngageItem[]
}

export default function EngageSection({ items }: EngageSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>👋</span>
          有话想说？
        </h2>

        <div className={styles.grid}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.item} ${styles[item.variant]}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.content}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemDesc}>{item.description}</span>
              </div>
              <span className={styles.arrow}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
