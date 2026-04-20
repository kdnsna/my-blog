import {
  HomeHero,
  PortalSection,
  RecentUpdates,
  FeaturedSection,
  SiteIntro,
  EngageSection
} from '@/components/home'
import {
  getPortalData,
  getRecentUpdates,
  getFeaturedItems,
  getEngageItems
} from '@/lib/home'
import styles from './page.module.css'

export default async function HomePage() {
  // 并行获取所有数据
  const [portals, recentUpdates, featuredItems, engageItems] = await Promise.all([
    Promise.resolve(getPortalData()),
    Promise.resolve(getRecentUpdates(5)),
    Promise.resolve(getFeaturedItems(2)),
    Promise.resolve(getEngageItems())
  ])

  return (
    <div className={styles.page}>
      {/* 模块 1：首屏 Hero */}
      <HomeHero />

      {/* 模块 2：三个主入口 */}
      <PortalSection portals={portals} />

      {/* 模块 3：最近更新 */}
      <RecentUpdates items={recentUpdates} />

      {/* 模块 4：专题精选 */}
      {featuredItems.length > 0 && (
        <FeaturedSection items={featuredItems} />
      )}

      {/* 模块 5：站点说明 */}
      <SiteIntro />

      {/* 模块 6：回访入口 */}
      <EngageSection items={engageItems} />
    </div>
  )
}
