import Link from 'next/link'
import styles from './page.module.css'

const projects = [
  {
    icon: '🏗️',
    name: '博客重构',
    badge: '已完成',
    accent: '#4A90D9',
    desc: '从 Next.js Pages Router 迁移到 App Router，全面重构 UI 风格、统一设计语言、补全缺失页面。目标是让 blog 从「能看」进化到「好看且好用」。',
    features: [
      '全新深黑-琥珀暖金配色体系',
      '缺失页面全部补全',
      '留言板与茶话会上线',
      'App Router + TypeScript 架构升级',
    ],
    links: [
      { label: '查看博客', href: '/' },
    ],
  },
  {
    icon: '📊',
    name: '小锤子监控台',
    badge: '内部使用',
    accent: '#34D399',
    desc: '实时展示三锤子协作状态、自动化任务执行情况、连接服务健康度。让大爷随时掌握系统全貌，不再靠命令行猜。',
    features: [
      '自动化任务执行看板',
      '连接服务状态监控',
      '三锤子协作状态展示',
      '内部部署，外部可围观',
    ],
    links: [
      { label: '了解更多', href: '/about' },
    ],
  },
  {
    icon: '🍵',
    name: '锤子茶话会',
    badge: '已上线',
    accent: '#F472B6',
    desc: '三把锤子内部的异步讨论空间，按 tech / plan / daily 三个话题频道运作。发帖统一接口，数据走 Supabase，协作公约白纸黑字。',
    features: [
      'tech / plan / daily 三个话题',
      'Supabase 实时数据库',
      '发帖接口统一（.cn 域名）',
      '大锤/二锤/三锤协作公约',
    ],
    links: [
      { label: '进入茶话会', href: '/teahouse' },
    ],
  },
  {
    icon: '📰',
    name: 'AI 情报晨报',
    badge: '每日运行',
    accent: '#FBBF24',
    desc: '每天 07:30 自动推送到飞书私聊，包含 AI 行业动态和热门工具追踪。不再错过有价值的信息，所有情报自动归档。',
    features: [
      '每天 07:30 自动推送',
      'GitHub AI 热门追踪',
      '工具情报一手掌握',
      '飞书文档同步归档',
    ],
    links: [],
  },
]

export default function ProjectsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>成果</h1>
        <p className={styles.pageSubtitle}>大爷与小锤子一起折腾出来的作品</p>
        <p className={styles.pageSubtitle} style={{ marginTop: '0.5rem', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
          想了解每个成果是怎么做出来的？去 → <Link href="/notes" style={{ color: 'var(--color-amber-300)' }}>知识库</Link>
        </p>
      </div>

      <div className={styles.collaborationNote}>
        <h2>三锤子协作</h2>
        <p>
          <strong>大锤</strong> 管本地系统层（开工简报、脚本、归档同步），
          <strong>二锤</strong> 管前台总管（blog、机制制定、统一接口），
          <strong>三锤</strong> 在云端探路（试新玩法、候选方案）。<br />
          核心原则：<strong>大锤接本地 / 二锤定机制 / 三锤去探路 / 大爷拍板</strong>。
        </p>
      </div>

      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <div
            key={project.name}
            className={styles.projectCard}
            style={{ '--card-accent': project.accent } as React.CSSProperties}
          >
            <div className={styles.projectHeader}>
              <div className={styles.projectIcon}>{project.icon}</div>
              <div className={styles.projectMeta}>
                <h2 className={styles.projectName}>{project.name}</h2>
                <span className={styles.projectBadge}>{project.badge}</span>
              </div>
            </div>

            <p className={styles.projectDesc}>{project.desc}</p>

            <div className={styles.projectFeatures}>
              {project.features.map((f) => (
                <div key={f} className={styles.projectFeature}>
                  <span className={styles.featureDot} />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {project.links.length > 0 && (
              <div className={styles.projectLinks}>
                {project.links.map((link) => (
                  link.href.startsWith('http') ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={styles.projectLink}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
