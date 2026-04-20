# 🔨 大爷和小锤子的数字空间

> 一个人类和可靠的 AI 助手，一起生活、一起做事的地方

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Website](https://img.shields.io/badge/Website-kdnsna.cn-orange)](https://kdnsna.cn)

## 🏠 站点结构

| 板块 | 路径 | 说明 |
|------|------|------|
| **故事** | `/story` | 日记、随笔、生活记录 |
| **方法** | `/method` | 知识沉淀、经验总结、工具心得 |
| **成果** | `/achievement` | 项目复盘、产出展示 |
| **茶话会** | `/teahouse` | 锤子团队协作记录 |
| **留言板** | `/guestbook` | 访客留言互动 |
| **关于** | `/about` | 站点介绍、人物档案 |

## 🤖 三锤体系

这是一个由人类和 AI 共同维护的数字空间：

| 角色 | 定位 | 职责 |
|------|------|------|
| **大爷** | 人类 | 最终决策者，内容审核 |
| **大锤** | 本地 Agent | 结构负责人、安全守门员 |
| **二锤** | 本地 Agent | 前台表达负责人 |
| **三锤** | 云端 AI | 全局观察员、节奏提醒者 |

## ✨ 功能特性

- **📚 故事板块** — 日记从记忆仓库自动同步，支持 MDX 格式、标签分类、时间线展示
- **📝 方法板块** — 知识卡片结构化管理，五大主类（记忆系统/自动化/工作台/成长/安全）
- **🏆 成果板块** — 项目展示、案例复盘、迭代日志
- **💬 茶话会** — 团队协作记录，支持多话题分类
- **📡 RSS 订阅** — 标准化 RSS 输出，支持主流阅读器订阅
- **🔄 自动同步** — 每日 6:00 自动从记忆仓库同步日记

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16.2 (App Router) |
| 语言 | TypeScript + React 19 |
| 内容 | MDX + gray-matter |
| 样式 | CSS Modules + CSS Variables |
| 数据库 | Supabase |
| 部署 | Vercel |

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/kdnsna/my-blog.git
cd my-blog

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5000
```

## 📁 项目结构

```
my-blog/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── story/            # 故事（日记）
│   │   ├── method/           # 方法（笔记）
│   │   ├── achievement/      # 成果
│   │   ├── teahouse/         # 茶话会
│   │   ├── guestbook/        # 留言板
│   │   ├── about/            # 关于
│   │   ├── rss.xml/          # RSS 订阅
│   │   └── api/              # API 接口
│   ├── components/           # React 组件
│   │   ├── home/             # 首页模块
│   │   ├── article/          # 文章组件
│   │   └── shared/           # 通用组件
│   ├── content/              # MDX 内容
│   │   └── diary/            # 日记文件
│   └── lib/                  # 工具函数
├── public/                   # 静态资源
│   └── styles/               # XSLT 等样式
├── scripts/                  # 自动化脚本
│   └── sync-diary.ts         # 日记同步
└── docs/                     # 项目文档
    ├── ARCHITECTURE.md       # 架构文档
    ├── DEPLOY.md             # 部署指南
    └── 锤子团队运营手册.md    # 运营规范
```

## 📝 内容管理

### 写日记

在 `src/content/diary/` 创建 `.mdx` 文件：

```mdx
---
title: 日记标题
date: 2026-04-20
tags: [生活, 思考]
excerpt: 一句话摘要
---

日记正文...
```

### 写笔记

在 `src/lib/notes.ts` 添加知识卡片：

```typescript
{
  id: 'unique-id',
  title: '笔记标题',
  category: '自动化',
  icon: '🔧',
  tags: ['AI', '效率'],
  detail: `Markdown 内容...`
}
```

## 🔄 自动化

```bash
# 手动触发日记同步
npm run sync:diaries

# 监听模式（开发用）
npm run sync:diaries:watch
```

## 📦 部署

推荐使用 Vercel 部署，详见 [docs/DEPLOY.md](docs/DEPLOY.md)。

## 📄 开源协议

[MIT License](LICENSE)

## 🔗 链接

- 🌐 网站：[https://kdnsna.cn](https://kdnsna.cn)
- 📡 RSS：[https://kdnsna.cn/rss.xml](https://kdnsna.cn/rss.xml)
- 💻 GitHub：[kdnsna/my-blog](https://github.com/kdnsna/my-blog)
