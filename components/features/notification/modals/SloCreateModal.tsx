'use client';

import { useEffect, useState } from 'react';
import Dropdown from '@/components/ui/Dropdown';
import type { IntegrationType, SloCreateInput } from '@/src/types/notification';

interface SloCreateModalProps {
  open: boolean;
  defaultMinutes: number;
  onSubmit: (input: SloCreateInput) => void;
  onClose: () => void;
}

/* Tooltip 설명 텍스트 */
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

const metricOptions = [
  { label: 'Availability', value: 'availability' as const },
  { label: 'Latency (P95)', value: 'latency' as const },
  { label: 'Error Rate', value: 'error_rate' as const },
];

const channelOptions: { label: string; value: IntegrationType }[] = [
  { label: 'Slack', value: 'slack' },
  { label: 'Email', value: 'email' },
  { label: 'Teams', value: 'teams' },
  { label: 'Discord', value: 'discord' },
];

export default function SloCreateModal({
  open,
  defaultMinutes,
  onSubmit,
  onClose,
}: SloCreateModalProps) {
  const [form, setForm] = useState({
    id: crypto.randomUUID(),
    name: 'New SLO',
    metric: 'availability' as SloCreateInput['metric'],
    target: 0.99,
    connectedChannels: ['slack'] as IntegrationType[],
    tooltipTitle: metricDescriptions.availability.title,
    tooltipDescription: metricDescriptions.availability.description,
  });

  /** 스크롤 잠금 */
  useEffect(() => {
    if (open) {
      window.scrollTo({ top: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => (document.body.style.overflow = 'auto');
  }, [open]);

  if (!open) return null;

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleMetricChange = (metric: SloCreateInput['metric']) => {
    handleChange('metric', metric);
    handleChange('tooltipTitle', metricDescriptions[metric].title);
    handleChange('tooltipDescription', metricDescriptions[metric].description);
  };

  const toggleChannel = (channel: IntegrationType) => {
    setForm((prev) => {
      const hasChannel = prev.connectedChannels.includes(channel);
      return {
        ...prev,
        connectedChannels: hasChannel
          ? prev.connectedChannels.filter((c) => c !== channel)
          : [...prev.connectedChannels, channel],
      };
    });
  };

  const handleSubmit = () => {
    onSubmit({
      ...form,
      id: crypto.randomUUID(),
      sliValue: 0,
      actualDowntimeMinutes: 0,
      totalMinutes: defaultMinutes,
    } as SloCreateInput);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 backdrop-blur-sm px-4 pt-25 pb-10">
      <div
        className="
        w-full max-w-lg max-h-[85vh] overflow-y-auto
        rounded-2xl bg-white shadow-2xl border border-gray-100
        px-7 py-5 animate-fadeIn
      "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">SLO 생성</h2>
            <p className="text-sm text-gray-500 mt-1">
              목표값과 메트릭 정보를 기반으로 새로운 SLO를 생성합니다.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-semibold px-2"
          >
            닫기
          </button>
        </div>

        <div className="h-px bg-gray-200 mb-6" />

        {/* FORM BODY */}
        <div className="space-y-6">
          {/* NAME */}
          <div>
            <label className="text-sm font-semibold text-gray-800">이름</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="
                mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-all
              "
            />
          </div>

          {/* METRIC + CHANNELS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* METRIC */}
            <div>
              <label className="text-sm font-semibold text-gray-800">메트릭</label>
              <Dropdown
                value={form.metric}
                onChange={handleMetricChange}
                options={metricOptions}
                className="mt-2 w-full"
              />
            </div>

            {/* CHANNELS */}
            <div>
              <label className="text-sm font-semibold text-gray-800">연결 채널</label>

              <div className="mt-3 space-y-2">
                {channelOptions.map((channel) => (
                  <label
                    key={channel.value}
                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.connectedChannels.includes(channel.value)}
                      onChange={() => toggleChannel(channel.value)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                    <span className="select-none">{channel.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* TARGET */}
          <div>
            <label className="text-sm font-semibold text-gray-800">목표값 (0 ~ 1)</label>
            <input
              type="number"
              step="0.001"
              min="0"
              max="1"
              value={form.target}
              onChange={(e) => handleChange('target', parseFloat(e.target.value) || 0)}
              className="
                mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-all
              "
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700
              hover:bg-gray-50 transition-all
            "
          >
            취소
          </button>

          <button
            onClick={handleSubmit}
            className="
              rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white
              hover:bg-blue-700 shadow-sm transition-all
            "
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
}
