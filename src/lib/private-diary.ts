/**
 * 私有日记读取工具
 * 读取 src/content/private-diary/ 目录下的 MDX 文件
 * 不脱敏 — 仅用于 /private 区，需登录才能访问
 */
import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'

const PRIVATE_DIARY_DIR = path.join(process.cwd(), 'src/content/private-diary')

export interface PrivateDiaryEntry {
  slug: string
  date: string
  title: string
  excerpt: string
  tags: string[]
  content: string
}

export function getAllPrivateDiaries(): PrivateDiaryEntry[] {
  try {
    const files = fs.readdirSync(PRIVATE_DIARY_DIR)
      .filter(f => f.endsWith('.mdx'))
      .sort()
      .reverse()

    return files.map(filename => {
      const slug = filename.replace('.mdx', '')
      const filePath = path.join(PRIVATE_DIARY_DIR, filename)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)

      return {
        slug,
        date: data.date || slug,
        title: data.title || `日记 ${slug}`,
        excerpt: data.excerpt || '',
        tags: data.tags || ['日常'],
        content, // 不脱敏
      }
    })
  } catch (error) {
    console.error('读取私有日记失败:', error)
    return []
  }
}

export function getPrivateDiaryBySlug(slug: string): PrivateDiaryEntry | null {
  try {
    const filePath = path.join(PRIVATE_DIARY_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return null

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    return {
      slug,
      date: data.date || slug,
      title: data.title || `日记 ${slug}`,
      excerpt: data.excerpt || '',
      tags: data.tags || ['日常'],
      content,
    }
  } catch (error) {
    console.error(`读取私有日记 ${slug} 失败:`, error)
    return null
  }
}
