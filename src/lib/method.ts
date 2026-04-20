/**
 * 方法页数据层
 * 从笔记数据中提取方法页需要的内容
 * 
 * 分类体系（收束后5个主类）：
 * - 记忆系统：AI 的核心资产
 * - 自动化：让系统自动运转的机制
 * - 工作台：本地能力与项目管理
 * - 成长：学习追踪与自我复盘
 * - 安全：系统健康与规范守护
 */

import { allNotes } from './notes'
import type { NoteCategory, MethodNoteItem } from './types'

/**
 * 主类配置（5个分类）
 */
const CATEGORY_CONFIG: Record<string, { 
  icon: string
  color: string
  description: string
  subtitle: string
}> = {
  '记忆系统': {
    icon: '🧠',
    color: '#4A90D9',
    subtitle: 'AI 的核心资产',
    description: 'MemCell 结构化存储、Foresight 预测、GitHub 记忆库'
  },
  '自动化': {
    icon: '⚡',
    color: '#4CAF50',
    subtitle: '让系统自动运转',
    description: 'AI 情报晨报、备份链路、定时任务'
  },
  '工作台': {
    icon: '🍎',
    color: '#E85C5C',
    subtitle: '本地能力集成',
    description: '苹果生态、监控面板、项目管理'
  },
  '成长': {
    icon: '📈',
    color: '#E8B96A',
    subtitle: '学习与自我复盘',
    description: '晨报追踪器、日记升级、实验卡片'
  },
  '安全': {
    icon: '🔒',
    color: '#9C27B0',
    subtitle: '系统健康守护',
    description: '夜间安全巡检、插件基线、权限审计'
  }
}

/**
 * 获取笔记分类统计（按新的5个主类）
 */
export function getNoteCategories(): NoteCategory[] {
  const categoryMap = new Map<string, { count: number; description: string }>()
  
  allNotes.forEach(note => {
    const existing = categoryMap.get(note.category)
    if (existing) {
      existing.count++
    } else {
      categoryMap.set(note.category, {
        count: 1,
        description: note.description.slice(0, 60) + '...'
      })
    }
  })
  
  return Array.from(categoryMap.entries())
    .map(([name, data]) => {
      const config = CATEGORY_CONFIG[name] || { 
        icon: '📁', 
        color: '#9E9E9E', 
        description: data.description,
        subtitle: ''
      }
      return {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        icon: config.icon,
        color: config.color,
        count: data.count,
        description: config.description,
        subtitle: config.subtitle
      }
    })
    .sort((a, b) => {
      // 按内容量排序，多的在前
      return b.count - a.count
    })
}

/**
 * 获取方法页笔记列表
 */
export function getMethodNotes(): MethodNoteItem[] {
  return allNotes.map(note => ({
    id: note.id,
    title: note.title,
    category: note.category,
    categoryColor: note.categoryColor,
    icon: note.icon,
    description: note.description,
    tags: note.tags,
    date: note.date,
    isFeatured: note.featured || false,
    href: `/notes/${note.id}`
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * 获取精选方法（featured = true）
 */
export function getFeaturedMethods(): MethodNoteItem[] {
  return getMethodNotes().filter(note => note.isFeatured)
}

/**
 * 获取方法页统计数据
 */
export function getMethodStats(): { 
  totalNotes: number
  totalCategories: number
  latestDate: string
} {
  return {
    totalNotes: allNotes.length,
    totalCategories: getNoteCategories().length,
    latestDate: allNotes[0]?.date || ''
  }
}

/**
 * 按分类获取笔记
 */
export function getNotesByCategory(category: string): MethodNoteItem[] {
  return getMethodNotes().filter(note => note.category === category)
}
