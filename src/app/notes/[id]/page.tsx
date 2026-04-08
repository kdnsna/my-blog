import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getNoteById } from '@/lib/notes'
import styles from '../../notes/page.module.css'
import noteStyles from './page.module.css'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function NoteDetailPage({ params }: PageProps) {
  const { id } = await params
  const note = getNoteById(id)

  if (!note) {
    notFound()
  }

  return (
    <div className={styles.page}>
      <Link href="/notes" className={noteStyles.backLink}>
        <span>←</span>
        返回知识库
      </Link>

      <article className={noteStyles.article}>
        <header className={noteStyles.articleHeader} style={{ '--note-accent': note.categoryColor } as React.CSSProperties}>
          <div className={noteStyles.articleMeta}>
            <span className={noteStyles.articleIcon}>{note.icon}</span>
            <span className={noteStyles.articleCategory} style={{ color: note.categoryColor }}>{note.category}</span>
            <span className={noteStyles.articleDate}>{note.date}</span>
          </div>
          <h1 className={noteStyles.articleTitle}>{note.title}</h1>
          <p className={noteStyles.articleDescription}>{note.description}</p>

          <div className={noteStyles.articleTags}>
            {note.tags.map((tag) => (
              <span key={tag} className={noteStyles.articleTag}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className={noteStyles.articleContent}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.detail}
          </ReactMarkdown>
        </div>

        <footer className={noteStyles.articleFooter}>
          <Link href="/notes" className={noteStyles.backToNotes}>
            <span>←</span>
            返回知识库
          </Link>
        </footer>
      </article>
    </div>
  )
}
