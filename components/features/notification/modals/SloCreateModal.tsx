'use client';

import { useEffect, useState } from 'react';
import type { IntegrationType, SloCreateInput } from '@/src/types/notification';

interface SloCreateModalProps {
  open: boolean;
  defaultMinutes: number; // 백엔드 계산용, UI에서는 사용 안 함
  onSubmit: (input: SloCreateInput) => void;
  onClose: () => void;
}

/** 메트릭별 Tooltip 텍스트 정의 */
const metricDescriptions = {
  availability: {
    title: 'Availability SLO',
    description: '비정상 응답 없이 처리된 요청의 비율입니다.',
  },
  latency: {
    title: 'Latency P95',
    description: '전체 요청 중 가장 느린 5%를 제외한 응답 시간입니다.',
  },
  error_rate: {
    title: 'Error Rate',
    description: '전체 요청 중 오류가 발생한 비율입니다.',
  },
};

export default function SloCreateModal({
  open,
  defaultMinutes,
  onSubmit,
  onClose,
}: SloCreateModalProps) {
  /** 사용자 입력값만 유지 */
  const [form, setForm] = useState({
    id: crypto.randomUUID(),
    name: 'New SLO',
    metric: 'availability' as SloCreateInput['metric'],
    target: 0.99, // SLO 목표치
    connectedChannels: ['slack'] as IntegrationType[],
    tooltipTitle: metricDescriptions.availability.title,
    tooltipDescription: metricDescriptions.availability.description,
  });

  /** 모달이 열리면 스크롤 잠금 */
  useEffect(() => {
    if (open) {
      window.scrollTo({ top: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  if (!open) return null;

  /** 공통 입력 핸들러 */
  const handleChange = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /** 메트릭 변경 시 Tooltip 자동 변경 */
  const handleMetricChange = (metric: SloCreateInput['metric']) => {
    handleChange('metric', metric);
    handleChange('tooltipTitle', metricDescriptions[metric].title);
    handleChange('tooltipDescription', metricDescriptions[metric].description);
  };

  /** 제출 시 백엔드 계산이 필요한 값은 자동 채워서 전달 */
  const handleSubmit = () => {
    onSubmit({
      ...form,
      id: crypto.randomUUID(),
      /** 아래 값들은 백엔드에서 계산될 예정 */
      sliValue: 0, // placeholder
      actualDowntimeMinutes: 0,
      totalMinutes: defaultMinutes,
    } as SloCreateInput);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-center bg-black/30 px-4 py-16 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 max-h-[85vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">SLO 생성</h2>
            <p className="text-xs text-gray-500">목표값과 메트릭을 기반으로 SLO가 생성됩니다.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm font-semibold">
            닫기
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5">

          {/* 이름 */}
          <div>
            <label className="text-xs font-semibold text-gray-700">이름</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 메트릭 + 연결 채널 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* 메트릭 선택 */}
            <div>
              <label className="text-xs font-semibold text-gray-700">메트릭</label>
              <select
                value={form.metric}
                onChange={(e) => handleMetricChange(e.target.value as SloCreateInput['metric'])}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="availability">Availability</option>
                <option value="latency">Latency (P95)</option>
                <option value="error_rate">Error Rate</option>
              </select>
            </div>

            {/* 연결 채널 */}
            <div>
              <label className="text-xs font-semibold text-gray-700">연결 채널</label>
              <select
                multiple
                value={form.connectedChannels}
                onChange={(e) =>
                  handleChange(
                    'connectedChannels',
                    Array.from(e.target.selectedOptions).map((opt) => opt.value as IntegrationType),
                  )
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                           h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="slack">Slack</option>
                <option value="email">Email</option>
                <option value="teams">Teams</option>
                <option value="discord">Discord</option>
              </select>
              <p className="text-[11px] text-gray-500 mt-1">Ctrl/Cmd + 클릭으로 복수 선택 가능</p>
            </div>
          </div>

          {/* 목표값 */}
          <div>
            <label className="text-xs font-semibold text-gray-700">목표값 (0~1)</label>
            <input
              type="number"
              step="0.001"
              min="0"
              max="1"
              value={form.target}
              onChange={(e) => handleChange('target', parseFloat(e.target.value) || 0)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            생성
          </button>
        </div>

      </div>
    </div>
  );
}
