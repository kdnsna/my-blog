import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // 开发服务器配置
  devIndicators: false,
  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 301 永久重定向配置
  async redirects() {
    return [
      // 旧命名体系 → 新命名体系
      {
        source: '/projects',
        destination: '/achievement',
        permanent: true,
      },
      {
        source: '/notes',
        destination: '/method',
        permanent: true,
      },
      {
        source: '/diary',
        destination: '/story',
        permanent: true,
      },
      // 日记详情页 → 故事详情页（slug 不变）
      {
        source: '/diary/:slug',
        destination: '/story/:slug',
        permanent: true,
      },
    ]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
