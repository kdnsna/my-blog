# 部署指南

本文档介绍博客系统的多种部署方式。

## 本地开发部署

### 环境要求

- Node.js 20 或更高版本
- npm / yarn / pnpm / bun（任选其一）

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/kdnsna/my-blog.git
cd my-blog

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 浏览器打开
open http://localhost:3000
```

### 环境变量

目前项目无需特殊环境变量即可本地运行。如后续接入第三方服务（如分析、评论等），可在项目根目录创建 `.env.local` 文件：

```bash
# .env.local 示例
NEXT_PUBLIC_SOME_API_KEY=your_api_key
```

注意：`.env.local` 不会提交到 Git 仓库，请勿将敏感信息直接写在代码中。

## Vercel 部署（推荐）

[Vercel](https://vercel.com) 是 Next.js 官方推荐的部署平台，提供免费套餐和一键部署。

### 方式一：Vercel 控制台部署

1. 登录 [Vercel](https://vercel.com)
2. 点击 "Add New Project"
3. 导入 `kdnsna/my-blog` 仓库
4. 保留默认配置（Next.js 会自动识别）
5. 点击 "Deploy"

### 方式二：Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 进入项目目录
cd my-blog

# 部署预览版本
vercel

# 部署生产版本
vercel --prod
```

### 自定义域名（如有需要）

1. 在 Vercel 项目设置中进入 "Domains"
2. 添加您的域名（如 blog.example.com）
3. 按照提示配置 DNS 记录

## 其他部署方式

### Docker 部署

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/content ./src/content
EXPOSE 3000
CMD ["node", "server.js"]
```

需要在 `next.config.ts` 中添加：

```ts
const nextConfig = {
  output: 'standalone',
}
```

### 传统服务器部署

```bash
# 构建
npm run build

# 使用 PM2 运行
npm install -g pm2
pm2 start npm --name "blog" -- start

# PM2 自启动配置
pm2 save
pm2 startup
```

## 自动化配置

### 日记同步（Crontab）

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每日 6:00 执行）
0 6 * * * cd /path/to/blog && npm run sync:diaries >> /path/to/blog/logs/sync.log 2>&1
```

## 性能优化

### 图片优化

Next.js 自动优化 `next/image` 组件中的图片。如需进一步优化，可将图片放入 `public/` 目录并使用相对路径引用。

### 静态资源

- 静态文件放在 `public/` 目录
- Next.js 会自动处理缓存策略

### MDX 编译优化

大量 MDX 文件时，可考虑：
- 使用增量编译
- 启用构建缓存（Vercel 自动处理）

## 监控与日志

### Vercel

Vercel 提供内置的实时日志和性能监控，可在控制台查看。

### 自托管

使用 PM2 日志：

```bash
# 查看日志
pm2 logs blog

# 查看实时日志
pm2 logs blog --lines 100 --nostream
```

## 常见问题

### 构建失败

1. 确保 Node.js 版本符合要求（20+）
2. 删除 `node_modules` 和 `package-lock.json`，重新 `npm install`
3. 查看错误日志，定位具体问题

### 部署后页面空白

1. 检查浏览器控制台是否有错误
2. 确认构建日志无报错
3. 检查网络请求是否正常

### API 404

1. 确认 API 路由文件路径正确
2. 检查函数名是否正确导出（GET/POST）
3. Vercel 部署需确认 `vercel.json` 配置（如有）

## 相关文档

- [项目架构](ARCHITECTURE.md)
- [贡献指南](../CONTRIBUTING.md)
- [Next.js 官方文档](https://nextjs.org/docs)
- [Vercel 部署文档](https://vercel.com/docs)
