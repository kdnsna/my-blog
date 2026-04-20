'use client'

import { useState } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/shared/SectionHeader'
import type { ProjectAchievement, CaseAchievement, ChangelogEntry, ProjectStatus } from '@/lib/types'
import { PROJECT_STATUS_INFO } from '@/lib/types'
import styles from './AchievementContent.module.css'

interface AchievementContentProps {
  projects: ProjectAchievement[]
  cases: CaseAchievement[]
  changelog: ChangelogEntry[]
  stats: { totalProjects: number; completedProjects: number; totalCases: number; latestDate: string }
}

export default function AchievementContent({
  projects,
  cases,
  changelog,
  stats
}: AchievementContentProps) {
  const [typeFilter, setTypeFilter] = useState<'all' | 'project' | 'case'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all')
  const [changelogExpanded, setChangelogExpanded] = useState(false)

  const filteredProjects = projects.filter(p => {
    if (statusFilter === 'all') return true
    return p.status === statusFilter
  })

  const displayProjects = typeFilter === 'case' ? [] : filteredProjects
  const displayCases = typeFilter === 'project' ? [] : cases.slice(0, typeFilter === 'all' ? 4 : 8)

  // 可用的状态选项（根据实际数据动态生成）
  const availableStatuses: ('all' | ProjectStatus)[] = ['all', 'active', 'completed', 'stopped', 'archived']

  return (
    <div className={styles.container}>
      {/* 筛选器 */}
      <div className={styles.filters}>
        <div className={styles.typeTabs}>
          <button
            className={`${styles.typeTab} ${typeFilter === 'all' ? styles.typeTabActive : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            全部
          </button>
          <button
            className={`${styles.typeTab} ${typeFilter === 'project' ? styles.typeTabActive : ''}`}
            onClick={() => setTypeFilter('project')}
          >
            项目
          </button>
          <button
            className={`${styles.typeTab} ${typeFilter === 'case' ? styles.typeTabActive : ''}`}
            onClick={() => setTypeFilter('case')}
          >
            案例
          </button>
        </div>
        
        {typeFilter !== 'case' && (
          <div className={styles.statusFilter}>
            {availableStatuses.map(status => {
              const info = status === 'all' ? null : PROJECT_STATUS_INFO[status]
              return (
                <button
                  key={status}
                  className={`${styles.statusBtn} ${statusFilter === status ? styles.statusBtnActive : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'all' ? '全部' : `${info?.statusIcon || ''} ${info?.statusLabel || status}`}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 项目型成果 */}
      {(typeFilter === 'all' || typeFilter === 'project') && displayProjects.length > 0 && (
        <section className={styles.section}>
          <SectionHeader
            icon="🏗️"
            title="项目型成果"
            subtitle="有完整背景、目标和结果的独立项目"
          />
          <div className={styles.projectGrid}>
            {displayProjects.map(project => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectHeader}>
                  <span className={styles.projectIcon}>{project.icon}</span>
                  <h3 className={styles.projectName}>{project.name}</h3>
                  <span 
                    className={styles.projectStatus}
                    style={{ color: project.statusColor, borderColor: project.statusColor }}
                  >
                    {project.statusIcon} {project.statusLabel}
                  </span>
                </div>
                
                <div className={styles.projectBody}>
                  <div className={styles.projectBlock}>
                    <span className={styles.projectBlockLabel}>背景</span>
                    <p className={styles.projectBlockText}>{project.background}</p>
                  </div>
                  <div className={styles.projectBlock}>
                    <span className={styles.projectBlockLabel}>目标</span>
                    <p className={styles.projectBlockText}>{project.goal}</p>
                  </div>
                  <div className={styles.projectBlock}>
                    <span className={styles.projectBlockLabel}>结果</span>
                    <p className={styles.projectBlockText}>{project.result}</p>
                  </div>
                </div>

                <div className={styles.projectFooter}>
                  <div className={styles.projectTags}>
                    {project.tags.slice(0, 4).map(tag => (
                      <span key={tag} className={styles.projectTag}>{tag}</span>
                    ))}
                  </div>
                  {project.relatedDiaries.length > 0 && (
                    <Link href={`/diary/${project.relatedDiaries[0]}`} className={styles.projectLink}>
                      相关日记 →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 案例型成果 */}
      {(typeFilter === 'all' || typeFilter === 'case') && displayCases.length > 0 && (
        <section className={styles.section}>
          <SectionHeader
            icon="🔧"
            title="案例型成果"
            subtitle="具体问题的解决过程"
          />
          <div className={styles.caseGrid}>
            {displayCases.map(c => (
              <div key={c.id} className={styles.caseCard}>
                <div className={styles.caseContent}>
                  <h3 className={styles.caseTitle}>{c.title}</h3>
                  <p className={styles.caseDesc}>{c.description}</p>
                </div>
                <div className={styles.caseFooter}>
                  <span className={styles.caseDate}>{c.date}</span>
                  <div className={styles.caseTags}>
                    {c.tags.slice(0, 2).map(tag => (
                      <span key={tag} className={styles.caseTag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 更新日志 - 默认折叠 */}
      {typeFilter === 'all' && (
        <section className={styles.section}>
          <button 
            className={styles.changelogToggle}
            onClick={() => setChangelogExpanded(!changelogExpanded)}
            aria-expanded={changelogExpanded}
          >
            <div className={styles.changelogToggleContent}>
              <span className={styles.changelogToggleIcon}>📋</span>
              <span className={styles.changelogToggleTitle}>更新日志</span>
              <span className={styles.changelogToggleHint}>内部迭代记录</span>
            </div>
            <span className={`${styles.changelogToggleArrow} ${changelogExpanded ? styles.changelogToggleArrowOpen : ''}`}>
              ▼
            </span>
          </button>
          
          {changelogExpanded && (
            <div className={styles.changelog}>
              {changelog.map((entry, index) => (
                <div key={index} className={styles.changelogItem}>
                  <div className={styles.changelogDate}>
                    <span className={styles.changelogDay}>
                      {new Date(entry.date).getDate()}
                    </span>
                    <span className={styles.changelogMonth}>
                      {new Date(entry.date).toLocaleDateString('zh-CN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className={styles.changelogContent}>
                    {entry.changes.map((change, i) => (
                      <div key={i} className={styles.changelogChange}>
                        <span className={styles.changelogBullet}>•</span>
                        <span className={styles.changelogText}>{change}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 空状态 */}
      {displayProjects.length === 0 && displayCases.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📭</span>
          <p>暂无符合条件的成果</p>
        </div>
      )}
    </div>
  )
}
