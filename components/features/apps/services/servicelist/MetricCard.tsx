'use client';

import type { MetricTone } from '@/types/servicelist';

interface MetricCardProps {
  serviceName: string;
  environment: string;
  primaryValue: string;
  secondaryValue: string;
  statusLabel?: string;
  tone?: MetricTone;
}

const toneClasses: Record<MetricTone, { container: string; badge: string }> = {
  neutral: { container: 'border-gray-200 bg-white', badge: 'bg-gray-100 text-gray-700' },
  success: { container: 'border-emerald-200 bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
  warning: { container: 'border-amber-200 bg-amber-50', badge: 'bg-amber-100 text-amber-700' },
  danger: { container: 'border-red-200 bg-red-50', badge: 'bg-red-100 text-red-700' },
};

export default function ServiceMetricCard({
  serviceName,
  environment,
  primaryValue,
  secondaryValue,
  statusLabel,
  tone = 'neutral',
}: MetricCardProps) {
  const toneStyle = toneClasses[tone];

  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${toneStyle.container}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">{serviceName}</p>
          <span className="inline-flex text-xs px-2 py-0.5 rounded-full border border-gray-200 bg-white text-gray-600 mt-1">
            {environment}
          </span>
        </div>
        {statusLabel && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${toneStyle.badge}`}>{statusLabel}</span>
        )}
      </div>
      <div className="text-3xl font-semibold text-gray-900">{primaryValue}</div>
      <p className="text-sm text-gray-600 mt-1">{secondaryValue}</p>
    </article>
  );
}
