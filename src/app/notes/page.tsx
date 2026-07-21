import NotesClient from './NotesClient'
import { getMethodNotes } from '@/lib/method'

export default function NotesPage() {
  const notes = getMethodNotes().map(({ isFeatured, ...note }) => ({
    ...note,
    featured: isFeatured,
  }))

  return <NotesClient notes={notes} />
}
