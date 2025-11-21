/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { verifyJwt, extractJwtFromCookie } from '@/lib/jwt';

// Discord webhook proxy
export async function POST(req: Request) {
  try {
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

    // Discord webhook URL 검사
    if (
      !(
        webhookUrl.startsWith('https://discord.com/api/webhooks/') ||
        webhookUrl.startsWith('https://discordapp.com/api/webhooks/')
      )
    ) {
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
