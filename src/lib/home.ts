// ============================================
// 首页数据获取层
// 集中管理首页所需的所有数据
// ============================================

import { getAllDiaries } from './diary'
import { allNotes } from './notes'
import type { Portal, UpdateItem, FeaturedItem, EngageItem } from './types'

// ============================================
// 入口数据
// ============================================

export function getPortalData(): Portal[] {
  const diaries = getAllDiaries()
  const notes = allNotes
  
  return [
    {
      id: 'story',
      icon: '📖',
      title: '故事',
      description: '过程与思考的记录',
      href: '/story',
      stats: `最新 ${Math.min(diaries.length, 3)} 篇日记`
    },
    {
      id: 'method',
      icon: '🧭',
      title: '方法',
      description: '经验与知识的沉淀',
      href: '/method',
      stats: `共 ${notes.length} 篇笔记`
    },
    {
      id: 'achievement',
      icon: '🏆',
      title: '成果',
      description: '做出来的东西',
      href: '/achievement',
      stats: '已完成项目'
    }
  ]
}

// ============================================
// 最近更新数据
// ============================================

export function getRecentUpdates(maxItems = 5): UpdateItem[] {
  const diaries = getAllDiaries()
  const notes = allNotes

  const updates: UpdateItem[] = [
    ...diaries.slice(0, 3).map(d => ({
      type: 'diary' as const,
      date: d.date,
      title: d.title,
      href: `/diary/${d.slug}`,
      excerpt: d.excerpt
    })),
    ...notes.slice(0, 3).map(n => ({
      type: 'note' as const,
      date: n.date,
      title: n.title,
      href: `/notes/${n.id}`,
      excerpt: n.description
    }))
  ]

  // 按日期倒序
  return updates
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, maxItems)
}

// ============================================
// 精选数据
// ============================================

export function getFeaturedItems(maxItems = 2): FeaturedItem[] {
  return allNotes
    .filter(n => n.featured)
    .slice(0, maxItems)
    .map(n => ({
      id: n.id,
      icon: n.icon,
      title: n.title,
      description: n.description,
      category: n.category,
      categoryColor: n.categoryColor,
      href: `/notes/${n.id}`,
      tags: n.tags,
      date: n.date
    }))
}

// ============================================
// 交流入口数据
// ============================================

export function getEngageItems(): EngageItem[] {
  return [
    {
      icon: '💬',
      title: '留言板',
      description: '有话想说？来这里',
      href: '/guestbook',
      variant: 'secondary'
    },
    {
      icon: '🍵',
      title: '茶话会',
      description: '围观三锤子协作',
      href: '/teahouse',
      variant: 'secondary'
    },
    {
      icon: '📧',
      title: 'RSS 订阅',
      description: '不想错过更新',
      href: '/feed.xml',
      variant: 'ghost'
    }
  ]
}

// ============================================
// 类型标签映射
// ============================================

export function getUpdateTypeLabel(type: UpdateItem['type']): string {
  const labels: Record<UpdateItem['type'], string> = {
    diary: '日记',
    note: '知识',
    project: '项目',
    teahouse: '茶话'
  }
  return labels[type] || type
}

export function getUpdateTypeIcon(type: UpdateItem['type']): string {
  const icons: Record<UpdateItem['type'], string> = {
    diary: '📔',
    note: '📚',
    project: '🏆',
    teahouse: '🍵'
  }
  return icons[type] || '📄'
}
