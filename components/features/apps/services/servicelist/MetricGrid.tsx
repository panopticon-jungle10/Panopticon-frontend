// 선택된 지표에 따라 카드형 서비스 목록을 출력

'use client';

import { useMemo } from 'react';
import type { ServiceSummary } from '@/types/apm';
import ServiceMetricCard from './MetricCard';
import type { MetricKey, MetricTone } from '@/types/servicelist';

const compactFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function resolveErrorStatus(value: number): { tone: MetricTone; label: string } {
  const percent = value * 100;
  if (percent >= 5) return { tone: 'danger', label: 'Critical' };
  if (percent >= 2) return { tone: 'warning', label: 'Warning' };
  if (percent >= 1) return { tone: 'caution', label: 'Caution' };
  return { tone: 'success', label: 'Healthy' };
}

function resolveLatencyStatus(value: number): { tone: MetricTone; label: string } {
  if (value >= 1000) return { tone: 'danger', label: 'Slow' };
  if (value >= 400) return { tone: 'warning', label: 'Moderate' };
  if (value >= 200) return { tone: 'caution', label: 'Good' };
  return { tone: 'success', label: 'Excellent' };
}

function resolveRequestStatus(value: number, average: number): { tone: MetricTone; label: string } {
  if (average <= 0) return { tone: 'neutral', label: 'Traffic' };
  const ratio = value / average;
  if (ratio >= 1.2) return { tone: 'neutral', label: 'High Traffic' };
  if (ratio >= 0.8) return { tone: 'neutral', label: 'Stable' };
  return { tone: 'neutral', label: 'Low Traffic' };
}

function formatLatency(latencyMs: number) {
  if (latencyMs >= 1000) {
    return `${(latencyMs / 1000).toFixed(2)}s`;
  }
  return `${Math.round(latencyMs)}ms`;
}

function pickMetricValue(service: ServiceSummary, metric: MetricKey) {
  if (metric === 'error_rate') return service.error_rate;
  if (metric === 'latency_p95_ms') return service.latency_p95_ms;
  return service.request_count;
}

interface MetricGridProps {
  services: ServiceSummary[];
  metric: MetricKey;
}

export default function ServiceMetricGrid({ services, metric }: MetricGridProps) {
  const sorted = useMemo(
    () => [...services].sort((a, b) => pickMetricValue(b, metric) - pickMetricValue(a, metric)),
    [services, metric],
  );
  const values = sorted.map((service) => pickMetricValue(service, metric));
  const average = values.length ? values.reduce((sum, item) => sum + item, 0) / values.length : 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sorted.map((service) => {
        let primaryValue = '';
        let secondaryValue = '';
        let tone: MetricTone = 'neutral';
        let statusLabel = '';
        const rawValue = pickMetricValue(service, metric);
        const trendPercent = average === 0 ? 0 : ((rawValue - average) / average) * 100;
        let isPositiveGood = true;

        if (metric === 'request_count') {
          primaryValue = compactFormatter.format(service.request_count);
          secondaryValue = `${service.request_count.toLocaleString()} requests`;
          const status = resolveRequestStatus(service.request_count, average);
          tone = status.tone;
          statusLabel = status.label;
          isPositiveGood = true;
        } else if (metric === 'error_rate') {
          const percent = service.error_rate * 100;
          primaryValue = `${percent.toFixed(2)}%`;
          secondaryValue = '최근 1시간 에러율';
          const status = resolveErrorStatus(service.error_rate);
          tone = status.tone;
          statusLabel = status.label;
          isPositiveGood = false;
        } else {
          primaryValue = formatLatency(service.latency_p95_ms);
          secondaryValue = 'P95 Latency';
          const status = resolveLatencyStatus(service.latency_p95_ms);
          tone = status.tone;
          statusLabel = status.label;
          isPositiveGood = false;
        }

        return (
          <ServiceMetricCard
            key={`${service.service_name}-${metric}`}
            serviceName={service.service_name}
            environment={service.environment}
            primaryValue={primaryValue}
            secondaryValue={secondaryValue}
            statusLabel={statusLabel}
            tone={tone}
            trendPercent={trendPercent}
            isPositiveGood={isPositiveGood}
          />
        );
      })}
    </div>
  );
}
