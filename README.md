# Personal Blog

基于 Next.js + MDX 的个人博客系统，支持日记、笔记、关于页面三大核心模块，具备定时日记同步自动化能力。

## 功能特性

- **首页** — Hero 展示 + 状态统计卡片 + 标签云 + 最新日记动态
- **日记模块** — 从记忆仓库自动同步，支持 MDX 格式渲染，支持标签分类
- **笔记模块** — 知识沉淀与归档，结构化管理
- **关于页面** — 个人介绍与项目背景
- **API 层** — 服务端接口支撑动态内容加载
- **自动化同步** — 每日 6:00 自动从记忆仓库同步日记到博客（crontab）

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16.2.2（App Router） |
| 内容 | MDX + @next/mdx |
| 语言 | TypeScript + React 19.2.4 |
| 样式 | CSS Modules + 全局样式 |
| 工具 | gray-matter、next/font |

## 快速开始

### 环境要求

- Node.js 20+
- npm / yarn / pnpm / bun

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/kdnsna/my-blog.git
cd my-blog

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器
open http://localhost:3000
```

### 构建与部署

```bash
# 构建生产版本
npm run build

# 本地预览生产版本
npm run start
```

## 项目结构

```
blog/
├── public/                  # 静态资源（图片、字体等）
├── scripts/                 # 自动化脚本
│   └── sync-diary.ts       # 日记同步脚本
├── src/
│   ├── app/                # Next.js App Router 页面
│   │   ├── about/          # 关于页面
│   │   ├── api/            # API 接口
│   │   ├── diary/          # 日记列表页
│   │   ├── notes/          # 笔记列表页
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # React 组件
│   │   ├── HeroSection.tsx # Hero 区域
│   │   ├── TagCloud.tsx    # 标签云
│   │   ├── DiaryCard.tsx   # 日记卡片
│   │   └── ...             # 其他组件
│   ├── content/            # MDX 内容文件
│   │   ├── diary/          # 日记内容
│   │   └── notes/          # 笔记内容
│   └── lib/                # 工具函数
├── docs/                   # 项目文档
│   ├── ARCHITECTURE.md     # 架构文档
│   └── DEPLOY.md           # 部署指南
├── mdx-components.tsx      # MDX 组件配置
├── next.config.ts          # Next.js 配置
└── package.json
```

## 内容管理

### 写日记

在 `src/content/diary/` 目录下创建 `.mdx` 文件：

```mdx
---
title: 我的日记标题
date: 2026-04-07
tags: [工作, 生活]
---

日记正文内容...
```

### 写笔记

在 `src/content/notes/` 目录下创建 `.mdx` 文件：

```mdx
---
title: 笔记标题
date: 2026-04-07
tags: [技术, 前端]
---

笔记正文内容...
```

## 自动化

日记同步脚本每天 6:00 自动执行，从记忆仓库读取日记并同步到博客：

```bash
# 手动触发同步
npm run sync:diaries
```

## 部署

推荐使用 Vercel 部署（Next.js 官方支持），详细指南请参阅 [docs/DEPLOY.md](docs/DEPLOY.md)。

## 开源协议

本项目基于 [MIT License](LICENSE) 开源。

## 联系方式

- GitHub: [kdnsna/my-blog](https://github.com/kdnsna/my-blog)
