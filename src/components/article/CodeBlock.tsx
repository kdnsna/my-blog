'use client'

import { useState } from 'react'
import styles from './CodeBlock.module.css'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  'data-title'?: string
  'data-language'?: string
}

export function CodeBlock({ children, className, 'data-title': title, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const code = extractCodeFromChildren(children)
    if (code) {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const language = className?.replace('language-', '') || props['data-language'] || 'code'

  return (
    <div className={styles.wrapper}>
      {title && (
        <div className={styles.header}>
          <span className={styles.language}>{language}</span>
          <span className={styles.filename}>{title}</span>
        </div>
      )}
      <div className={styles.container}>
        <button 
          className={styles.copyBtn}
          onClick={handleCopy}
          aria-label="复制代码"
        >
          {copied ? '✓ 已复制' : '复制'}
        </button>
        <pre className={styles.pre}>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  )
}

// 从 React 节点中提取文本内容
function extractCodeFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') {
    return children
  }
  
  if (Array.isArray(children)) {
    return children.map(extractCodeFromChildren).join('')
  }
  
  if (children && typeof children === 'object' && 'props' in children) {
    return extractCodeFromChildren((children as React.ReactElement<{children?: React.ReactNode}>).props?.children)
  }
  
  return ''
}

// 行内代码
export function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className={styles.inline}>{children}</code>
}
