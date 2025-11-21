import { LogItem } from '@/types/apm';
import {
  getSlackWebhookUrl,
  isSlackEnabled,
  getDiscordWebhookUrl,
  isDiscordEnabled,
  getTeamsWebhookUrl,
  isTeamsEnabled,
} from './localStorage';
import { sendWebhook, Provider } from '@/src/api/webhook/sendWebhook';

function buildTextFromErrors(errors: LogItem[]) {
  const serviceName = errors[0]?.service_name || 'Unknown Service';
  const errorCount = errors.length;
  const errorMessages = errors
    .slice(0, 10)
    .map((e, i) => `${i + 1}. ${e.message}`)
    .join('\n');
  const remainingCount = errorCount > 10 ? errorCount - 10 : 0;

  return `🚨 ${errorCount}개의 에러 발생\n*Service*: ${serviceName}\n\n최근 에러:\n${errorMessages}${
    remainingCount > 0 ? `\n\n... 외 ${remainingCount}개 에러` : ''
  }`;
}

export async function sendErrorNotification(provider: Provider, errors: LogItem[]) {
  if (provider === 'slack') {
    const webhook = getSlackWebhookUrl();
    if (!isSlackEnabled() || !webhook) return { success: false, reason: 'not_configured' };
    const text = buildTextFromErrors(errors);
    return sendWebhook('slack', webhook, { text });
  }

  if (provider === 'discord') {
    const webhook = getDiscordWebhookUrl();
    if (!isDiscordEnabled() || !webhook) return { success: false, reason: 'not_configured' };
    const text = buildTextFromErrors(errors);
    // Discord expects { content }
    return sendWebhook('discord', webhook, { content: text });
  }

  if (provider === 'teams') {
    const webhook = getTeamsWebhookUrl();
    if (!isTeamsEnabled() || !webhook) return { success: false, reason: 'not_configured' };
    const text = buildTextFromErrors(errors);
    // Teams simple payload: { text }
    return sendWebhook('teams', webhook, { text });
  }

  throw new Error('unsupported provider');
}

export async function sendDiscordErrorNotification(errors: LogItem[]) {
  return sendErrorNotification('discord', errors);
}

export async function sendTeamsErrorNotification(errors: LogItem[]) {
  return sendErrorNotification('teams', errors);
}
