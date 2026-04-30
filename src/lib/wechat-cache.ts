/**
 * 微信 access_token 内存缓存
 * Vercel Serverless Functions 冷启动时会清空，但热函数实例会保持缓存
 */

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

// 内存缓存（Serverless 环境下的简单方案）
let tokenCache: TokenCache | null = null;

export async function getAccessToken(): Promise<{ token: string; expiresIn: number }> {
  const now = Date.now();
  
  // 检查缓存是否有效（提前5分钟刷新）
  if (tokenCache && tokenCache.expiresAt > now + 5 * 60 * 1000) {
    return {
      token: tokenCache.accessToken,
      expiresIn: Math.floor((tokenCache.expiresAt - now) / 1000)
    };
  }

  const appId = process.env.WECHAT_APPID;
  const appSecret = process.env.WECHAT_APPSECRET;

  if (!appId || !appSecret) {
    throw new Error('Missing WECHAT_APPID or WECHAT_APPSECRET environment variables');
  }

  // 请求新的 access_token
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  
  const response = await fetch(url);
  const data = await response.json();

  if (data.errcode) {
    throw new Error(`Failed to get access_token: ${data.errmsg}`);
  }

  // 更新缓存
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + data.expires_in * 1000
  };

  return {
    token: data.access_token,
    expiresIn: data.expires_in
  };
}

export function clearTokenCache(): void {
  tokenCache = null;
}
