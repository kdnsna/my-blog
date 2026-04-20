/**
 * 方法页数据层
 * 从笔记数据中提取方法页需要的内容
 */

import { allNotes } from './notes'
import type { NoteCategory, MethodNoteItem } from './types'

/**
 * 获取笔记分类统计
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
        description: note.description.slice(0, 50) + '...'
      })
    }
  })
  
  // 分类配置
  const categoryConfig: Record<string, { icon: string; color: string; description: string }> = {
    '记忆系统': {
      icon: '🔨',
      color: '#4A90D9',
      description: 'AI 记忆方案、MemCell、Foresight 预测等'
    },
    '自动化': {
      icon: '⚡',
      color: '#4CAF50',
      description: '工作流与调度、晨晚间任务'
    },
    '苹果生态': {
      icon: '🍎',
      color: '#E85C5C',
      description: '本地能力集成、快捷指令'
    },
    '学习': {
      icon: '📚',
      color: '#E8B96A',
      description: '知识积累方法、晨报追踪'
    },
    '安全': {
      icon: '🔒',
      color: '#9C27B0',
      description: '系统安全巡检、审计机制'
    },
    '日记': {
      icon: '📔',
      color: '#795548',
      description: '记录方法论、复盘机制'
    },
    '项目': {
      icon: '📋',
      color: '#607D8B',
      description: '项目管理系统、任务追踪'
    }
  }
  
  return Array.from(categoryMap.entries()).map(([name, data]) => {
    const config = categoryConfig[name] || { icon: '📁', color: '#9E9E9E', description: data.description }
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon: config.icon,
      color: config.color,
      count: data.count,
      description: config.description
    }
  }).sort((a, b) => b.count - a.count)
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
export function getMethodStats(): { totalNotes: number; totalCategories: number; latestDate: string } {
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
