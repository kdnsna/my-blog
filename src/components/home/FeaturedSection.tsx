import SectionHeader from '@/components/shared/SectionHeader'
import FeaturedCard from './FeaturedCard'
import styles from './FeaturedSection.module.css'
import type { FeaturedItem } from '@/lib/types'

interface FeaturedSectionProps {
  items: FeaturedItem[]
}

export default function FeaturedSection({ items }: FeaturedSectionProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          icon="✨"
          title="编辑精选"
          subtitle="值得花时间阅读的内容"
        />

        <div className={styles.grid}>
          {items.map((item) => (
            <FeaturedCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              description={item.description}
              category={item.category}
              categoryColor={item.categoryColor}
              href={item.href}
              tags={item.tags}
              date={item.date}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
