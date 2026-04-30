/**
 * 微信菜单管理代理
 * 支持: 创建菜单、查询菜单、删除菜单
 * 
 * 使用方式:
 * POST /api/wechat/menu?auth=YOUR_TOKEN&action=create
 * Body: { "button": [...] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/wechat-cache';

function verifyAuth(request: NextRequest): boolean {
  const authToken = request.nextUrl.searchParams.get('auth');
  const validToken = process.env.PROXY_AUTH_TOKEN;
  return authToken === validToken;
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const action = request.nextUrl.searchParams.get('action') || 'get';

  try {
    const { token } = await getAccessToken();
    let url: string;

    if (action === 'get') {
      url = `https://api.weixin.qq.com/cgi-bin/menu/get?access_token=${token}`;
    } else if (action === 'delete') {
      url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${token}`;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Menu API error' },
      { status: 500 }
    );
  }
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
    if (action === 'create') {
      url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Menu API error' },
      { status: 500 }
    );
  }
}
