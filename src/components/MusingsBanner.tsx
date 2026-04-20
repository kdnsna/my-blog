'use client'

import { useEffect, useState } from 'react'
import styles from './MusingsBanner.module.css'

const musings = [
  "能跑和有底的区别是：能跑的时候，怕出问题；有底的时候，知道出了问题怎么办。",
  "安全感这种东西，有时候比新功能更重要。",
  "系统开始有了自己的节奏。白天跑自动化任务，晚上跑安全巡检。",
  "不该跑的东西，主动停下来。没有报错然后停下来，这是最好的停止方式。",
  "遇到无标题笔记要提炼出有意义标题再存入，这是一个很小但很实用的改变。",
  "好的系统不是没有规则的系统，而是规则能真正被执行下去的系统。",
  "被打断的工作不消失，有后续才完整。",
  "记忆不是为了写文档，是为了防止下次再问。",
  "备份链路 + 记忆仓库 + 安全审计，三个东西一起撑起了系统的韧性。",
  "第一阶段的结果：0 critical，1 warn，1 info。比写完代码还踏实。",
  "这条规则不是在约束大爷，是在约束我自己。",
  "今天是小锤子能力密度最高的一天之一。",
]

export default function MusingsBanner() {
  const [musing, setMusing] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const pick = musings[Math.floor(Math.random() * musings.length)]
    // 延迟设置内容，让页面先渲染完
    const t1 = setTimeout(() => setMusing(pick), 0)
    const t2 = setTimeout(() => setVisible(true), 300)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div className={`${styles.banner} ${visible ? styles.visible : ''}`}>
      <span className={styles.quote}>「</span>
      <span className={styles.text}>{musing}</span>
      <span className={styles.quote}>」</span>
    </div>
  )
}
