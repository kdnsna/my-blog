import Link from 'next/link'
import styles from './page.module.css'

const projects = [
  {
    icon: '🏗️',
    name: '博客重构',
    badge: '进行中',
    accent: '#4A90D9',
    desc: '从 Next.js Pages Router 迁移到 App Router，全面重构 UI 风格、统一设计语言、补全缺失页面。目标是让 blog 从「能看」进化到「好看且好用」。',
    features: [
      'App Router + TypeScript 重构',
      '深黑-琥珀暖金配色体系',
      'Noto Serif/Sans SC 中文字体',
      '缺失页面补全（留言板、茶话会）',
    ],
    links: [
      { label: '查看博客', href: '/' },
    ],
  },
  {
    icon: '📊',
    name: '小锤子监控台',
    badge: '已上线',
    accent: '#34D399',
    desc: '实时展示三锤子协作状态、自动化任务执行情况、连接服务健康度。用可视化面板替代命令行监控，让大爷随时掌握系统全貌。',
    features: [
      '自动化任务执行看板',
      '连接服务状态监控',
      'GitHub 协作热力图',
      '三锤子协作状态展示',
    ],
    links: [
      { label: '打开监控台', href: 'http://localhost:5173' },
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
    badge: '自动化',
    accent: '#FBBF24',
    desc: '每天 07:30 推送飞书私聊，包含 5 条 GitHub Trending（AI/agent/LLM/MCP 相关）+ 5 条 ClawHub 热门技能。归档同步写入飞书文档，形成情报知识库。',
    features: [
      '每天 07:30 定时推送',
      'GitHub Trending AI 榜单',
      'ClawHub 热门技能追踪',
      '飞书文档归档链路',
    ],
    links: [],
  },
]

export default function ProjectsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>成果</h1>
        <p className={styles.pageSubtitle}>大爷与小锤子一起折腾出来的作品，每一行代码都有故事</p>
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
