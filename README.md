# 小锤子 & 大爷的数字空间

> 一个人类和他可靠的 AI 助手，一起生活、一起做事的地方。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)

[在线预览](https://kdnsna.cn) | [RSS 订阅](https://kdnsna.cn/rss.xml)

---

## 关于这个项目

这是一个记录 **大爷** 与 **AI 助手小锤子** 协作过程与知识沉淀的个人博客系统。

三锤体系是这个博客的核心运作模式：

| 角色 | 职责 |
|------|------|
| **大锤** | 提需求、做决策、最终拍板 |
| **中锤** | 小锤子的 AI 助手，帮大锤提需求、分析方案、检查代码 |
| **小锤子** | AI 编程助手，执行具体开发任务 |

## 站点结构

```
├── /           首页 - 概览统计与快速入口
├── /story      故事 - 记录协作过程中的点点滴滴
├── /method     方法 - 知识沉淀与方法论归档
├── /achievement 成果 - 项目作品与成长记录
├── /about      关于 - 大爷与小锤子介绍
├── /teahouse   茶话会 - 轻松闲聊区域
├── /guestbook  留言板 - 访客留言互动
└── /rss.xml    RSS 订阅源
```

### 核心模块

- **故事 (Story)** - 日记形式的协作记录，按时间线组织，支持标签筛选和连载系列
- **方法 (Method)** - 五类知识归档：记忆系统、自动化、工作台、成长、安全
- **成果 (Achievement)** - 项目展示、里程碑记录、博客更新日志
- **茶话会 (Teahouse)** - 轻松的闲聊区域，记录灵感碎片
- **留言板 (Guestbook)** - 基于 Supabase 的实时留言互动

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16.2.2 (App Router) |
| 语言 | TypeScript 5 + React 19.2.4 |
| 内容 | MDX + @next/mdx |
| 样式 | CSS Modules + Tailwind CSS 4 |
| 数据库 | Supabase (留言板) |
| 字体 | next/font (Noto Sans/Serif SC + JetBrains Mono) |
| 部署 | Vercel |

## 快速开始

### 环境要求

- Node.js 20+
- pnpm (推荐) / npm / yarn

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/kdnsna/my-blog.git
cd my-blog

# 安装依赖
pnpm install

# 启动开发服务器 (端口 5000)
pnpm dev

# 打开浏览器
open http://localhost:5000
```

### 构建部署

```bash
# 构建生产版本
pnpm build

# 本地预览生产版本
pnpm start
```

## 项目结构

```
my-blog/
├── public/                     # 静态资源
│   ├── styles/rss.xslt        # RSS 订阅页样式
│   └── favicon.ico
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # 首页
│   │   ├── story/             # 故事页
│   │   ├── method/            # 方法页
│   │   ├── achievement/       # 成果页
│   │   ├── about/             # 关于页
│   │   ├── teahouse/          # 茶话会
│   │   ├── guestbook/         # 留言板
│   │   ├── diary/             # 日记详情页
│   │   ├── rss.xml/           # RSS 订阅源
│   │   └── api/                # API 接口
│   │
│   ├── components/             # React 组件
│   │   ├── article/            # 文章通用组件
│   │   ├── achievement/        # 成果页组件
│   │   ├── method/             # 方法页组件
│   │   ├── story/              # 故事页组件
│   │   ├── layout/             # 布局组件
│   │   ├── shared/             # 通用组件
│   │   └── NavBar.tsx          # 导航栏
│   │
│   ├── content/                # MDX 内容
│   │   ├── diary/              # 日记内容 (YYYY-MM-DD.mdx)
│   │   └── notes/              # 笔记内容
│   │
│   └── lib/                     # 工具函数
│       ├── diary.ts             # 日记读取
│       ├── method.ts            # 方法页数据
│       ├── achievement.ts       # 成果页数据
│       └── types.ts             # 类型定义
│
├── docs/                        # 项目文档
│   ├── ARCHITECTURE.md         # 架构文档
│   ├── 锤子团队运营手册.md       # 运营手册
│   └── DEPLOY.md               # 部署指南
│
├── scripts/                     # 自动化脚本
│   └── sync-diary.ts           # 日记同步脚本
│
├── next.config.ts              # Next.js 配置
├── package.json
└── LICENSE                      # MIT 协议
```

## 内容管理

### 添加日记

在 `src/content/diary/` 目录下创建 `.mdx` 文件：

```mdx
---
title: 日记标题
date: 2026-04-20
tags: [建站, 反思]
excerpt: 简短的摘要描述
---

日记正文内容...
```

### 添加笔记

在 `src/content/notes/` 目录下创建 `.mdx` 文件：

```mdx
---
title: 笔记标题
date: 2026-04-20
tags: [技术, 前端]
description: 笔记描述
---

笔记正文内容...
```

## 开发规范

- 使用 ESLint + TypeScript 严格模式
- 组件采用 CSS Modules 样式隔离
- 动态内容使用 `'use client'` 指令
- API 接口统一放在 `src/app/api/` 目录

## 相关文档

- [架构文档](docs/ARCHITECTURE.md) - 详细的技术架构说明
- [部署指南](docs/DEPLOY.md) - Vercel 部署步骤
- [运营手册](docs/锤子团队运营手册.md) - 博客运营规范

## 开源协议

本项目基于 [MIT License](LICENSE) 开源，你可以自由使用、修改和分发。

## 联系方式

- 博客：https://kdnsna.cn
- GitHub：https://github.com/kdnsna/my-blog
- 留言板：https://kdnsna.cn/guestbook
