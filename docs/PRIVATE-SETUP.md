# 🔒 私人空间 — 设置指南

## 部署步骤

### 1. 在 Vercel 中设置环境变量

进入 Vercel 项目 → Settings → Environment Variables，添加以下两个变量：

```
PRIVATE_ACCESS_KEY  →  你的访问密码（自行设置，建议 32 位以上随机字符串）
PRIVATE_AUTH_SECRET →  JWT 签名密钥（另行生成，与密码不同）
```

**重要**：两个值必须不同。`PRIVATE_ACCESS_KEY` 是你登录时输入的密码。
`PRIVATE_AUTH_SECRET` 是 JWT 签名用的密钥，永远不需要记忆。

### 2. 重新部署

设置环境变量后，在 Vercel 中重新部署（Redeploy），让新变量生效。

### 3. 访问私人空间

部署完成后，访问 `https://kdnsna.cn/private`，输入你设置的密码即可进入。

---

## 安全特性

- **密码**：存在服务端环境变量，客户端永远不可见
- **Token**：JWT 签名，httpOnly cookie，XSS 无法窃取
- **限速**：同一 IP 输错 5 次，锁定 15 分钟
- **隔离**：`/private/*` 路由受 middleware 保护，未登录自动重定向到登录页

## 添加内容

### 私人日记

在 `src/content/private-diary/` 下创建 `.mdx` 文件，frontmatter 格式与公开日记相同：

```mdx
---
title: "日记标题"
date: "2026-05-20"
excerpt: "一句话摘要"
tags: ["工作", "日记"]
---

## 正文
...
```

### 私人笔记

在 `src/lib/private-notes.ts` 中添加数据，格式与 `src/lib/notes.ts` 相同。

### 私人项目

在 `src/lib/private-projects.ts` 中添加数据，格式与 `src/lib/achievement.ts` 相同。

---

## 密码忘了怎么办

在 Vercel 中修改 `PRIVATE_ACCESS_KEY` 环境变量，重新部署即可。旧 token 会自动失效。
