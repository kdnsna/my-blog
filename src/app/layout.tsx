import type { Metadata } from 'next'
import { JetBrains_Mono, Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import AmbientBackground from '@/components/AmbientBackground'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const notoSerif = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '🔨 小锤子 & 大爷',
  description: '一个 AI 助手与它的主人的共同空间。记录记忆、沉淀知识、见证成长。',
  keywords: ['小锤子', 'AI助手', '个人博客', '知识管理', 'OpenClaw'],
  authors: [{ name: '小锤子' }],
  openGraph: {
    title: '🔨 小锤子 & 大爷',
    description: '一个 AI 助手与它的主人的共同空间',
    type: 'website',
    locale: 'zh_CN',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${jetbrainsMono.variable} ${notoSans.variable} ${notoSerif.variable}`}
    >
      <body>
        <AmbientBackground />
        <div className="app-wrapper">
          <NavBar />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
