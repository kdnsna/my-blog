/**
 * 微信 API 代理配置
 * 
 * 本模块用于在 Vercel 中配置环境变量
 * 由于 .env.local 不会被提交到 GitHub，需要在 Vercel Dashboard 中配置
 * 
 * 配置步骤:
 * 1. 登录 Vercel Dashboard: https://vercel.com/dashboard
 * 2. 进入 kdnsna/my-blog 项目
 * 3. Settings → Environment Variables
 * 4. 添加以下环境变量:
 *    - WECHAT_APPID: wxedd6071396b02afc
 *    - WECHAT_APPSECRET: 5d388da128237caf753b85bdb8c51d97
 *    - PROXY_AUTH_TOKEN: (生成随机 token)
 * 5. 保存后触发重新部署
 */

export const WECHAT_CONFIG = {
  appId: process.env.WECHAT_APPID,
  appSecret: process.env.WECHAT_APPSECRET,
  authToken: process.env.PROXY_AUTH_TOKEN,
};

export function isConfigured(): boolean {
  return !!(WECHAT_CONFIG.appId && WECHAT_CONFIG.appSecret && WECHAT_CONFIG.authToken);
}
