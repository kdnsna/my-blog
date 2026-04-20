import styles from './Tag.module.css'

interface TagProps {
  children: React.ReactNode
  color?: string
  size?: 'sm' | 'md'
  onClick?: () => void
  className?: string
}

export default function Tag({ 
  children, 
  color,
  size = 'sm',
  onClick,
  className = ''
}: TagProps) {
  const Component = onClick ? 'button' : 'span'
  
  return (
    <Component
      className={`${styles.tag} ${styles[size]} ${onClick ? styles.clickable : ''} ${className}`}
      style={color ? { 
        backgroundColor: `${color}15`, 
        color: color,
        borderColor: `${color}30`
      } : undefined}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </Component>
  )
}
