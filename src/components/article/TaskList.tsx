'use client'

import styles from './TaskList.module.css'

interface TaskListProps {
  children: React.ReactNode
}

export function TaskList({ children }: TaskListProps) {
  return (
    <ul className={styles.list}>
      {children}
    </ul>
  )
}

interface TaskItemProps {
  checked: boolean
  children: React.ReactNode
}

export function TaskItem({ checked, children }: TaskItemProps) {
  return (
    <li className={`${styles.item} ${checked ? styles.checked : ''}`}>
      <input 
        type="checkbox" 
        className={styles.checkbox}
        checked={checked}
        readOnly
      />
      <span className={styles.content}>{children}</span>
    </li>
  )
}
