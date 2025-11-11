// 전체 Error 섹션 조립

'use client';
import ErrorSummary from '../errors/Summary';
import ErrorTrendChart from '../errors/TrendChart';
import ErrorDistribution from '../errors/Distribution';

export default function ErrorsSection() {
  return (
    <div className="space-y-6">
      <ErrorSummary />
      <ErrorTrendChart />
      <ErrorDistribution />
    </div>
  );
}
