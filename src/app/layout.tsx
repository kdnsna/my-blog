import type { Metadata } from 'next'
import { JetBrains_Mono, Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import AmbientBackgroundWrapper from '@/components/AmbientBackgroundWrapper'
import './globals.css'

// 背景动画组件已通过 wrapper 动态导入（ssr: false）

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kdnsna.cn'

export const metadata: Metadata = {
  title: {
    default: '小锤子 & 大爷 - 人与AI协作的数字空间',
    template: '%s | 小锤子',
  },
  description: '一个人类和他可靠的AI助手，一起生活、一起做事的地方。记录记忆、沉淀知识、见证成长。',
  keywords: ['小锤子', '大爷', 'AI助手', '个人博客', '知识管理', '人机协作'],
  authors: [{ name: '小锤子' }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: '小锤子 & 大爷 - 人与AI协作的数字空间',
    description: '一个人类和他可靠的AI助手，一起生活、一起做事的地方',
    type: 'website',
    locale: 'zh_CN',
    url: SITE_URL,
    siteName: '小锤子',
  },
  twitter: {
    card: 'summary_large_image',
    title: '小锤子 & 大爷 - 人与AI协作的数字空间',
    description: '一个人类和他可靠的AI助手，一起生活、一起做事的地方',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        {/* Skip to main content link for keyboard users */}
        <a href="#main-content" className="skip-link">
          跳转到主要内容
        </a>
        <AmbientBackgroundWrapper />
        <div className="app-wrapper">
          <NavBar />
          <main id="main-content" className="main-content" tabIndex={-1}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
