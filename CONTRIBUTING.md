# 贡献指南

感谢您对本项目的兴趣！欢迎提交 Issue 和 Pull Request。

## 如何参与

### 报告问题

如果您发现了 Bug 或有功能建议，请先查看 [Issue 列表](https://github.com/kdnsna/my-blog/issues)，确认该问题尚未被报告后再创建新 Issue。

推荐使用我们提供的模板：
- [Bug 报告模板](.github/ISSUE_TEMPLATE/bug_report.yml)
- [功能请求模板](.github/ISSUE_TEMPLATE/feature_request.yml)

### 提交代码

1. **Fork 本仓库** 并克隆到本地
2. **创建功能分支**：`git checkout -b feature/your-feature-name`
3. **安装依赖**：`npm install`
4. **开发调试**：确保 `npm run dev` 正常运行
5. **编写代码**，保持风格一致
6. **提交更改**：`git commit -m 'feat: 添加新功能'`
7. **推送分支**：`git push origin feature/your-feature-name`
8. **创建 Pull Request**，使用 [PR 模板](.github/PULL_REQUEST_TEMPLATE.md)

## 代码规范

### 格式化

项目使用 ESLint + TypeScript，请确保代码通过检查：

```bash
npm run lint
```

### 提交信息规范

采用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <subject>

feat(diary): 添加日记标签筛选功能
fix(api): 修复日记列表分页错误
docs: 更新部署指南
style: 调整首页样式间距
refactor: 重构日记卡片组件
test: 添加日记渲染测试
```

type 类型说明：

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响运行） |
| `refactor` | 重构（不影响功能） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具变更 |

## 组件开发

新增组件时请遵循以下规范：

- 使用 **函数组件** + **TypeScript**
- 样式使用 **CSS Modules**（`ComponentName.module.css`）
- 组件文件放在 `src/components/` 目录
- 组件需有清晰的分层注释

## MDX 内容规范

### Frontmatter 格式

```mdx
---
title: 文章标题
date: YYYY-MM-DD
tags: [标签1, 标签2]
---
```

### 文件命名

- 日记：`YYYY-MM-DD-title.mdx`
- 笔记：`slugified-title.mdx`

## 问题解答

如有疑问，欢迎通过 GitHub Issues 交流。
