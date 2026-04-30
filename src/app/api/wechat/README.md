# 微信公众号 API 代理

在 Vercel 上部署的微信公众号 API 代理服务，解决云电脑 IP 不固定无法添加到微信白名单的问题。

## 功能

- `GET /api/wechat/token` - 获取 access_token（自动缓存）
- `POST /api/wechat/proxy` - 通用代理接口
- `POST /api/wechat/material` - 素材管理
- `POST /api/wechat/menu` - 菜单管理
- `POST /api/wechat/article` - 文章发布

## 环境变量配置

需要在 Vercel Dashboard 中配置以下环境变量:

| 变量名 | 值 |
|--------|-----|
| WECHAT_APPID | wxedd6071396b02afc |
| WECHAT_APPSECRET | 5d388da128237caf753b85bdb8c51d97 |
| PROXY_AUTH_TOKEN | 随机生成的鉴权 token |

## 使用方式

所有接口都需要通过 `auth` 参数进行鉴权:

```bash
# 获取 access_token
curl "https://kdnsna.cn/api/wechat/token?auth=YOUR_TOKEN"

# 获取微信服务器 IP 列表
curl "https://kdnsna.cn/api/wechat/proxy?auth=YOUR_TOKEN&path=/cgi-bin/getcallbackip"

# 获取素材列表
curl -X POST "https://kdnsna.cn/api/wechat/material?auth=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"batchget","type":"image","offset":0,"count":20}'

# 创建菜单
curl -X POST "https://kdnsna.cn/api/wechat/menu?auth=YOUR_TOKEN&action=create" \
  -H "Content-Type: application/json" \
  -d '{"button":[{"type":"click","name":"菜单1","key":"MENU_1"}]}'

# 新增图文素材
curl -X POST "https://kdnsna.cn/api/wechat/article?auth=YOUR_TOKEN&action=create" \
  -H "Content-Type: application/json" \
  -d '{"articles":[{"title":"标题","content":"内容","thumb_media_id":"xxx"}]}'
```

## IP 白名单配置

部署后，调用任意接口查看返回的请求 IP，将这些 IP 添加到微信公众号后台的 IP 白名单中。
