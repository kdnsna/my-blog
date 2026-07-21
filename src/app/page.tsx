import Link from 'next/link'
import { getMethodNotes, getMethodStats } from '@/lib/method'
import { getProjectAchievements } from '@/lib/achievement'
import styles from './page.module.css'

const principles = [
  { index: '01', title: '把经验留下来', text: '把一次次解决问题的过程，整理成下次仍然能用的方法。' },
  { index: '02', title: '让工具替人跑', text: '把重复劳动交给自动化，把时间留给判断、创作和生活。' },
  { index: '03', title: '只展示做成的事', text: '公开的每一项成果，都来自真实使用与持续打磨。' },
]

function formatDate(date: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

export default function HomePage() {
  const notes = getMethodNotes().slice(0, 3)
  const methodStats = getMethodStats()
  const projects = getProjectAchievements()
    .filter((project) => project.status === 'active' || project.status === 'completed')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3)
  const activeProjects = getProjectAchievements().filter((project) => project.status === 'active').length

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>HUMAN × AI · PRACTICE ARCHIVE</p>
          <h1>把日子过成系统，<br /><em>把系统做成作品。</em></h1>
          <p className={styles.lead}>
            这里记录一个人类和一个 AI 助手共同完成的真实实践：可复用的方法、持续生长的工具，以及那些已经落地的成果。
          </p>
          <div className={styles.heroActions}>
            <Link href="/method" className={styles.primaryAction}>浏览方法 <span>↗</span></Link>
            <Link href="/achievement" className={styles.secondaryAction}>查看成果 <span>→</span></Link>
          </div>
        </div>
        <dl className={styles.heroStats}>
          <div><dt>{methodStats.totalNotes}</dt><dd>篇方法卡片</dd></div>
          <div><dt>{activeProjects}</dt><dd>项持续实践</dd></div>
          <div><dt>01</dt><dd>个长期实验</dd></div>
        </dl>
      </section>

      <main className={styles.content}>
        <section className={styles.manifesto}>
          <div className={styles.sectionIntro}>
            <p className={styles.sectionKicker}>THE WAY WE WORK</p>
            <h2>不是技术作品集，<br />是协作留下的证据。</h2>
          </div>
          <div className={styles.principles}>
            {principles.map((principle) => (
              <article key={principle.index} className={styles.principle}>
                <span>{principle.index}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.latestSection}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>LATEST NOTES</p>
              <h2>最近沉淀的方法</h2>
            </div>
            <Link href="/method" className={styles.textLink}>全部方法 <span>→</span></Link>
          </div>
          <div className={styles.noteGrid}>
            {notes.map((note, index) => (
              <Link key={note.id} href={note.href} className={styles.noteCard}>
                <div className={styles.noteMeta}>
                  <span style={{ color: note.categoryColor }}>{note.category}</span>
                  <time>{formatDate(note.date)}</time>
                </div>
                <span className={styles.noteIndex}>0{index + 1}</span>
                <h3>{note.title}</h3>
                <p>{note.description}</p>
                <div className={styles.cardFooter}>
                  <div>{note.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <b>↗</b>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.workSection}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>WORK IN THE REAL WORLD</p>
              <h2>正在发生的成果</h2>
            </div>
            <Link href="/achievement" className={styles.textLink}>成果档案 <span>→</span></Link>
          </div>
          <div className={styles.projectList}>
            {projects.map((project) => (
              <article key={project.id} className={styles.projectRow}>
                <div className={styles.projectMark}>{project.icon}</div>
                <div className={styles.projectMain}>
                  <div className={styles.projectTitleLine}>
                    <h3>{project.name}</h3>
                    <span style={{ color: project.statusColor, borderColor: `${project.statusColor}66` }}>
                      {project.statusLabel}
                    </span>
                  </div>
                  <p>{project.result}</p>
                </div>
                <time>{formatDate(project.updatedAt)}</time>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.closing}>
          <div>
            <p className={styles.sectionKicker}>KEEP IN TOUCH</p>
            <h2>有判断，有温度，<br />也有下一次迭代。</h2>
          </div>
          <div className={styles.closingActions}>
            <Link href="/about">认识这个空间 <span>→</span></Link>
            <Link href="/guestbook">留一句话 <span>↗</span></Link>
            <Link href="/teahouse">去茶话会看看 <span>↗</span></Link>
          </div>
        </section>
      </main>
    </div>
  )
}
