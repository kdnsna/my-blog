import SectionHeader from '@/components/shared/SectionHeader'
import PortalCard from './PortalCard'
import styles from './PortalSection.module.css'
import type { Portal } from '@/lib/types'

interface PortalSectionProps {
  portals: Portal[]
}

export default function PortalSection({ portals }: PortalSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          icon="🚀"
          title="从这里开始"
          subtitle="选择你感兴趣的方向"
        />
        
        <div className={styles.grid}>
          {portals.map((portal) => (
            <PortalCard
              key={portal.id}
              icon={portal.icon}
              title={portal.title}
              description={portal.description}
              href={portal.href}
              stats={portal.stats}
              variant={portal.id}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
