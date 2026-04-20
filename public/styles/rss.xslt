<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:rss="http://purl.org/rss/1.0/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  exclude-result-prefixes="rss content">
  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="rss/channel/title"/> - RSS 订阅</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          .card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          .header h1 {
            font-size: 2rem;
            margin-bottom: 8px;
          }
          .header p {
            opacity: 0.9;
            font-size: 1.1rem;
          }
          .feed-icon {
            font-size: 4rem;
            margin-bottom: 16px;
          }
          .stats {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.2);
          }
          .stat {
            text-align: center;
          }
          .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
          }
          .stat-label {
            font-size: 0.85rem;
            opacity: 0.8;
          }
          .content {
            padding: 0;
          }
          .section-title {
            font-size: 1rem;
            color: #666;
            padding: 20px 30px;
            border-bottom: 1px solid #eee;
            background: #f9fafb;
          }
          .item {
            padding: 24px 30px;
            border-bottom: 1px solid #eee;
            transition: background 0.2s;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item:hover {
            background: #f9fafb;
          }
          .item-category {
            display: inline-block;
            font-size: 0.75rem;
            padding: 2px 10px;
            border-radius: 12px;
            margin-bottom: 8px;
            font-weight: 500;
          }
          .category-story {
            background: #e0e7ff;
            color: #4338ca;
          }
          .category-method {
            background: #dcfce7;
            color: #166534;
          }
          .item-title {
            font-size: 1.1rem;
            color: #1f2937;
            margin-bottom: 8px;
            font-weight: 600;
          }
          .item-title a {
            color: inherit;
            text-decoration: none;
          }
          .item-title a:hover {
            color: #667eea;
            text-decoration: underline;
          }
          .item-date {
            font-size: 0.85rem;
            color: #9ca3af;
            margin-bottom: 8px;
          }
          .item-desc {
            color: #6b7280;
            font-size: 0.95rem;
            line-height: 1.7;
          }
          .subscribe-section {
            padding: 30px;
            background: #f9fafb;
            border-top: 1px solid #eee;
          }
          .subscribe-section h2 {
            font-size: 1.1rem;
            color: #1f2937;
            margin-bottom: 16px;
          }
          .subscribe-methods {
            display: grid;
            gap: 12px;
          }
          .subscribe-method {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .subscribe-icon {
            font-size: 1.5rem;
          }
          .subscribe-text {
            flex: 1;
          }
          .subscribe-title {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 2px;
          }
          .subscribe-desc {
            font-size: 0.85rem;
            color: #6b7280;
          }
          .copy-btn {
            padding: 6px 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: background 0.2s;
          }
          .copy-btn:hover {
            background: #5a67d8;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: rgba(255,255,255,0.8);
            font-size: 0.85rem;
          }
          .footer a {
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <div class="feed-icon">📡</div>
              <h1><xsl:value-of select="rss/channel/title"/></h1>
              <p><xsl:value-of select="rss/channel/description"/></p>
              <div class="stats">
                <div class="stat">
                  <div class="stat-value">
                    <xsl:value-of select="count(rss/channel/item)"/>
                  </div>
                  <div class="stat-label">篇文章</div>
                </div>
                <div class="stat">
                  <div class="stat-value">
                    <xsl:value-of select="substring(rss/channel/lastBuildDate, 1, 16)"/>
                  </div>
                  <div class="stat-label">更新时间</div>
                </div>
              </div>
            </div>

            <div class="content">
              <div class="section-title">
                最新文章
              </div>
              <xsl:for-each select="rss/channel/item">
                <div class="item">
                  <xsl:variable name="cat" select="category"/>
                  <span class="item-category">
                    <xsl:choose>
                      <xsl:when test="$cat = 'story'">📖 故事</xsl:when>
                      <xsl:when test="$cat = 'method'">🧭 方法</xsl:when>
                      <xsl:when test="$cat = 'achievement'">🏆 成果</xsl:when>
                      <xsl:otherwise>📝 文章</xsl:otherwise>
                    </xsl:choose>
                  </span>
                  <h3 class="item-title">
                    <a href="{link}" target="_blank">
                      <xsl:value-of select="title"/>
                    </a>
                  </h3>
                  <div class="item-date">
                    <xsl:value-of select="pubDate"/>
                  </div>
                  <p class="item-desc">
                    <xsl:value-of select="description"/>
                  </p>
                </div>
              </xsl:for-each>
            </div>

            <div class="subscribe-section">
              <h2>如何订阅</h2>
              <div class="subscribe-methods">
                <div class="subscribe-method">
                  <span class="subscribe-icon">🔗</span>
                  <div class="subscribe-text">
                    <div class="subscribe-title">直接订阅此页面</div>
                    <div class="subscribe-desc">将此页面 URL 添加到你的 RSS 阅读器</div>
                  </div>
                  <button class="copy-btn" onclick="navigator.clipboard.writeText(window.location.href)">复制链接</button>
                </div>
                <div class="subscribe-method">
                  <span class="subscribe-icon">📱</span>
                  <div class="subscribe-text">
                    <div class="subscribe-title">推荐阅读器</div>
                    <div class="subscribe-desc">Inoreader、Feedly、Reeder 等</div>
                  </div>
                </div>
                <div class="subscribe-method">
                  <span class="subscribe-icon">🧡</span>
                  <div class="subscribe-text">
                    <div class="subscribe-title">浏览器扩展</div>
                    <div class="subscribe-desc">RSS Preview、Better Search 等</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>由 <a href="{rss/channel/link}">小锤子</a> 提供 | <a href="{rss/channel/link}">返回博客</a></p>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
