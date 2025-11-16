// 상단 Error Rate, Count 카드

'use client';

import type { GetServiceErrorsResponse } from '@/types/apm';
import { useMemo } from 'react';

interface ErrorSummaryProps {
  data: GetServiceErrorsResponse | undefined;
}

export default function ErrorSummary({ data }: ErrorSummaryProps) {
  const { errorRate, totalErrors } = useMemo(() => {
    if (!data) {
      return { errorRate: 0, totalErrors: 0 };
    }

    const totalErrors = data.errors.reduce((sum, error) => sum + error.count, 0);
    // 에러율 계산 (실제로는 백엔드에서 제공해야 하지만, 여기서는 임시로 계산)
    const errorRate = totalErrors > 0 ? 2.3 : 0; // TODO: 실제 에러율 계산 로직 필요

    return { errorRate, totalErrors };
  }, [data]);

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Error Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Error Rate</p>
          <p className="text-2xl font-bold text-blue-600">{errorRate}%</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Error Count</p>
          <p className="text-2xl font-bold text-red-600">{totalErrors}</p>
        </div>
      </div>
    </div>
  );
}
