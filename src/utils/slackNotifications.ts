/**
 * 슬랙 알림 전송 유틸리티
 *
 * 이 파일은 /app/api/notifications/route.ts와 함께 동작합니다.
 * API 파일을 삭제하면 이 함수들도 작동하지 않습니다.
 */

import { LogItem } from '@/types/apm';
import { getSlackWebhookUrl, isSlackEnabled } from './localStorage';
import { sendSlackMessage } from '@/src/api/webhook/slackWebhook';

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;)\\s*' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * 슬랙으로 에러 로그 알림 전송
 */
export async function sendSlackErrorNotification(errors: LogItem[]) {
  try {
    // 로컬스토리지에서 웹훅 URL 확인
    const webhookUrl = getSlackWebhookUrl();
    const enabled = isSlackEnabled();

    if (!enabled || !webhookUrl) {
      console.log('[Slack Notification] Slack webhook not configured or disabled');
      return { success: false, reason: 'not_configured' };
    }
    // 에러 로그들을 분석하여 단순 텍스트 메시지 생성
    const serviceName = errors[0]?.service_name || 'Unknown Service';
    const errorCount = errors.length;
    const errorMessages = errors
      .slice(0, 10)
      .map((e, i) => `${i + 1}. ${e.message}`)
      .join('\n');
    const remainingCount = errorCount > 10 ? errorCount - 10 : 0;

    const text = `🚨 ${errorCount}개의 에러 발생\n*Service*: ${serviceName}\n\n최근 에러:\n${errorMessages}${
      remainingCount > 0 ? `\n\n... 외 ${remainingCount}개 에러` : ''
    }`;

    // sendSlackMessage는 내부적으로 /api/webhook/slack 프록시를 호출합니다.
    const result = await sendSlackMessage(text);
    console.log('[Slack Notification] Sent successfully:', result);
    return result;
  } catch (error) {
    console.error('[Slack Notification] Failed to send:', error);
    throw error;
  }
}

/**
 * 슬랙 웹훅 테스트 메시지 전송
 */
export async function testSlackWebhook(webhookUrl: string) {
  try {
    // 프록시 엔드포인트에 직접 테스트 페이로드 전송
    const token = getCookieValue('auth-token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/webhook/slack', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        webhookUrl,
        payload: { text: 'Panopticon - Slack webhook test message' },
      }),
    });

    if (!res.ok) throw new Error(`Failed to test webhook: ${res.status} ${res.statusText}`);
    const result = await res.json().catch(() => ({}));
    console.log('[Slack Webhook] Test successful:', result);
    return result;
  } catch (error) {
    console.error('[Slack Webhook] Test failed:', error);
    throw error;
  }
}
