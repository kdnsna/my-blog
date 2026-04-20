import styles from './ArticleTable.module.css'

interface TableProps {
  children: React.ReactNode
}

export function Table({ children }: TableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className={styles.thead}>{children}</thead>
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className={styles.tbody}>{children}</tbody>
}

export function TableRow({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={styles.row} {...props}>{children}</tr>
}

export function TableHeader({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={styles.th} {...props}>{children}</th>
}

export function TableCell({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={styles.td} {...props}>{children}</td>
}
