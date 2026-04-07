# 项目架构文档

本文档介绍博客系统的整体架构设计和核心模块说明。

## 技术架构

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                      用户浏览器                          │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/HTTPS
┌─────────────────────▼───────────────────────────────────┐
│                    Next.js 服务端                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ App Router│  │  API 层   │  │   MDX 编译引擎       │  │
│  │ (页面)    │  │ (接口)   │  │   (@next/mdx)        │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
│       │             │                   │              │
└───────┼─────────────┼───────────────────┼──────────────┘
        │             │                   │
┌───────▼─────────────▼───────────────────┼──────────────┐
│              数据层                       │              │
│  ┌─────────────────┐  ┌─────────────────┐ │              │
│  │   MDX 文件系统   │  │ gray-matter    │ │              │
│  │ src/content/    │  │ (Frontmatter   │ │              │
│  │                 │  │  解析)          │ │              │
│  └─────────────────┘  └─────────────────┘ │              │
│                                        │              │
│  ┌─────────────────────────────────────┘              │
│  │           记忆仓库同步层                             │
│  │  scripts/sync-diary.ts → .workbuddy/memory/       │
│  └───────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────┘
```

## 目录结构详解

```
blog/
├── public/                     # 静态资源目录
│   └── (图片、字体等静态文件)
│
├── scripts/                    # 自动化脚本
│   └── sync-diary.ts          # 日记同步脚本
│       功能：从 .workbuddy/memory/ 读取日记
│       触发：crontab 每日 6:00
│       输出：src/content/diary/*.mdx
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── about/              # 关于页面路由
│   │   ├── api/                # API 路由
│   │   │   └── diary/          # 日记相关接口
│   │   ├── diary/              # 日记模块路由
│   │   ├── notes/              # 笔记模块路由
│   │   ├── globals.css         # 全局样式
│   │   ├── layout.tsx          # 根布局（HTML 结构、字体、全局 Meta）
│   │   └── page.tsx            # 首页
│   │
│   ├── components/             # React 组件库
│   │   ├── HeroSection.tsx     # Hero 区域组件
│   │   ├── TagCloud.tsx        # 标签云组件
│   │   ├── DiaryCard.tsx       # 日记卡片组件（支持动态加载）
│   │   ├── ParticleBg.tsx     # 粒子背景组件
│   │   ├── Typewriter.tsx      # 打字机效果组件
│   │   └── (其他组件)
│   │
│   ├── content/                # MDX 内容目录
│   │   ├── diary/              # 日记内容
│   │   │   └── YYYY-MM-DD-title.mdx
│   │   └── notes/              # 笔记内容
│   │       └── slugified-title.mdx
│   │
│   └── lib/                    # 工具函数库
│       └── (工具函数)
│
├── mdx-components.tsx          # MDX 全局组件配置
├── next.config.ts              # Next.js 配置文件
└── docs/                       # 项目文档
    ├── ARCHITECTURE.md         # 本文档
    └── DEPLOY.md               # 部署指南
```

## 核心模块

### 首页模块

**组件结构**

- `HeroSection` — 大标题区域，包含打字机动画效果
- `TagCloud` — 标签云，展示内容分类
- `DiaryCard` — 日记卡片，通过 API 动态加载最新内容

**数据流**

```
用户访问首页
    ↓
page.tsx 渲染 HeroSection + TagCloud + DiaryCard
    ↓
DiaryCard 调用 /api/diary 获取最新日记列表
    ↓
API 读取 src/content/diary/*.mdx 文件
    ↓
gray-matter 解析 Frontmatter，返回 JSON
    ↓
DiaryCard 渲染日记卡片
```

### 日记模块

**存储格式**

```mdx
---
title: 日记标题
date: 2026-04-07
tags: [工作, 生活]
---

日记正文内容...
```

**同步机制**

```
crontab (每日 6:00)
    ↓
执行 scripts/sync-diary.ts
    ↓
读取 .workbuddy/memory/*.md 日记文件
    ↓
解析内容，生成 MDX 格式
    ↓
写入 src/content/diary/YYYY-MM-DD-title.mdx
```

### 笔记模块

笔记与日记结构相同，存放在 `src/content/notes/` 目录，适合更结构化的知识沉淀。

## 组件规范

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase.tsx | `DiaryCard.tsx` |
| 样式文件 | PascalCase.module.css | `DiaryCard.module.css` |
| 工具函数 | camelCase.ts | `parseDate.ts` |
| API 路由 | route.ts | `app/api/diary/route.ts` |

### 样式规范

使用 CSS Modules 管理组件样式，避免全局污染：

```tsx
// DiaryCard.tsx
import styles from './DiaryCard.module.css'

export default function DiaryCard() {
  return <div className={styles.card}>...</div>
}
```

## 扩展指南

### 添加新页面

1. 在 `src/app/` 下创建新目录
2. 添加 `page.tsx` 作为页面入口
3. 如需布局，在目录中添加 `layout.tsx`

### 添加新 API

1. 在 `src/app/api/` 下创建新目录
2. 添加 `route.ts` 文件
3. 导出 GET/POST 等 HTTP 方法处理函数

### 添加新组件

1. 在 `src/components/` 创建组件文件
2. 同目录创建 `ComponentName.module.css` 样式文件
3. 在需要的地方导入使用

## 相关文档

- [部署指南](DEPLOY.md)
- [贡献指南](../CONTRIBUTING.md)
- [更新日志](../CHANGELOG.md)
