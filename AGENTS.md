<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 运营手册 - 小锤子博客系统

## 项目概览

基于 Next.js 16 + React 19 的个人博客系统，记录大爷与 AI 助手小锤子的协作过程与知识沉淀。

### 技术栈
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- MDX (用于日记)
- Supabase (用于留言板/茶话会)

---

## 路由结构

### 当前路由（新结构）

| 路由 | 说明 | 组件 |
|-----|------|------|
| `/` | 首页 | `src/app/page.tsx` |
| `/story` | 故事（日记列表） | `src/app/story/page.tsx` |
| `/story/[slug]` | 日记详情 | `src/app/diary/[slug]/page.tsx` |
| `/method` | 方法（知识库） | `src/app/method/page.tsx` |
| `/method/[id]` | 方法详情 | `src/app/notes/[id]/page.tsx` |
| `/achievement` | 成果 | `src/app/achievement/page.tsx` |
| `/about` | 关于页 | `src/app/about/page.tsx` |
| `/guestbook` | 留言板 | `src/app/guestbook/` |
| `/teahouse` | 茶话会 | `src/app/teahouse/` |

### 旧路由重定向（301）

| 旧路由 | 目标 | 说明 |
|-------|------|------|
| `/diary` | `/story` | 日记列表 |
| `/diary/[slug]` | `/story/[slug]` | 日记详情 |
| `/notes` | `/method` | 知识库 |
| `/notes/[id]` | `/method/[id]` | 方法详情（保留） |
| `/projects` | `/achievement` | 成果页 |

配置位置：`next.config.ts` 的 `redirects()` 函数

---

## 分类体系

### 方法页分类（5个主类）

| 主类 | 图标 | 说明 | 文章来源 |
|-----|------|------|---------|
| 记忆系统 | 🧠 | AI 的核心资产 | 原"记忆系统" |
| 自动化 | ⚡ | 让系统自动运转 | 原"自动化"+"备份" |
| 工作台 | 🍎 | 本地能力集成 | 原"苹果生态"+"项目" |
| 成长 | 📈 | 学习与自我复盘 | 原"学习"+"日记" |
| 安全 | 🔒 | 系统健康守护 | 原"安全" |

配置位置：`src/lib/method.ts` 的 `CATEGORY_CONFIG`

### 成果页状态枚举

```typescript
type ProjectStatus = 'active' | 'completed' | 'stopped' | 'archived'
```

配置位置：`src/lib/types.ts`

---

## 组件规范

### 详情页标题区结构

统一使用 `ArticleHeader` 组件，视觉层级：

```
┌─────────────────────────────────────────────┐
│  📔 日记 / 🧭 方法 / 🏆 成果（类型标识）     │
├─────────────────────────────────────────────┤
│  标题（h1，唯一）                            │
├─────────────────────────────────────────────┤
│  💬 摘要引用（diary 特有）                   │
├─────────────────────────────────────────────┤
│  日期 · 3分钟 · 小锤子 · 分类标签（元信息行） │
├─────────────────────────────────────────────┤
│  [标签1] [标签2] [标签3]（Tag 组件）        │
├─────────────────────────────────────────────┤
│  📚 系列名 · 第 8 篇 / 共 12 篇（可选）      │
└─────────────────────────────────────────────┘
```

### Tag 组件使用规范

使用 `src/components/ui/Tag.tsx`，禁止以 `#tag1#tag2` 纯文本形式展示标签。

```tsx
import Tag from '@/components/ui/Tag'

// 基础用法
<Tag>标签名</Tag>

// 带颜色
<Tag color="#4A90D9">分类</Tag>

// 可点击
<Tag onClick={() => handleClick(tag)}>标签</Tag>
```

---

## 装饰元素使用规范

### 允许使用场景

| 场景 | 允许 | 示例 |
|-----|------|------|
| Hero 区域标题旁 | ✅ | `🧭` 方法、`🏆` 成果 |
| 品牌/角色标识 | ✅ | `🔨` 小锤子、三锤角色 |
| 功能性图标（导航/操作） | ✅ | ActionButton `📖` 看故事 |
| 卡片/项目标识 | ✅ | PortalCard `🏆` 成果 |

### 禁止使用场景

| 场景 | 禁止 | 原因 |
|-----|------|------|
| SectionHeader | ❌ | 标题已足够清晰 |
| 段落间装饰 | ❌ | 破坏阅读节奏 |
| 句子开头/结尾 | ❌ | 无信息量 |
| slogan 边界 | ❌ | 孤立符号无意义 |

---

## 开发规范

### 命令

```bash
pnpm dev          # 开发环境（端口 5000）
pnpm build        # 构建生产版本
pnpm lint         # ESLint 检查
pnpm ts-check     # TypeScript 类型检查
```

### 环境变量

| 变量 | 说明 |
|-----|------|
| `NEXT_PUBLIC_SITE_URL` | 站点 URL（用于 SEO） |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 |

### 静态检查

修改代码后必须执行：
1. `pnpm lint` - ESLint 检查
2. `npx tsc --noEmit` - TypeScript 编译检查

---

## 常见问题

### 日记详情页重复标题

日记 MDX 文件可能包含与 frontmatter `title` 相同的 h1。系统自动过滤：
- 位置：`src/app/diary/[slug]/page.tsx` 的 `removeDuplicateTitle()` 函数
- 原理：渲染时自动识别并移除与标题相同的 h1

### RSS 订阅入口

当前已注释，TODO 待实现。如需启用：
1. 安装 `rss` 库
2. 创建 `/app/feed.xml/route.ts`
3. 取消注释 `src/lib/home.ts` 中的 RSS 配置

---

## 文件索引

### 核心数据层

| 文件 | 说明 |
|-----|------|
| `src/lib/notes.ts` | 笔记数据（方法页内容） |
| `src/lib/method.ts` | 方法页数据处理、分类配置 |
| `src/lib/achievement.ts` | 成果页数据、状态映射 |
| `src/lib/diary.ts` | 日记数据加载 |
| `src/lib/home.ts` | 首页数据配置 |

### 核心组件

| 文件 | 说明 |
|-----|------|
| `src/components/article/ArticleHeader.tsx` | 详情页标题区（统一） |
| `src/components/ui/Tag.tsx` | 标签组件 |
| `src/components/home/*` | 首页模块组件 |
| `src/components/method/MethodContent.tsx` | 方法页内容区 |
| `src/components/achievement/AchievementContent.tsx` | 成果页内容区 |

### 样式文件

- `src/app/*/page.module.css` - 页面级样式
- `src/components/*/*.module.css` - 组件级样式
- `src/app/globals.css` - 全局样式、变量定义

---

## 更新日志

### 2026-04-20 第二轮改版

- [x] 成果体系归一（状态枚举统一、301重定向）
- [x] 占位态清理（骨架屏、加载动画）
- [x] 关于页收口（优化导航、增强可访问性）
- [x] 互动页体验优化（留言板、茶话会首屏）
- [x] 方法页分类收束（8→5个主类）
- [x] 详情页标题区统一（Tag组件、去除重复标题）
- [x] 旧路由兼容（301重定向）
- [x] 全站视觉降噪（移除无意义装饰）
