import Link from 'next/link'
import styles from './UpdateItem.module.css'
import type { UpdateItem as UpdateItemType } from '@/lib/types'
import { getUpdateTypeIcon } from '@/lib/home'

interface UpdateItemProps {
  item: UpdateItemType
}

export default function UpdateItem({ item }: UpdateItemProps) {
  // 格式化日期：2026-04-15 -> 04-15
  const formattedDate = item.date.slice(5)
  const icon = getUpdateTypeIcon(item.type)

  return (
    <Link href={item.href} className={styles.item}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.date}>{formattedDate}</span>
      <span className={styles.title}>{item.title}</span>
      <span className={styles.arrow}>→</span>
    </Link>
  )
}
