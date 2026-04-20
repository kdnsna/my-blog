import SectionHeader from '@/components/shared/SectionHeader'
import UpdateItem from './UpdateItem'
import styles from './RecentUpdates.module.css'
import type { UpdateItem as UpdateItemType } from '@/lib/types'

interface RecentUpdatesProps {
  items: UpdateItemType[]
}

export default function RecentUpdates({ items }: RecentUpdatesProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          icon="📨"
          title="最近更新"
          subtitle="追踪大爷和小锤子的最新动态"
        />

        <div className={styles.list}>
          {items.map((item, index) => (
            <UpdateItem key={`${item.type}-${item.date}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
