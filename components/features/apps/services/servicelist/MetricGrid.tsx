// 선택된 지표에 따라 카드형 서비스 목록을 출력

'use client';

import { useMemo } from 'react';
import type { ServiceSummary } from '@/types/apm';
import ServiceMetricCard from './MetricCard';
import type { MetricKey, MetricTone } from '@/types/servicelist';

// 숫자를 compact 형태(15K, 1.2M 등)로 표시
const compactFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

// 에러율 상태 계산 (danger / warning / caution / success)
function resolveErrorStatus(value: number): { tone: MetricTone; label: string } {
  const percent = value * 100;
  if (percent >= 5) return { tone: 'danger', label: 'Critical' };
  if (percent >= 2) return { tone: 'warning', label: 'Warning' };
  if (percent >= 1) return { tone: 'caution', label: 'Caution' };
  return { tone: 'success', label: 'Healthy' };
}

// 레이턴시 상태 계산
function resolveLatencyStatus(value: number): { tone: MetricTone; label: string } {
  if (value >= 1000) return { tone: 'danger', label: 'Slow' };
  if (value >= 400) return { tone: 'warning', label: 'Moderate' };
  if (value >= 200) return { tone: 'caution', label: 'Good' };
  return { tone: 'success', label: 'Excellent' };
}

// 요청수 상태 계산 (평균 대비 높음/낮음)
function resolveRequestStatus(value: number, average: number): { tone: MetricTone; label: string } {
  if (average <= 0) return { tone: 'neutral', label: 'Traffic' };
  const ratio = value / average;
  if (ratio >= 1.2) return { tone: 'neutral', label: 'High Traffic' };
  if (ratio >= 0.8) return { tone: 'neutral', label: 'Stable' };
  return { tone: 'neutral', label: 'Low Traffic' };
}

// 레이턴시 출력 포맷 (ms → s 변환)
function formatLatency(latencyMs: number) {
  if (latencyMs >= 1000) {
    return `${(latencyMs / 1000).toFixed(2)}s`;
  }
  return `${Math.round(latencyMs)}ms`;
}

// metric에 맞는 값을 추출
function pickMetricValue(service: ServiceSummary, metric: MetricKey) {
  if (metric === 'error_rate') return service.error_rate;
  if (metric === 'latency_p95_ms') return service.latency_p95_ms;
  return service.request_count;
}

interface MetricGridProps {
  services: ServiceSummary[];
  metric: MetricKey;
  onCardClick?: (service: ServiceSummary) => void;
}

export default function ServiceMetricGrid({ services, metric, onCardClick }: MetricGridProps) {
  // 서비스 내림차순 정렬 + 평균 계산
  const sorted = useMemo(
    () => [...services].sort((a, b) => pickMetricValue(b, metric) - pickMetricValue(a, metric)),
    [services, metric],
  );
  const values = sorted.map((service) => pickMetricValue(service, metric));
  const average = values.length ? values.reduce((sum, item) => sum + item, 0) / values.length : 0;

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
      {sorted.map((service) => {
        // 카드에 표시되는 값들
        let primaryValue = '';
        let secondaryValue = '';
        let tone: MetricTone = 'neutral';
        const statusLabel = '';

        // metric 종류에 따라 카드 내용 커스터마이징
        if (metric === 'request_count') {
          primaryValue = compactFormatter.format(service.request_count);
          secondaryValue = `${service.request_count.toLocaleString()} requests`;
          const status = resolveRequestStatus(service.request_count, average);
          tone = status.tone;
        } else if (metric === 'error_rate') {
          const percent = service.error_rate * 100;
          primaryValue = `${percent.toFixed(2)}%`;
          const status = resolveErrorStatus(service.error_rate);
          tone = status.tone;
        } else {
          primaryValue = formatLatency(service.latency_p95_ms);
          const status = resolveLatencyStatus(service.latency_p95_ms);
          tone = status.tone;
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
            onClick={onCardClick ? () => onCardClick(service) : undefined}
          />
        );
      })}
    </div>
  );
}
