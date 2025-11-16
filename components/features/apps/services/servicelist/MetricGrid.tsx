'use client';

import { useMemo } from 'react';
import type { ServiceSummary } from '@/types/apm';
import ServiceMetricCard from './MetricCard';
import type { MetricKey, MetricTone } from '@/types/servicelist';

const compactFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const statusLabels: Record<MetricKey, Record<MetricTone, string>> = {
  request_count: {
    neutral: 'Traffic',
    success: 'Traffic',
    warning: 'Traffic',
    danger: 'Traffic',
  },
  error_rate: {
    neutral: 'Healthy',
    success: 'Healthy',
    warning: 'Warning',
    danger: 'Critical',
  },
  latency_p95_ms: {
    neutral: 'Good',
    success: 'Excellent',
    warning: 'Moderate',
    danger: 'Slow',
  },
};

function resolveTone(metric: MetricKey, value: number): MetricTone {
  if (metric === 'error_rate') {
    if (value >= 0.05) return 'danger';
    if (value >= 0.01) return 'warning';
    return 'success';
  }
  if (metric === 'latency_p95_ms') {
    if (value >= 1000) return 'danger';
    if (value >= 400) return 'warning';
    return 'success';
  }
  return 'neutral';
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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sorted.map((service) => {
        let primaryValue = '';
        let secondaryValue = '';
        let tone: MetricTone = 'neutral';

        if (metric === 'request_count') {
          primaryValue = compactFormatter.format(service.request_count);
          secondaryValue = `${service.request_count.toLocaleString()} requests`;
        } else if (metric === 'error_rate') {
          const percent = service.error_rate * 100;
          primaryValue = `${percent.toFixed(2)}%`;
          secondaryValue = '최근 1시간 에러율';
          tone = resolveTone(metric, service.error_rate);
        } else {
          primaryValue = formatLatency(service.latency_p95_ms);
          secondaryValue = 'P95 Latency';
          tone = resolveTone(metric, service.latency_p95_ms);
        }

        const statusLabel = statusLabels[metric][tone];

        return (
          <ServiceMetricCard
            key={`${service.service_name}-${metric}`}
            serviceName={service.service_name}
            environment={service.environment}
            primaryValue={primaryValue}
            secondaryValue={secondaryValue}
            statusLabel={statusLabel}
            tone={tone}
          />
        );
      })}
    </div>
  );
}
