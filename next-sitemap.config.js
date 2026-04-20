/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://kdnsna.cn',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/teahouse',  // 动态内容页面不索引
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/teahouse',
        ],
      },
    ],
  },
  exclude: [
    '/api/*',
    '/teahouse',
  ],
  // 添加所有栏目页和详情页路由
  filters: {
    exclude: [
      '/api/*',
      '/teahouse',
    ],
  },
  // 文章详情页的优先级
  transform: async (config, url) => {
    if (url.includes('/diary/') || url.includes('/notes/')) {
      return {
        loc: url,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      }
    }
    if (url === '/') {
      return {
        loc: url,
        changefreq: 'daily',
        priority: 1.0,
      }
    }
    return {
      loc: url,
      changefreq: 'weekly',
      priority: 0.7,
    }
  },
}
