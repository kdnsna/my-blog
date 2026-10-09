# 微信公众号 API 代理：部署与配置

> ⚠️ 不要把任何真实的 AppID / AppSecret / Token 写进仓库。所有密钥只放在 Vercel 的环境变量里（本地开发用不提交的 `.env.local`）。

## Vercel 环境变量

1. 打开 https://vercel.com/dashboard ，进入 **kdnsna/my-blog** 项目
2. **Settings** → **Environment Variables**
3. 添加以下三个变量（Production / Preview / Development 按需勾选）：

| Name | Value |
|------|-------|
| `WECHAT_APPID` | `<WECHAT_APP_ID>`（公众号后台 → 设置与开发 → 基本配置） |
| `WECHAT_APPSECRET` | `<WECHAT_APP_SECRET>`（同上，重置后只显示一次） |
| `PROXY_AUTH_TOKEN` | `<PROXY_AUTH_TOKEN>`（自己生成的随机串，例如 `openssl rand -hex 32`） |

4. 保存后重新部署（Redeploy），新变量才会生效。

## 部署后验证

```bash
# 在本机终端里临时设置，不要写进任何文件
export PROXY_AUTH_TOKEN='<PROXY_AUTH_TOKEN>'

# 获取 access_token
curl "https://kdnsna.cn/api/wechat/token?auth=$PROXY_AUTH_TOKEN"

# 获取微信服务器 IP 列表（用于白名单）
curl "https://kdnsna.cn/api/wechat/proxy?auth=$PROXY_AUTH_TOKEN&path=/cgi-bin/getcallbackip"
```

## IP 白名单

微信公众号后台 → 设置与开发 → 基本配置 → IP 白名单，把上面接口返回的 IP 加进去。

## 接口列表

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/wechat/token` | GET | 获取 access_token（自动缓存 2 小时） |
| `/api/wechat/proxy` | GET/POST | 通用代理，支持所有微信 API |
| `/api/wechat/material` | POST | 素材管理 |
| `/api/wechat/menu` | GET/POST | 菜单管理 |
| `/api/wechat/article` | POST | 文章发布 |

## 密钥泄露时

立即在公众号后台重置 AppSecret、在 Vercel 里更换 `PROXY_AUTH_TOKEN`，然后 Redeploy。
