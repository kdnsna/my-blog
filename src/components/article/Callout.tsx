import styles from './Callout.module.css'

type CalloutType = 'note' | 'tip' | 'warning' | 'danger'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}

const CALLOUT_CONFIG: Record<CalloutType, { icon: string; defaultTitle: string }> = {
  note: { icon: '📝', defaultTitle: '备注' },
  tip: { icon: '💡', defaultTitle: '提示' },
  warning: { icon: '⚠️', defaultTitle: '注意' },
  danger: { icon: '🚨', defaultTitle: '危险' }
}

export function Callout({ type = 'note', title, children }: CalloutProps) {
  const config = CALLOUT_CONFIG[type]

  return (
    <div className={`${styles.callout} ${styles[type]}`}>
      <span className={styles.icon}>{config.icon}</span>
      <div className={styles.content}>
        {title && <strong className={styles.title}>{title}</strong>}
        {!title && <strong className={styles.title}>{config.defaultTitle}</strong>}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}

// 预设组件
export function Note(props: Omit<CalloutProps, 'type'>) {
  return <Callout type="note" {...props} />
}

export function Tip(props: Omit<CalloutProps, 'type'>) {
  return <Callout type="tip" {...props} />
}

export function Warning(props: Omit<CalloutProps, 'type'>) {
  return <Callout type="warning" {...props} />
}

export function Danger(props: Omit<CalloutProps, 'type'>) {
  return <Callout type="danger" {...props} />
}
