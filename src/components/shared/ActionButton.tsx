import Link from 'next/link'
import styles from './ActionButton.module.css'
import type { ActionButtonProps } from '@/lib/types'

export default function ActionButton({
  children,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className = ''
}: ActionButtonProps) {
  return (
    <Link
      href={href}
      className={`
        ${styles.button}
        ${styles[variant]}
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ''}
        ${className}
      `}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
    </Link>
  )
}
