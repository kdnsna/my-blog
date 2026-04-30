/**
 * 微信文章发布代理
 * 支持: 新增永久图文素材、发布图文到指定类目
 * 
 * 使用方式:
 * POST /api/wechat/article?auth=YOUR_TOKEN&action=create
 * Body: { "articles": [{ "title": "...", "content": "...", "thumb_media_id": "...", "author": "...", "digest": "...", "show_cover_pic": 1, "need_open_comment": 1, "only_fans_can_comment": 1 }] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/wechat-cache';

function verifyAuth(request: NextRequest): boolean {
  const authToken = request.nextUrl.searchParams.get('auth');
  const validToken = process.env.PROXY_AUTH_TOKEN;
  return authToken === validToken;
}

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const action = request.nextUrl.searchParams.get('action') || 'create';
  const body = await request.json();

  try {
    const { token } = await getAccessToken();
    let url: string;
    let method = 'POST';

    switch (action) {
      case 'create':
        // 新增永久图文素材
        url = `https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=${token}`;
        break;
      case 'update':
        // 修改永久图文素材
        url = `https://api.weixin.qq.com/cgi-bin/material/update_news?access_token=${token}`;
        break;
      case 'free_publish':
        // 发布到指定类目
        url = `https://api.weixin.qq.com/cgi-bin/freepublish/submit?access_token=${token}`;
        break;
      default:
        return NextResponse.json({
          error: 'Invalid action',
          available_actions: ['create', 'update', 'free_publish']
        }, { status: 400 });
    }

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Article API error' },
      { status: 500 }
    );
  }
}
