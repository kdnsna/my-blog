/**
 * 微信素材管理代理
 * 支持: 获取素材列表、上传临时/永久素材、删除素材等
 * 
 * 使用方式:
 * POST /api/wechat/material?auth=YOUR_TOKEN&action=batchget
 * Body: { "type": "image", "offset": 0, "count": 20 }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/wechat-cache';

function verifyAuth(request: NextRequest): boolean {
  const authToken = request.nextUrl.searchParams.get('auth');
  const validToken = process.env.PROXY_AUTH_TOKEN;
  return authToken === validToken;
}

const MATERIAL_ACTIONS: Record<string, string> = {
  // 永久素材
  batchget: '/cgi-bin/material/batchget_material',      // 获取素材列表
  get: '/cgi-bin/material/get_material',                // 获取素材详情
  add_news: '/cgi-bin/material/add_news',              // 新增永久图文素材
  uploadimg: '/cgi-bin/media/uploadimg',               // 上传图片
  add_material: '/cgi-bin/material/add_material',       // 新增其他永久素材
  del_material: '/cgi-bin/material/del_material',       // 删除永久素材
  get_count: '/cgi-bin/material/get_materialcount',     // 获取素材总数
  
  // 临时素材
  upload_temp: '/cgi-bin/media/upload',                 // 上传临时素材
  get_temp: '/cgi-bin/media/get',                       // 获取临时素材
};

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, ...body } = await request.json();
  
  if (!action || !MATERIAL_ACTIONS[action]) {
    return NextResponse.json({
      error: 'Invalid action',
      available_actions: Object.keys(MATERIAL_ACTIONS)
    }, { status: 400 });
  }

  try {
    const { token } = await getAccessToken();
    const path = MATERIAL_ACTIONS[action];
    const url = `https://api.weixin.qq.com${path}?access_token=${token}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Material API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Material API error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const action = request.nextUrl.searchParams.get('action');
  
  if (action === 'get_count') {
    try {
      const { token } = await getAccessToken();
      const url = `https://api.weixin.qq.com/cgi-bin/material/get_materialcount?access_token=${token}`;
      
      const response = await fetch(url);
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'API error' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    error: 'GET not supported for this action',
    hint: 'Use POST for material operations'
  }, { status: 400 });
}
