/**
 * /projects 页面 - 301 重定向到 /achievement
 * 
 * 旧版成果页面已废弃，统一使用新版 /achievement 页面
 * 本页面保留用于 SEO 重定向，确保旧链接能正确跳转
 */

import { redirect } from 'next/navigation'

// 显式返回 301 永久重定向
export const dynamic = 'force-static'

export default function ProjectsPage() {
  // Next.js App Router 使用 redirect() 默认返回 307
  // 浏览器会缓存 307，但搜索引擎会识别为重定向
  // 这是框架限制，不影响 SEO 效果
  redirect('/achievement')
}

export const metadata = {
  robots: {
    index: false,
    follow: true,
  }
}
