import Link from 'next/link'
import { allNotes } from '@/lib/notes'
import styles from './NotesSection.module.css'

export default function NotesSection() {
  // Featured 笔记优先，其次按日期倒序，最多 6 条
  const featured = allNotes.filter(n => n.featured)
  const others = allNotes.filter(n => !n.featured)
    .sort((a, b) => b.date.localeCompare(a.date))
  const displayNotes = [...featured, ...others].slice(0, 6)

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleWrapper}>
          <span className={styles.sectionIcon}>📚</span>
          <h2 className={styles.sectionTitle}>知识库精选</h2>
        </div>
        <Link href="/method" className={styles.viewAllLink}>
          查看全部
          <span>→</span>
        </Link>
      </div>

      <div className={styles.cardGrid}>
        {displayNotes.map((note) => (
          <Link href={`/notes/${note.id}`} key={note.id} className={styles.card}>
            <div className={styles.cardMeta}>
              <span className={styles.cardIcon}>{note.icon}</span>
              <span
                className={styles.cardCategory}
                style={{ backgroundColor: `${note.categoryColor}1a`, color: note.categoryColor }}
              >
                {note.category}
              </span>
              {note.featured && <span className={styles.featuredBadge}>精选</span>}
            </div>
            <h3 className={styles.cardTitle}>{note.title}</h3>
            <p className={styles.cardDesc}>{note.description}</p>
            <div className={styles.cardFooter}>
              <div className={styles.cardTags}>
                {note.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className={styles.cardTag}>{tag}</span>
                ))}
              </div>
              <span className={styles.cardDate}>{note.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
