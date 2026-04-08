/**
 * MDX 日记读取工具
 * 动态读取 src/content/diary/ 目录下的 MDX 文件
 */

import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'

const DIARY_DIR = path.join(process.cwd(), 'src/content/diary')

export interface DiaryEntry {
  slug: string
  date: string
  title: string
  excerpt: string
  tags: string[]
  content: string
}

export interface SyncMeta {
  lastSync: string
  totalFiles: number
}

/**
 * 读取日记目录，返回所有日记条目
 */
export function getAllDiaries(): DiaryEntry[] {
  try {
    const files = fs.readdirSync(DIARY_DIR)
      .filter(f => f.endsWith('.mdx'))
      .sort()
      .reverse()

    return files.map(filename => {
      const slug = filename.replace('.mdx', '')
      const filePath = path.join(DIARY_DIR, filename)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)

      return {
        slug,
        date: data.date || slug,
        title: data.title || `日记 ${slug}`,
        excerpt: data.excerpt || '',
        tags: data.tags || ['日常'],
        content
      }
    })
  } catch (error) {
    console.error('读取日记失败:', error)
    return []
  }
}

/**
 * 读取单个日记详情
 */
export function getDiaryBySlug(slug: string): DiaryEntry | null {
  try {
    const filePath = path.join(DIARY_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    return {
      slug,
      date: data.date || slug,
      title: data.title || `日记 ${slug}`,
      excerpt: data.excerpt || '',
      tags: data.tags || ['日常'],
      content
    }
  } catch (error) {
    console.error(`读取日记 ${slug} 失败:`, error)
    return null
  }
}

/**
 * 获取所有标签
 */
export function getAllTags(): string[] {
  const diaries = getAllDiaries()
  const tagSet = new Set<string>()
  diaries.forEach(diary => {
    diary.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}

/**
 * 获取同步元信息
 */
export function getSyncMeta(): SyncMeta | null {
  try {
    const metaPath = path.join(DIARY_DIR, '.sync-meta.json')
    if (fs.existsSync(metaPath)) {
      return JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    }
    return null
  } catch {
    return null
  }
}
