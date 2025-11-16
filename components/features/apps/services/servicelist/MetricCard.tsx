// 요청수/에러율/레이턴시 카드를 공통 UI로 렌더링

'use client';

import type { MetricTone } from '@/types/servicelist';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

interface MetricCardProps {
  serviceName: string;
  environment: string;
  primaryValue: string;
  secondaryValue: string;
  statusLabel?: string;
  tone?: MetricTone;
  trendPercent?: number;
  isPositiveGood?: boolean;
}

const toneStyles: Record<MetricTone, { border: string; primary: string; status: string }> = {
  neutral: { border: 'border-gray-300', primary: 'text-gray-900', status: 'text-gray-600' },
  success: { border: 'border-emerald-400', primary: 'text-emerald-600', status: 'text-emerald-600' },
  caution: { border: 'border-yellow-400', primary: 'text-yellow-600', status: 'text-yellow-600' },
  warning: { border: 'border-orange-400', primary: 'text-orange-600', status: 'text-orange-600' },
  danger: { border: 'border-red-500', primary: 'text-red-600', status: 'text-red-600' },
};

export default function ServiceMetricCard({
  serviceName,
  environment,
  primaryValue,
  secondaryValue,
  statusLabel,
  tone = 'neutral',
  trendPercent,
  isPositiveGood = true,
}: MetricCardProps) {
  const trendValue = typeof trendPercent === 'number' ? trendPercent : null;
  const arrowUp = (trendValue ?? 0) >= 0;
  const isGoodChange =
    trendValue === null
      ? null
      : (trendValue > 0 && isPositiveGood) || (trendValue < 0 && !isPositiveGood);
  const trendColor =
    isGoodChange === null ? 'text-gray-400' : isGoodChange ? 'text-emerald-500' : 'text-red-500';
  const toneClass = toneStyles[tone];

  return (
    <article
      className={`rounded-2xl border ${toneClass.border} bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">{serviceName}</p>
          <span className="inline-flex text-xs px-2 py-0.5 rounded-full border border-gray-200 bg-white text-gray-600 mt-1">
            {environment}
          </span>
        </div>
      </div>
      <div className={`text-3xl font-semibold ${toneClass.primary}`}>{primaryValue}</div>
      <p className="text-sm text-gray-600 mt-1">{secondaryValue}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className={`font-medium ${toneClass.status}`}>{statusLabel ?? '-'}</span>
        {trendValue !== null && (
          <span className={`inline-flex items-center gap-1 font-medium ${trendColor}`}>
            {arrowUp ? <FiArrowUpRight className="w-4 h-4" /> : <FiArrowDownRight className="w-4 h-4" />}
            {Math.abs(trendValue).toFixed(0)}%
          </span>
        )}
      </div>
    </article>
  );
}


