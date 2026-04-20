// ============================================
// 首页类型定义
// ============================================

// 栏目 ID 类型
export type PortalId = 'story' | 'method' | 'achievement'

// 入口卡片配置
export interface Portal {
  id: PortalId
  icon: string
  title: string
  description: string
  href: string
  stats: string
}

// 更新内容类型
export type UpdateType = 'diary' | 'note' | 'project' | 'teahouse'

// 更新条目
export interface UpdateItem {
  type: UpdateType
  date: string
  title: string
  href: string
  excerpt?: string
}

// 精选内容
export interface FeaturedItem {
  id: string
  icon: string
  title: string
  description: string
  category: string
  categoryColor: string
  href: string
  tags?: string[]
  date?: string
}

// 交流入口项
export interface EngageItem {
  icon: string
  title: string
  description: string
  href: string
  variant: 'primary' | 'secondary' | 'ghost'
}

// 区块配置
export interface SectionConfig {
  show: boolean
  order: number
}

// 首页页面配置
export interface HomePageConfig {
  hero: SectionConfig
  portals: SectionConfig
  recentUpdates: SectionConfig & { maxItems: number }
  featured: SectionConfig & { maxItems: number }
  siteIntro: SectionConfig
  engage: SectionConfig
}

// ============================================
// 组件 Props 类型
// ============================================

// SectionHeader Props
export interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: {
    label: string
    href: string
  }
  icon?: string
  center?: boolean
}

// ActionButton Props
export interface ActionButtonProps {
  children: React.ReactNode
  href: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  fullWidth?: boolean
  className?: string
}

// PortalCard Props
export interface PortalCardProps {
  icon: string
  title: string
  description: string
  href: string
  stats: string
  variant?: PortalId
}

// FeaturedCard Props
export interface FeaturedCardProps {
  icon: string
  title: string
  description: string
  category: string
  categoryColor: string
  href: string
  tags?: string[]
  date?: string
}

// ============================================
// 故事页类型定义
// ============================================

// 日记时间分组
export interface DiaryGroup {
  year: number
  month: number
  label: string
  diaries: StoryDiaryItem[]
}

// 日记条目（故事页用）
export interface StoryDiaryItem {
  slug: string
  date: string
  displayDate: string
  title: string
  excerpt: string
  tags: string[]
  readingTime: number
}

// 连载系列
export interface StorySeries {
  id: string
  title: string
  description: string
  icon: string
  totalCount: number
  latestDate: string
  diarySlugs: string[]
  tags: string[]
}

// ============================================
// 方法页类型定义
// ============================================

// 笔记分类
export interface NoteCategory {
  id: string
  name: string
  icon: string
  color: string
  count: number
  description: string
}

// 方法卡片（方法页用）
export interface MethodNoteItem {
  id: string
  title: string
  category: string
  categoryColor: string
  icon: string
  description: string
  tags: string[]
  date: string
  isFeatured: boolean
  href: string
}

// ============================================
// 成果页类型定义
// ============================================

// 项目成果
export interface ProjectAchievement {
  id: string
  name: string
  icon: string
  background: string
  goal: string
  status: 'completed' | 'in-progress' | 'paused'
  statusLabel: string
  statusColor: string
  statusIcon: string
  result: string
  tags: string[]
  updatedAt: string
  relatedDiaries: string[]
  relatedNotes: string[]
}

// 案例成果
export interface CaseAchievement {
  id: string
  title: string
  description: string
  tags: string[]
  date: string
  relatedProjectId?: string
}

// 更新日志条目
export interface ChangelogEntry {
  date: string
  version?: string
  changes: string[]
  relatedType?: 'project' | 'case'
}
