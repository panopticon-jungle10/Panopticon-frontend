// 하나의 SLO(가용성/레이턴시/에러율)에 대한 상세 상태를 카드 형태로 보여주는 컴포넌트

'use client';

import type { ComputedSlo } from '@/src/types/notification';
import { InfoTooltip } from './InfoTooltip';
import { StatusBadge } from './StatusBadge';

interface SloCardProps {
  slo: ComputedSlo;
  onEdit: (slo: ComputedSlo) => void;
  onDelete: (slo: ComputedSlo) => void;
}

// 상태 색상 매핑
const statusColorMap = {
  GOOD: 'text-green-600',
  WARNING: 'text-yellow-600',
  FAILED: 'text-red-600',
} as const;

export function SloCard({ slo, onEdit, onDelete }: SloCardProps) {
  // 허용치 관련 파생값 계산
  const usedPct = slo.errorBudgetUsedRate * 100; // 사용률 퍼센트 (0~100+)
  const remainingPct = Math.max(0, slo.errorBudgetRemainingPct); // 남은 에러버짓
  const overPct = Math.max(0, slo.errorBudgetOverPct); // 초과량

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-150 hover:shadow-md">
      {/* ─────────────────────────────────────────────
          1) 카드 상단 - 제목 / 설명 tooltip / 상태 badge / 액션 버튼
      ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between w-full">
        {/* 왼쪽: 제목 + Tooltip */}
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-900">{slo.name}</h3>
          <InfoTooltip title={slo.tooltipTitle} description={slo.tooltipDescription} />
        </div>

        {/* 오른쪽: 상태 배지 + 수정/삭제 */}
        <div className="flex items-center gap-2">
          <StatusBadge status={slo.status} />

          <button
            type="button"
            onClick={() => onEdit(slo)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            수정
          </button>

          <button
            type="button"
            onClick={() => onDelete(slo)}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          2) 중단 - SLI / 남은 허용치 / 초과량
          Datadog 스타일의 "3개 요약 지표" 레이아웃
      ───────────────────────────────────────────── */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SLI 박스 */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
          <div className="text-xs text-gray-500">SLI(지표)</div>
          <div className="mt-1 text-3xl font-bold text-gray-900">
            {(slo.sliValue * 100).toFixed(2)}%
          </div>
          <div className="mt-1 text-xs text-gray-500">
            목표 {Math.round(slo.target * 10000) / 100}%
          </div>
        </div>

        {/* 남은 Budget */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
          <div className="text-xs text-gray-500">남은 허용치</div>
          <div className="mt-1 text-3xl font-bold text-gray-900">{remainingPct.toFixed(1)}%</div>
          <div className={`mt-1 text-xs font-semibold ${statusColorMap[slo.status]}`}>
            사용률 {usedPct.toFixed(1)}%
          </div>
        </div>

        {/* 초과량 */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
          <div className="text-xs text-gray-500">허용치 초과</div>
          <div className="mt-1 text-3xl font-bold text-gray-900">
            {overPct > 0 ? `+${overPct.toFixed(1)}%` : '0%'}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            허용 {slo.allowedDowntimeMinutes.toFixed(1)}분 · 실제{' '}
            {slo.actualDowntimeMinutes.toFixed(1)}분
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          3) 하단 - ErrorBudget Bar
      ───────────────────────────────────────────── */}
      <div className="mt-5 space-y-2">
        {/* 제목 + 퍼센트 */}
        <div className="flex justify-between items-center text-sm font-semibold text-gray-800">
          <span>허용치</span>
          <span className={statusColorMap[slo.status]}>사용률 {usedPct.toFixed(1)}%</span>
        </div>

        {/* Progress Bar (Rounded + Smooth Style) */}
        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`
              h-full transition-all duration-300
              ${
                slo.status === 'FAILED'
                  ? 'bg-red-500'
                  : slo.status === 'WARNING'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }
            `}
            style={{ width: `${Math.min(100, usedPct)}%` }}
          />
        </div>

        {/* 초과 안내 */}
        {overPct > 0 && (
          <div className="text-xs font-semibold text-red-600">
            허용치 초과 +{overPct.toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}
