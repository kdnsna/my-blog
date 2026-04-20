# 项目架构文档

本文档介绍博客系统的整体架构设计和核心模块说明。

## 三锤体系

博客的核心运作模式采用「三锤体系」：

| 角色 | 职责 | 说明 |
|------|------|------|
| **大锤** | 提需求、做决策、最终拍板 | 大爷，博客主人 |
| **中锤** | 小锤子的 AI 助手，帮大锤提需求、分析方案、检查代码 | AI 助手的中层管理 |
| **小锤子** | AI 编程助手，执行具体开发任务 | 主要的执行者 |

## 技术架构

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                             │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/HTTPS
┌───────────────────────▼─────────────────────────────────────┐
│                     Next.js 服务端                           │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │ App Router │  │  API 层     │  │   MDX 编译引擎      │   │
│  │ (页面路由)  │  │ (接口服务)  │  │   (@next/mdx)       │   │
│  └─────┬──────┘  └─────┬──────┘  └──────────┬──────────┘   │
│        │               │                      │              │
│        └───────────────┼──────────────────────┘              │
│                        │                                      │
│        ┌───────────────▼───────────────┐                    │
│        │         数据层                  │                    │
│        │  ┌─────────────┐ ┌──────────┐ │                    │
│        │  │ MDX 文件系统 │ │gray-matter│ │                    │
│        │  │src/content/ │ │ Frontmatter│ │                    │
│        │  └─────────────┘ └──────────┘ │                    │
│        │                                │                    │
│        │  ┌────────────────────────────┐ │                    │
│        │  │   Supabase (留言板)        │ │                    │
│        │  └────────────────────────────┘ │                    │
│        └────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### 路由结构

| 路径 | 功能 | 数据源 |
|------|------|--------|
| `/` | 首页 | 静态 + API |
| `/story` | 故事页 | MDX diary/ |
| `/method` | 方法页 | MDX notes/ |
| `/achievement` | 成果页 | 静态数据 |
| `/about` | 关于页 | 静态数据 |
| `/teahouse` | 茶话会 | MDX |
| `/guestbook` | 留言板 | Supabase |
| `/diary/:slug` | 日记详情 | MDX |
| `/rss.xml` | RSS 订阅 | MDX + notes |

## 目录结构

```
my-blog/
├── public/                          # 静态资源
│   ├── styles/rss.xslt             # RSS XSLT 样式
│   └── favicon.ico
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── page.tsx                 # 首页
│   │   ├── layout.tsx               # 根布局
│   │   ├── story/                   # 故事页
│   │   │   ├── page.tsx             # Server Component
│   │   │   └── StoryContent.tsx     # Client Component
│   │   ├── method/                  # 方法页
│   │   │   ├── page.tsx
│   │   │   └── MethodContent.tsx
│   │   ├── achievement/              # 成果页
│   │   │   ├── page.tsx
│   │   │   └── AchievementContent.tsx
│   │   ├── diary/                   # 日记详情
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── about/                   # 关于页
│   │   ├── teahouse/                # 茶话会
│   │   ├── guestbook/               # 留言板 (Supabase)
│   │   ├── rss.xml/route.ts         # RSS 订阅源
│   │   └── api/                      # API 路由
│   │       └── rss/route.ts
│   │
│   ├── components/                   # React 组件库
│   │   ├── article/                  # 文章通用组件
│   │   │   ├── ArticleHeader.tsx
│   │   │   ├── ArticleFooter.tsx
│   │   │   └── ArticleContent.tsx
│   │   ├── achievement/              # 成果页组件
│   │   ├── method/                   # 方法页组件
│   │   ├── story/                    # 故事页组件
│   │   ├── layout/                   # 布局组件
│   │   ├── shared/                   # 通用组件
│   │   │   ├── SectionHeader.tsx
│   │   │   └── Tag.tsx
│   │   ├── NavBar.tsx                # 导航栏
│   │   ├── Footer.tsx                # 页脚
│   │   └── Breadcrumb.tsx            # 面包屑导航
│   │
│   ├── content/                      # MDX 内容
│   │   ├── diary/                    # 日记 (YYYY-MM-DD.mdx)
│   │   └── notes/                    # 笔记
│   │
│   └── lib/                          # 工具函数
│       ├── diary.ts                  # 日记读取
│       ├── method.ts                 # 方法页数据
│       ├── achievement.ts            # 成果页数据
│       ├── story.ts                  # 故事页数据
│       ├── types.ts                  # 类型定义
│       └── sensitive-mask.ts         # 敏感信息掩码
│
├── docs/                             # 项目文档
│   ├── ARCHITECTURE.md               # 本文档
│   ├── DEPLOY.md                    # 部署指南
│   └── 锤子团队运营手册.md            # 运营手册
│
├── scripts/                          # 自动化脚本
│   └── sync-diary.ts                # 日记同步脚本
│
├── next.config.ts                   # Next.js 配置
├── mdx-components.tsx               # MDX 组件配置
└── package.json
```

## 核心模块详解

### 1. 首页 (/)

**功能**
- Hero 区域展示站点介绍
- 统计卡片（故事数、方法数、成果数）
- 快捷导航入口
- 最新日记预览

**组件**
- `HeroSection` - 顶部 Hero 区域
- `StatsCard` - 统计数据卡片
- `QuickNav` - 快捷导航
- `RecentDiary` - 最新日记列表

### 2. 故事页 (/story)

**功能**
- 连载系列展示（博客重构、记忆系统等）
- 按时间线浏览日记
- 标签筛选
- 月份折叠/展开

**数据**
- 从 `src/content/diary/*.mdx` 读取
- 按年月分组，支持标签筛选

### 3. 方法页 (/method)

**分类体系**

| 分类 | 说明 |
|------|------|
| 记忆系统 | 记忆设计、存储、检索相关方法 |
| 自动化 | 流程自动化、脚本工具 |
| 工作台 | 工作流工具、环境配置 |
| 成长 | 学习心得、技能提升 |
| 安全 | 安全实践、隐私保护 |

### 4. 成果页 (/achievement)

**内容**
- 项目展示卡片
- 里程碑时间线
- 博客更新日志 (Changelog)

### 5. 留言板 (/guestbook)

**技术实现**
- Supabase 实时数据库
- 客户端组件处理交互
- 敏感词过滤

### 6. RSS 订阅 (/rss.xml)

**内容**
- 最新 20 篇日记
- 最新 10 篇笔记
- XSLT 样式美化展示

## 数据流

### 日记读取流程

```
用户访问 /diary/:slug
        ↓
page.tsx (Server Component)
        ↓
getDiaryBySlug(slug)
        ↓
lib/diary.ts
  ├─ fs.readdirSync(DIARY_DIR)
  ├─ gray-matter 解析 frontmatter
  └─ 返回 DiaryEntry
        ↓
ArticleHeader + ArticleContent 渲染
```

### 留言板数据流

```
用户提交留言
        ↓
Client Component (Guestbook.tsx)
        ↓
Supabase Client → insert()
        ↓
实时更新留言列表
```

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `NEXT_PUBLIC_SITE_URL` | 站点 URL | `https://kdnsna.cn` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJ...` |

## 开发规范

### 组件规范

1. **Server vs Client**
   - 静态页面：Server Component (默认)
   - 交互逻辑：Client Component (`'use client'`)

2. **样式规范**
   - 使用 CSS Modules 隔离样式
   - 组件样式文件：`ComponentName.module.css`

3. **命名规范**
   - 组件：`PascalCase.tsx`
   - 工具函数：`camelCase.ts`
   - 页面：`page.tsx`

### API 规范

- 统一放在 `src/app/api/` 目录
- 使用 Next.js App Router 路由
- 返回 JSON 格式数据

### MDX 内容规范

**日记 Frontmatter**

```yaml
---
title: 日记标题
date: 2026-04-20
tags: [标签1, 标签2]
excerpt: 简短摘要
---
```

**笔记 Frontmatter**

```yaml
---
title: 笔记标题
date: 2026-04-20
tags: [分类]
description: 描述
---
```

## 部署

推荐使用 Vercel 部署，详见 [DEPLOY.md](DEPLOY.md)。

部署后需配置环境变量：
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
