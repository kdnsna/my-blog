import Image from 'next/image'
import styles from './ArticleImage.module.css'

interface ArticleImageProps {
  src: string
  alt: string
  caption?: string
  fullWidth?: boolean
  width?: number
  height?: number
}

export function ArticleImage({ src, alt, caption, fullWidth = false, width = 800, height = 600 }: ArticleImageProps) {
  return (
    <figure className={`${styles.figure} ${fullWidth ? styles.fullWidth : ''}`}>
      <div className={styles.imageWrapper}>
        <Image 
          src={src} 
          alt={alt}
          width={width}
          height={height}
          className={styles.image}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className={styles.caption}>{caption}</figcaption>
      )}
    </figure>
  )
}
