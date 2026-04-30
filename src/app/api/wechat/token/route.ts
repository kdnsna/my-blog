/**
 * 获取微信 access_token
 * GET /api/wechat/token?auth=YOUR_TOKEN
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
  // 鉴权检查
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { token, expiresIn } = await getAccessToken();
    
    return NextResponse.json({
      access_token: token,
      expires_in: expiresIn,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Failed to get access_token:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get access_token' },
      { status: 500 }
    );
  }
}
