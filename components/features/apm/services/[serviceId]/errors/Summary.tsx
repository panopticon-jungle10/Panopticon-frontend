// 상단 Error Rate, Count 카드

'use client';

import StatGrid from '@/components/ui/StatGrid';
import type { StatItem } from '@/components/features/apm/services/[serviceId]/logs/types';
import { mockErrorSummary } from './mock';

export default function ErrorSummary() {
  const summaryItems: StatItem[] = mockErrorSummary;

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Error Summary</h2>
      <StatGrid items={summaryItems} />
    </div>
  );
}
