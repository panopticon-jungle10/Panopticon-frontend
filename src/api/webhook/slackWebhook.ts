import { getSlackWebhookUrl } from '@/src/utils/localStorage';
import { sendWebhook } from '@/src/api/webhook/sendWebhook';

export async function sendSlackMessage(text: string) {
  const webhookUrl = getSlackWebhookUrl();
  if (!webhookUrl) {
    throw new Error('Slack webhook URL not configured');
  }

  return sendWebhook('slack', webhookUrl, { text });
}
