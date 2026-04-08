/**
 * 敏感信息脱敏工具
 * 将敏感模式替换为遮蔽占位符，hover 显示原文
 */

import { marked } from 'marked'

export interface MaskConfig {
  pattern: RegExp
  label: string   // hover 时显示的标签
  placeholder: (match: string) => string
}

const MASK_CONFIGS: MaskConfig[] = [
  // macOS 用户目录路径
  {
    pattern: /(\/Users\/[^\s,，;；'"}\]]{2,})/g,
    label: '本地路径',
    placeholder: (m) => m.replace('/Users/kdnsna', '~').replace('/Users', 'USER'),
  },
  // GitHub SSH 地址
  {
    pattern: /(git@github\.com:[^\s，,;；'"}$)]+)/g,
    label: 'Git 地址',
    placeholder: (m) => {
      const parts = m.split('/')
      return parts.slice(0, 3).join('/') + '/...'
    },
  },
  // GitHub HTTPS 地址
  {
    pattern: /(https:\/\/github\.com\/[^\s，,;；'"}$)]+)/g,
    label: 'GitHub URL',
    placeholder: (m) => m.replace(/\/kdnsna\/[^/]+/, '/kdnsna/REPO'),
  },
  // IP 地址（内网/外网）
  {
    pattern: /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g,
    label: 'IP 地址',
    placeholder: () => '●.●.●.●',
  },
  // 邮箱地址
  {
    pattern: /\b([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})\b/g,
    label: '邮箱',
    placeholder: (m) => {
      const [local, domain] = m.split('@')
      return local[0] + '***@' + domain
    },
  },
  // UUID / 内部 ID
  {
    pattern: /\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/gi,
    label: '内部 ID',
    placeholder: () => '■■■■-■■■■-■■■■',
  },
  // app_id / app_secret / client_id / client_secret
  {
    pattern: /(app[_\s]?id|app[_\s]?secret|client[_\s]?id|client[_\s]?secret)\s*[:=]\s*[^\s，,;；'"}$]+/gi,
    label: 'API 凭证',
    placeholder: () => '●●●●●●●●',
  },
  // .env 变量引用（长的大写变量名）
  {
    pattern: /\b([A-Z_][A-Z0-9_]{4,})\b/g,
    label: '环境变量',
    placeholder: (m) => m.replace(/./g, '●'),
  },
  // cron job 备份文件名
  {
    pattern: /(jobs\.json\.bak-[0-9\-]{10,})/g,
    label: '备份文件',
    placeholder: () => 'cron-backup-■■■■■■■■',
  },
  // token / key 关键词及后续值
  {
    pattern: /(token|api[_\s]?key|secret|private[_\s]?key)\s*[:=]\s*[^\s，,;；'"}$]{8,}/gi,
    label: '密钥',
    placeholder: () => '●●●●●●●●●●●●●●',
  },
]

/** 对任意文本进行脱敏 */
function maskText(text: string): string {
  let result = text
  for (const config of MASK_CONFIGS) {
    result = result.replace(config.pattern, (match) => {
      const placeholder = config.placeholder(match)
      const encoded = encodeURIComponent(match)
      return `<span class="sensitive-mask" data-label="${config.label}" data-original="${encoded}">${placeholder}</span>`
    })
  }
  return result
}

/**
 * 对 Markdown 内容进行脱敏（用于详情页）
 * 1. 用 marked 转成 HTML
 * 2. 保护代码块内容不脱敏
 * 3. 对 HTML 文本节点脱敏
 */
export function maskDiaryContent(content: string): string {
  const html = marked.parse(content) as string

  // 逐行处理：代码块内不脱敏
  const lines = html.split('\n')
  const result: string[] = []
  let inCodeBlock = false

  for (const line of lines) {
    if (line.includes('<code') || line.includes('<pre')) inCodeBlock = true
    if (inCodeBlock) {
      result.push(line)
    } else {
      result.push(maskText(line))
    }
    if (line.includes('</code>') || line.includes('</pre>')) inCodeBlock = false
  }

  return result.join('\n')
}

/** 对摘要进行脱敏（用于列表页） */
export function maskExcerpt(excerpt: string): string {
  return maskText(excerpt)
}
