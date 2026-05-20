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
      id: 'wedding-navigator',
      name: '甜囍手册',
      icon: '💒',
      background: '大爷2026年11月婚期，需要一款微信小程序统筹婚礼全流程——婚书请柬、路书导航、天气查询、相册管理、宾客RSVP。',
      goal: '基于 uni-app 打造全功能婚礼小程序，支持双角色架构（主人端+宾客端）、云端数据同步、云函数天气。',
      status: 'active',
      ...PROJECT_STATUS_INFO['active'],
      result: 'v2.0.14 已上线。路书地图集成腾讯位置服务，天气云函数对接和风天气，相册管理支持批量操作，7个云函数全量部署。',
      tags: ['微信小程序', 'uni-app', '云开发', '婚礼'],
      updatedAt: '2026-05-19',
      github: 'https://github.com/kdnsna/wedding-navigator',
      relatedDiaries: [],
      relatedNotes: []
    },
    {
      id: 'desktop-auto-organize',
      name: '桌面自动归档系统',
      icon: '🗂️',
      background: 'Mac桌面长期散落大量工作文件，手动整理效率低且易遗漏，需要一套能自动识别项目归属并归档的系统。',
      goal: '建立关键词驱动的桌面文件自动归档系统，每两天自动扫描、分类、移动，覆盖所有工作项目。',
      status: 'active',
      ...PROJECT_STATUS_INFO['active'],
      result: 'Cron每两天自动运行。17个关键词→项目映射，自动归档到 ~/Documents 对应目录。处理iCloud文件锁、重名冲突、敏感文件跳过。5月已归档40+文件。',
      tags: ['自动化', 'macOS', '文件管理', 'Cron'],
      updatedAt: '2026-05-19',
      relatedDiaries: [],
      relatedNotes: []
    },
    {
      id: 'weread-agent',
      name: '微信读书 Agent',
      icon: '📚',
      background: '大爷微信读书书架有249本书，品类横跨玄幻、历史、科幻、经济，需要一个AI助手统一管理和推荐。',
      goal: '接入微信读书 Agent API，实现书架智能管理、阅读进度追踪、个性化推荐和笔记分析。',
      status: 'active',
      ...PROJECT_STATUS_INFO['active'],
      result: '已通过 Agent API 成功接入，可实时查询249本书架（含阅读进度和分类），支持公开/私密阅读状态识别。',
      tags: ['微信读书', 'API', '阅读管理'],
      updatedAt: '2026-05-17',
      relatedDiaries: [],
      relatedNotes: []
    },
    {
      id: 'hermes-feishu-integration',
      name: 'Hermes 飞书深度集成',
      icon: '🔗',
      background: '飞书作为主力通讯平台，与 Hermes 集成中存在多个痛点——交互卡片按钮报错200340、代理导致WebSocket断连、消息Markdown渲染异常。',
      goal: '逐项排查并修复飞书集成中的所有问题，确保稳定通信和良好体验。',
      status: 'completed',
      ...PROJECT_STATUS_INFO['completed'],
      result: '修复卡片交互200340（三项配置检查法）、配置NO_PROXY解决代理断连、优化消息排版（弃用表格、精简格式）。',
      tags: ['飞书', 'Hermes', '集成', '排障'],
      updatedAt: '2026-05-10',
      relatedDiaries: [],
      relatedNotes: []
    },
    {
      id: 'ultimate-ppt-master-skill',
      name: '跨Agent PPT技能包',
      icon: '🎯',
      background: '用户需要快速生成专业PPT，但不同AI工具需要不同的技能包，维护成本高。',
      goal: '打造一个跨Agent的PPT生成技能包，支持多种AI编程助手，实现一包多用的设计理念。',
      status: 'completed',
      ...PROJECT_STATUS_INFO['completed'],
      result: '支持 Codex、Claude Code、OpenClaw、Hermes 四种Agent，提供可编辑PPTX和杂志风HTML两种输出模式。融合两个开源项目，保留MIT许可。',
      tags: ['PPT', 'AI Agent', '开源'],
      updatedAt: '2026-04-26',
      github: 'https://github.com/openclaw/ultimate-ppt-master-skill',
      relatedDiaries: diaries
        .filter(d => d.title.includes('PPT') || d.title.includes('ultimate-ppt'))
        .slice(0, 2)
        .map(d => d.slug),
      relatedNotes: []
    },
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
      updatedAt: '2026-04-23',
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
      background: 'AI 助手需要长期记忆能力，原方案过于简单。三个锤子在共享记忆库中容易混淆身份边界。',
      goal: '构建分层记忆体系，锚定大锤主身份，三锤各自建独立记忆库，共享库仅作档案馆。',
      status: 'completed',
      ...PROJECT_STATUS_INFO['completed'],
      result: '大锤主记忆库完成身份锚定。按 people/projects/automations/rituals/decisions/lessons 六维分类。支持跨会话记忆恢复、FTS5全文搜索、GitHub异地备份。',
      tags: ['记忆系统', 'AI', '架构', 'GitHub'],
      updatedAt: '2026-05-10',
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
      id: 'wedding-v2.0.14',
      title: '甜囍手册 v2.0.14 上线',
      description: '路书地图页重构、天气云函数增强对接和风天气、相册管理UI大改支持批量操作，7个云函数全量部署。主包1.78MB+分包280KB。',
      tags: ['微信小程序', 'uni-app', '云开发'],
      date: '2026-05-19',
      relatedProjectId: 'wedding-navigator'
    },
    {
      id: 'hermes-upgrade-v0.14.0',
      title: 'Hermes 大版本升级 v0.14.0',
      description: '从 v0.13.0 跨 396 个 commit 升级到 v0.14.0，核心对话引擎拆分为模块化架构（conversation_loop / agent_init / tool_executor）。',
      tags: ['Hermes', '升级', '架构'],
      date: '2026-05-19',
      relatedProjectId: 'hermes-feishu-integration'
    },
    {
      id: 'weread-api-connected',
      title: '微信读书 Agent API 接入',
      description: '成功接入微信读书 Agent API，实时查询249本书架，支持阅读进度、分类、笔记管理。',
      tags: ['微信读书', 'API', '集成'],
      date: '2026-05-17',
      relatedProjectId: 'weread-agent'
    },
    {
      id: 'desktop-organize-evolution',
      title: '桌面自动整理进化：从手动到智能路由',
      description: 'Cron 从简单归档升级为17个关键词自动路由 + iCloud锁处理 + 重名冲突解决。5月13日一次性归档40个积压文件。',
      tags: ['自动化', 'macOS', '文件管理'],
      date: '2026-05-13',
      relatedProjectId: 'desktop-auto-organize'
    },
    {
      id: 'ppt-skill-cross-agent',
      title: '跨Agent PPT技能包上线',
      description: '发布 ultimate-ppt-master-skill，支持 Codex、Claude Code、OpenClaw、Hermes 四种Agent，提供PPTX和HTML两种输出模式。',
      tags: ['PPT', 'AI Agent', '开源'],
      date: '2026-04-26',
      relatedProjectId: 'ultimate-ppt-master-skill'
    },
    {
      id: 'blog-share-buttons',
      title: '博客分享功能上线',
      description: '添加微博、微信一键分享按钮，支持访客将博客内容快速分享到社交平台，提升内容传播便利性。',
      tags: ['建站', '功能', '社交'],
      date: '2026-04-23',
      relatedProjectId: 'blog-refactor'
    },
    {
      id: 'hero-button-style',
      title: '首页 Hero 按钮优化',
      description: '首页引导按钮升级为黑金风格，金色描边 + 悬浮动效，与整体设计语言统一，提升视觉质感。',
      tags: ['建站', 'UI', '设计'],
      date: '2026-04-23',
      relatedProjectId: 'blog-refactor'
    },
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
      date: '2026-05-19',
      changes: [
        '甜囍手册 v2.0.14 上线：路书地图、天气云函数、相册管理',
        'Hermes v0.14.0 大版本升级完成'
      ],
      relatedType: 'project'
    },
    {
      date: '2026-05-17',
      changes: [
        '微信读书 Agent API 成功接入，249本书架可查询',
        'Hermes 修复升级至稳定版'
      ],
      relatedType: 'project'
    },
    {
      date: '2026-05-13',
      changes: [
        '桌面自动归档系统完成进化，40个积压文件一次性归档',
        'Cron 增加17个关键词自动路由'
      ],
      relatedType: 'project'
    },
    {
      date: '2026-05-10',
      changes: [
        'Hermes 飞书深度集成完成：卡片交互、代理、排版修复',
        '三锤记忆系统身份锚定完成，记忆库重组'
      ],
      relatedType: 'project'
    },
    {
      date: '2026-04-26',
      changes: [
        '跨Agent PPT技能包正式上线',
        '支持四种Agent、两种输出模式'
      ],
      relatedType: 'project'
    },
    {
      date: '2026-04-23',
      changes: [
        '博客分享功能上线（微博/微信）',
        '首页 Hero 按钮黑金风格优化'
      ],
      relatedType: 'case'
    },
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
