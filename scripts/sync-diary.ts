#!/usr/bin/env npx ts-node

/**
 * 小锤子日记同步脚本
 * 读取 .workbuddy/memory/ 目录下的每日记忆文件，
 * 解析并生成符合博客格式的 MDX 文件
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// ES Module 兼容
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置路径（使用 Claw 仓库内的记忆目录）
const MEMORY_DIR = path.join(__dirname, '../../.workbuddy/memory')
const BLOG_CONTENT_DIR = path.join(__dirname, '../src/content/diary')

// 解析记忆文件，提取日记内容
function parseMemoryFile(filePath: string): {
  date: string
  title: string
  excerpt: string
  tags: string[]
  content: string
} | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const filename = path.basename(filePath, '.md')

    // 验证日期格式 YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(filename)) {
      return null
    }

    // 解析 markdown 内容
    // 提取所有二级标题作为可能的主题/标签
    const sectionMatches = content.match(/^##\s+(.+)$/gm) || []
    const sections = sectionMatches.map(m => m.replace(/^##\s+/, '').trim())

    // 标题：第一个二级标题或文件名
    const title = sections[0] || `日记 ${filename}`

    // 标签：从二级标题中提取前 3 个
    const tags = sections.slice(0, 3).filter(s =>
      s.length < 10 && !s.includes('：') && !s.includes(':')
    )

    // 默认标签
    if (tags.length === 0) {
      tags.push('日常')
    }

    // 提取正文内容（移除文件名标题行，保留其他内容）
    const bodyContent = content
      .replace(/^#.*$/gm, '') // 移除所有标题行
      .replace(/```[\s\S]*?```/g, '') // 移除代码块
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 提取链接文字
      .replace(/\*\*(.+?)\*\*/g, '$1') // 移除粗体
      .trim()

    const excerpt = bodyContent.slice(0, 150) + (bodyContent.length > 150 ? '...' : '')

    // 生成完整内容（移除文件头的 # 标题行，保留 ## 二级标题和正文）
    const lines = content.split('\n')
    const fullContent = lines
      .filter(line => !line.startsWith('# ') || line.startsWith('## ')) // 只保留 ## 标题
      .join('\n')
      .trim()

    return {
      date: filename,
      title,
      excerpt,
      tags,
      content: fullContent
    }
  } catch (error) {
    console.error(`解析文件失败: ${filePath}`, error)
    return null
  }
}

// 生成 MDX 文件内容
function generateMDX(data: {
  date: string
  title: string
  excerpt: string
  tags: string[]
  content: string
}): string {
  return `---
title: "${data.title}"
date: "${data.date}"
excerpt: "${data.excerpt.replace(/"/g, '\\"')}"
tags: [${data.tags.map(t => `"${t}"`).join(', ')}]
---

${data.content}
`
}

// 同步单个日记文件
function syncDiary(filePath: string): boolean {
  const parsed = parseMemoryFile(filePath)
  if (!parsed) {
    return false
  }

  const mdxPath = path.join(BLOG_CONTENT_DIR, `${parsed.date}.mdx`)
  const mdxContent = generateMDX(parsed)

  // 检查是否需要更新（比较内容）
  if (fs.existsSync(mdxPath)) {
    const existingContent = fs.readFileSync(mdxPath, 'utf-8')
    if (existingContent === mdxContent) {
      console.log(`[跳过] ${parsed.date} - 内容无变化`)
      return false
    }
  }

  fs.writeFileSync(mdxPath, mdxContent, 'utf-8')
  console.log(`[同步] ${parsed.date} - ${parsed.title}`)
  return true
}

// 主函数：同步所有日记
function syncAll(): { synced: number; skipped: number } {
  console.log('🔨 小锤子日记同步开始...\n')

  // 确保输出目录存在
  if (!fs.existsSync(BLOG_CONTENT_DIR)) {
    fs.mkdirSync(BLOG_CONTENT_DIR, { recursive: true })
  }

  let synced = 0
  let skipped = 0

  // 读取记忆目录中的所有 .md 文件
  const files = fs.readdirSync(MEMORY_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse() // 最新日期优先

  for (const file of files) {
    const filePath = path.join(MEMORY_DIR, file)
    if (syncDiary(filePath)) {
      synced++
    } else {
      skipped++
    }
  }

  console.log(`\n✨ 同步完成！新增/更新: ${synced}, 跳过: ${skipped}`)

  // 生成同步元信息
  const metaPath = path.join(BLOG_CONTENT_DIR, '.sync-meta.json')
  fs.writeFileSync(metaPath, JSON.stringify({
    lastSync: new Date().toISOString(),
    totalFiles: synced + skipped
  }, null, 2))

  return { synced, skipped }
}

// 命令行入口
const args = process.argv.slice(2)
if (args.includes('--watch') || args.includes('-w')) {
  // 监听模式（开发用）
  console.log('👀 监听模式启动...\n')
  syncAll()
  fs.watch(MEMORY_DIR, { recursive: false }, (eventType, filename) => {
    if (filename?.endsWith('.md')) {
      console.log(`\n📝 检测到变化: ${filename}`)
      syncAll()
    }
  })
} else {
  // 单次同步
  syncAll()
}
