/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { verifyJwt, extractJwtFromCookie } from '@/lib/jwt';

// 간단한 Slack 웹훅 프록시 엔드포인트 (JWT 인증 필요)
// 요청 바디: { webhookUrl: string, payload: any }
export async function POST(req: Request) {
  try {
    // Authorization 또는 쿠키에서 JWT 추출
    const authHeader = req.headers.get('authorization');
    let token: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = extractJwtFromCookie(req.headers.get('cookie'));
    }

    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const verification = await verifyJwt(token);
    if (!verification.valid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { webhookUrl, payload } = body || {};

    if (!webhookUrl || typeof webhookUrl !== 'string') {
      return NextResponse.json({ error: 'webhookUrl is required' }, { status: 400 });
    }

    // 기본적인 검증: Slack Incoming Webhook URL 패턴만 허용
    if (!webhookUrl.startsWith('https://hooks.slack.com/services/')) {
      return NextResponse.json({ error: 'invalid webhook url' }, { status: 400 });
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload ?? {}),
    });

    const text = await res.text();

    return NextResponse.json({ ok: res.ok, status: res.status, body: text }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown error' }, { status: 500 });
  }
}
