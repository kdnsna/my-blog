/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://kdnsna.cn',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  exclude: ['/api/*'],
}
