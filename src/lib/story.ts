/**
 * 故事页数据层
 * 从日记数据中提取故事页需要的内容
 */

import { getAllDiaries, getAllTags } from './diary'
import type { DiaryGroup, StoryDiaryItem, StorySeries } from './types'

/**
 * 估算阅读时长（基于内容长度）
 */
function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.length / 2 // 粗略估算中文字符数
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

/**
 * 格式化日期显示
 */
function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}-${date.getDate().toString().padStart(2, '0')}`
}

/**
 * 获取按年月分组的日记列表
 */
export function getDiaryGroups(): DiaryGroup[] {
  const diaries = getAllDiaries()
  
  const groupMap = new Map<string, DiaryGroup>()
  
  diaries.forEach(diary => {
    const date = new Date(diary.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const key = `${year}-${month}`
    
    const item: StoryDiaryItem = {
      slug: diary.slug,
      date: diary.date,
      displayDate: formatDisplayDate(diary.date),
      title: diary.title,
      excerpt: diary.excerpt,
      tags: diary.tags,
      readingTime: estimateReadingTime(diary.content)
    }
    
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        year,
        month,
        label: `${year} 年 ${month} 月`,
        diaries: []
      })
    }
    
    groupMap.get(key)!.diaries.push(item)
  })
  
  // 按时间倒序排列
  return Array.from(groupMap.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.month - a.month
  })
}

/**
 * 获取连载系列
 * 目前基于标签识别，后续可以手动配置
 */
export function getStorySeries(): StorySeries[] {
  const diaries = getAllDiaries()
  const series: StorySeries[] = []
  
  // 博客重构系列
  const blogSeries = diaries.filter(d => 
    d.title.includes('Blog') || d.title.includes('博客') || d.title.includes('重构')
  )
  if (blogSeries.length > 1) {
    series.push({
      id: 'blog-refactor',
      title: '博客重构之路',
      description: '从 Pages Router 迁移到 App Router，完整记录博客系统升级的全过程',
      icon: '🏗️',
      totalCount: blogSeries.length,
      latestDate: blogSeries[0].date,
      diarySlugs: blogSeries.map(d => d.slug),
      tags: ['建站', 'Next.js', 'UI']
    })
  }
  
  // 记忆系统系列
  const memorySeries = diaries.filter(d =>
    d.title.includes('记忆') || d.title.includes('Memory') || d.title.includes('三锤')
  )
  if (memorySeries.length > 1) {
    series.push({
      id: 'memory-system',
      title: '记忆系统搭建',
      description: '云端 AI 助手长期记忆方案的设计与实现过程',
      icon: '🧠',
      totalCount: memorySeries.length,
      latestDate: memorySeries[0].date,
      diarySlugs: memorySeries.map(d => d.slug),
      tags: ['记忆系统', 'AI', '架构']
    })
  }
  
  return series
}

/**
 * 获取精选日记（最近的3篇）
 */
export function getFeaturedDiaries(): StoryDiaryItem[] {
  const diaries = getAllDiaries()
  return diaries.slice(0, 3).map(diary => ({
    slug: diary.slug,
    date: diary.date,
    displayDate: formatDisplayDate(diary.date),
    title: diary.title,
    excerpt: diary.excerpt,
    tags: diary.tags,
    readingTime: estimateReadingTime(diary.content)
  }))
}

/**
 * 获取所有可用标签
 */
export function getStoryTags(): string[] {
  return getAllTags()
}

/**
 * 获取日记统计数据
 */
export function getStoryStats(): { total: number; latestDate: string } {
  const diaries = getAllDiaries()
  return {
    total: diaries.length,
    latestDate: diaries[0]?.date || ''
  }
}
