import Link from 'next/link'
import styles from './Breadcrumb.module.css'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // 生成 JSON-LD 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && {
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kdnsna.cn'}${item.href}`
      })
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className={styles.breadcrumb} aria-label="面包屑导航">
        <ol className={styles.list}>
          {items.map((item, index) => (
            <li key={index} className={styles.item}>
              {index < items.length - 1 ? (
                <>
                  {item.href ? (
                    <Link href={item.href} className={styles.link}>
                      {item.label}
                    </Link>
                  ) : (
                    <span className={styles.current}>{item.label}</span>
                  )}
                  <span className={styles.separator} aria-hidden="true">/</span>
                </>
              ) : (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
