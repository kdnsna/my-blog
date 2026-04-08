'use client'

import { useState, useEffect } from 'react'
import styles from './TypewriterText.module.css'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  className?: string
}

export default function TypewriterText({
  text,
  speed = 80,
  delay = 0,
  className = ''
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    // 延迟开始
    const delayTimer = setTimeout(() => {
      setIsTyping(true)
    }, delay)

    return () => clearTimeout(delayTimer)
  }, [delay])

  useEffect(() => {
    if (!isTyping) return

    let currentIndex = 0
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [isTyping, text, speed])

  return (
    <span className={`${styles.typewriter} ${className}`}>
      {displayText}
      <span className={styles.cursor}>|</span>
    </span>
  )
}
