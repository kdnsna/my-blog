'use client'

import styles from './WeiboShare.module.css'

interface WeiboShareProps {
  title: string
  url: string
}

export default function WeiboShare({ title, url }: WeiboShareProps) {
  // 生成分享文案
  const shareText = `📚 刚写了一篇新文章《${title}》
欢迎来我的博客看看 👉 ${url}

#kdnsna的数字空间`

  const handleShare = () => {
    // 编码分享内容
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(shareText)

    // 构建微博分享链接
    const weiboShareUrl = `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`

    // 在新窗口打开微博分享页面
    window.open(weiboShareUrl, '_blank', 'width=600,height=500,toolbar=no,menubar=no,scrollbars=no')
  }

  return (
    <div className={styles.shareSection}>
      <div className={styles.shareLabel}>
        <span className={styles.shareIcon}>🔗</span>
        <span>分享到</span>
      </div>
      <button onClick={handleShare} className={styles.shareButton} aria-label="分享到微博">
        <svg className={styles.weiboIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.578-.18-.401-.649.386-1.029.422-1.925-.001-2.482-.791-1.04-3.204-.601-5.625-.272l.003-.011c-.493-.129-.829-.523-.829-1.036 0-.625.579-1.045 1.175-.865 3.665 1.104 5.731 3.619 5.731 5.963 0 1.295-.914 2.145-1.78 2.145-.465 0-.749-.261-.749-.605 0-.317.246-.607.654-.719.206-.055.399-.012.486.068.09.083.119.221.064.416-.138.486-.737.709-1.306.709-.818 0-1.201-.576-1.201-1.343 0-.951.493-1.854 1.344-2.605.696-.608 1.538-1.075 2.435-1.318a.62.62 0 0 1 .757.325c.152.323.006.752-.373.968a5.21 5.21 0 0 1-.385.211z"/>
        </svg>
        <span>微博</span>
      </button>
    </div>
  )
}
