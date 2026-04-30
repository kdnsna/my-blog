# 部署完成！需要手动配置环境变量

## Vercel 环境变量配置

代码已推送到 GitHub，Vercel 会自动部署。但 **环境变量需要手动在 Vercel Dashboard 中配置**：

### 配置步骤

1. 访问 https://vercel.com/dashboard
2. 进入 **kdnsna/my-blog** 项目
3. 点击 **Settings** → **Environment Variables**
4. 添加以下三个环境变量:

| Name | Value | Environments |
|------|-------|--------------|
| `WECHAT_APPID` | `wxedd6071396b02afc` | Production, Preview, Development |
| `WECHAT_APPSECRET` | `5d388da128237caf753b85bdb8c51d97` | Production, Preview, Development |
| `PROXY_AUTH_TOKEN` | `433b83b3362f400e9968a1414b30f49034a0b823983e10cafacebab9d195649b` | Production, Preview, Development |

5. 保存后，Vercel 会自动触发重新部署

## 部署后验证

部署完成后，可以用以下命令测试:

```bash
# 获取 access_token
curl "https://kdnsna.cn/api/wechat/token?auth=433b83b3362f400e9968a1414b30f49034a0b823983e10cafacebab9d195649b"

# 获取微信服务器 IP 列表（用于白名单）
curl "https://kdnsna.cn/api/wechat/proxy?auth=433b83b3362f400e9968a1414b30f49034a0b823983e10cafacebab9d195649b&path=/cgi-bin/getcallbackip"
```

## IP 白名单配置

在微信公众号后台 → 设置与开发 → 基本配置 → IP白名单

将上面接口返回的微信服务器 IP 添加到白名单中。

## API 接口列表

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/wechat/token` | GET | 获取 access_token（自动缓存 2 小时） |
| `/api/wechat/proxy` | GET/POST | 通用代理，支持所有微信 API |
| `/api/wechat/material` | POST | 素材管理 |
| `/api/wechat/menu` | GET/POST | 菜单管理 |
| `/api/wechat/article` | POST | 文章发布 |
