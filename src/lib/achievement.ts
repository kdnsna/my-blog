/**
 * 成果页数据层
 * 展示项目背景、目标、结果，体现可信度
 */

import { getAllDiaries } from './diary'
import { allNotes } from './notes'
import { PROJECT_STATUS_INFO } from './types'
import type { ProjectAchievement, CaseAchievement, ChangelogEntry } from './types'

/**
 * 获取项目型成果
 * 这些是有完整背景、目标、结果的项目
 */
export function getProjectAchievements(): ProjectAchievement[] {
  // 从日记中提取项目相关的内容
  const diaries = getAllDiaries()
  
  const projects: ProjectAchievement[] = [
    {
      id: 'blog-refactor',
      name: '博客重构',
      icon: '🏗️',
      background: '原来的博客功能残缺（留言板404、知识库不完整）、UI 风格陈旧、代码架构混乱，维护困难。',
      goal: '从 Pages Router 迁移到 App Router，升级到 Next.js 16 + React 19，统一设计语言，补全所有缺失页面。',
      status: 'completed',
      ...PROJECT_STATUS_INFO['completed'],
      result: '全新 UI 界面、统一的组件设计语言、完整的日记/知识库/项目/茶馆页面、真实数据 SSR 渲染。',
      tags: ['建站', 'Next.js', 'React', 'UI'],
      updatedAt: '2026-04-20',
      relatedDiaries: diaries
        .filter(d => d.title.includes('Blog') || d.title.includes('博客') || d.title.includes('重构'))
        .slice(0, 3)
        .map(d => d.slug),
      relatedNotes: []
    },
    {
      id: 'monitoring-dashboard',
      name: '小锤子监控台',
      icon: '📊',
      background: 'AI 助手运行在后台，想直观看到运行状态、Token 用量、成本消耗和任务日志。',
      goal: '打造一个端口 3210 的独立监控面板，能实时展示各项指标，并与博客系统打通。',
      status: 'active',
      ...PROJECT_STATUS_INFO['active'],
      result: '独立的监控面板，支持 Token 统计、成本追踪、任务日志查看，已与博客系统数据同步。',
      tags: ['监控', 'OpenClaw', 'React'],
      updatedAt: '2026-04-14',
      relatedDiaries: diaries
        .filter(d => d.title.includes('监控') || d.title.includes('监控台'))
        .slice(0, 2)
        .map(d => d.slug),
      relatedNotes: allNotes
        .filter(n => n.tags.includes('监控'))
        .slice(0, 2)
        .map(n => n.id)
    },
    {
      id: 'memory-system',
      name: '三锤记忆系统',
      icon: '🧠',
      background: 'AI 助手需要长期记忆能力，原方案过于简单，需要更系统的记忆管理机制。',
      goal: '构建基于 EverMemOS SOTA 方案的云端记忆系统，支持 MemCell 结构化存储、Foresight 预测、RRF 混合检索。',
      status: 'completed',
      ...PROJECT_STATUS_INFO['completed'],
      result: '完整的记忆系统架构，支持三层存储（Markdown/SQLite/向量）、每日自动整理、GitHub 异地备份。',
      tags: ['记忆系统', 'AI', 'SQLite', '架构'],
      updatedAt: '2026-04-15',
      relatedDiaries: diaries
        .filter(d => d.title.includes('记忆') || d.title.includes('Memory'))
        .slice(0, 3)
        .map(d => d.slug),
      relatedNotes: allNotes
        .filter(n => n.category === '记忆系统')
        .map(n => n.id)
    },
    {
      id: 'daily-briefing',
      name: 'AI 情报晨报',
      icon: '📰',
      background: '想每天早上了解 AI 行业最新动态，但手动搜索太费时间。',
      goal: '每天 07:30 自动推送 AI 行业热门资讯，包括 GitHub Trending 和 ClawHub 技能榜单。',
      status: 'stopped',
      ...PROJECT_STATUS_INFO['stopped'],
      result: '每天 07:30 自动推送 10 条精选内容（5条 GitHub + 5条 ClawHub），自动归档到飞书文档。2026年4月15日起停用。',
      tags: ['自动化', 'AI', '信息流'],
      updatedAt: '2026-04-15',
      relatedDiaries: diaries
        .filter(d => d.title.includes('晨报') || d.title.includes('情报'))
        .slice(0, 2)
        .map(d => d.slug),
      relatedNotes: allNotes
        .filter(n => n.category === '自动化')
        .map(n => n.id)
    }
  ]
  
  return projects
}

/**
 * 获取案例型成果
 * 具体问题的解决过程
 */
export function getCaseAchievements(): CaseAchievement[] {
  const cases: CaseAchievement[] = [
    {
      id: 'mobile-nav-fix',
      title: '手机端导航菜单修复',
      description: '博客在手机端导航菜单始终展开无法收起，排查发现 CSS 未根据菜单状态控制显隐，添加 mobileMenuOpen 条件类名后修复。',
      tags: ['建站', 'CSS', '移动端'],
      date: '2026-04-20',
      relatedProjectId: 'blog-refactor'
    },
    {
      id: 'moonshot-flow-fix',
      title: 'Moonshot 流量暴涨根治',
      description: 'Kimi API 流量异常增长，经过监控分析找到根因并彻底解决。',
      tags: ['监控', 'API', '安全'],
      date: '2026-04-15',
      relatedProjectId: 'monitoring-dashboard'
    },
    {
      id: 'blog-sync-fix',
      title: '博客日记同步问题修复',
      description: 'Blog 首页看不到最新日记，排查发现 git 未提交导致 Vercel 部署旧版本。',
      tags: ['自动化', 'Git', '建站'],
      date: '2026-04-10',
      relatedProjectId: 'blog-refactor'
    },
    {
      id: 'diary-style-rewrite',
      title: '日记风格全面重写',
      description: '从模板化日志升级为有判断、有个性的连续叙事，12篇日记全部重写。',
      tags: ['日记', '写作'],
      date: '2026-04-10'
    },
    {
      id: 'security-audit-setup',
      title: '夜间安全巡检上线',
      description: '每天 00:20 自动执行安全审计，检查插件基线、配置异常和权限边界。',
      tags: ['安全', '自动化'],
      date: '2026-03-24',
      relatedProjectId: 'memory-system'
    }
  ]
  
  return cases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * 获取更新日志
 * 从项目进展中提取
 */
export function getChangelog(): ChangelogEntry[] {
  // 从最近日记中提取更新内容
  const recentUpdates: ChangelogEntry[] = [
    {
      date: '2026-04-20',
      changes: [
        '修复手机端导航菜单无法收起的问题',
        '博客重构项目持续优化'
      ],
      relatedType: 'case'
    },
    {
      date: '2026-04-15',
      changes: [
        '博客首页重构上线，六大模块全新设计',
        '修复 Moonshot 流量异常问题',
        '三锤记忆系统完成架构升级'
      ],
      relatedType: 'project'
    },
    {
      date: '2026-04-14',
      changes: [
        '小锤子监控台上线，支持 Token 和成本统计',
        '博客与监控台数据同步完成'
      ],
      relatedType: 'project'
    },
    {
      date: '2026-04-10',
      changes: [
        '博客重构正式完成并部署',
        '日记系统全面升级为连续叙事风格',
        '修复博客日记同步问题'
      ],
      relatedType: 'project'
    },
    {
      date: '2026-04-07',
      changes: [
        '晨报学习追踪器上线',
        'AI 情报日报自动化'
      ],
      relatedType: 'project'
    },
    {
      date: '2026-03-24',
      changes: [
        '夜间安全巡检自动化上线',
        '每日 00:20 自动审计'
      ],
      relatedType: 'case'
    }
  ]
  
  return recentUpdates
}

/**
 * 获取成果页统计数据
 */
export function getAchievementStats(): { 
  totalProjects: number
  completedProjects: number
  totalCases: number
  latestDate: string 
} {
  const projects = getProjectAchievements()
  const cases = getCaseAchievements()
  
  return {
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalCases: cases.length,
    latestDate: projects[0]?.updatedAt || ''
  }
}