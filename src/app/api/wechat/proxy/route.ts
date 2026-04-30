/**
 * 微信 API 通用代理
 * GET/POST /api/wechat/proxy?auth=YOUR_TOKEN&path=/cgi-bin/...&method=GET|POST
 * Body: JSON (for POST requests)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/wechat-cache';

function verifyAuth(request: NextRequest): boolean {
  const authToken = request.nextUrl.searchParams.get('auth');
  const validToken = process.env.PROXY_AUTH_TOKEN;
  
  if (!validToken) {
    console.error('PROXY_AUTH_TOKEN not configured');
    return false;
  }
  
  return authToken === validToken;
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get('path');
  if (!path) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  try {
    const { token } = await getAccessToken();
    const queryString = request.nextUrl.searchParams.get('query');
    
    let url = `https://api.weixin.qq.com${path}?access_token=${token}`;
    if (queryString) {
      url += `&${queryString}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Proxy error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get('path');
  if (!path) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  try {
    const { token } = await getAccessToken();
    const queryString = request.nextUrl.searchParams.get('query');
    
    let url = `https://api.weixin.qq.com${path}?access_token=${token}`;
    if (queryString) {
      url += `&${queryString}`;
    }

    const body = await request.json();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Proxy error' },
      { status: 500 }
    );
  }
}
