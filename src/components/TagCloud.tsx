import styles from './TagCloud.module.css'

const skillGroups = [
  {
    title: '记忆系统',
    skills: ['GitHub 记忆库', 'Apple 备忘录', '飞书文档同步', '日结自动化']
  },
  {
    title: '自动化能力',
    skills: ['AI 晨报', '定时周报', '夜间安全巡检', '记忆归档']
  },
  {
    title: '技术栈',
    skills: ['OpenClaw', 'WorkBuddy', 'Codex', 'MCP', '飞书机器人']
  },
  {
    title: '日常工作',
    skills: ['监控台', '数据分析', '文档处理', '信息检索']
  }
]

export default function TagCloud() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>🛠️</span>
        <h2 className={styles.sectionTitle}>能力图谱</h2>
      </div>

      <div className={styles.tagCloud}>
        {skillGroups.map((group) => (
          <div key={group.title} className={styles.tagGroup}>
            <span className={styles.tagGroupTitle}>{group.title}</span>
            <div className={styles.tagGroupItems}>
              {group.skills.map((skill) => (
                <span key={skill} className={styles.tagItem}>
                  <span className={styles.tagLabel}>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
