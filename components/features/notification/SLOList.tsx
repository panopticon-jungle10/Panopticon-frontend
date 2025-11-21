'use client';

import { useState, useEffect } from 'react';
import type { SLOTarget } from './SLOConfiguration';

const metricConfig: Record<
  SLOTarget['metric'],
  { name: string; description: string; unit: string; min: number; max: number; step: number }
> = {
  availability: {
    name: '가용성',
    description: '서비스가 정상적으로 응답하는 비율',
    unit: '%',
    min: 90,
    max: 100,
    step: 0.1,
  },
  latency: {
    name: '레이턴시',
    description: '요청 응답 시간의 목표값 (P95)',
    unit: 'ms',
    min: 10,
    max: 5000,
    step: 10,
  },
  error_rate: {
    name: '에러율',
    description: '전체 요청 중 에러 발생 비율의 최대 허용치',
    unit: '%',
    min: 0,
    max: 10,
    step: 0.1,
  },
};

export default function SLOList() {
  const [targets, setTargets] = useState<SLOTarget[]>([]);

  // 서버 렌더링과 클라이언트 초기 렌더링 결과를 일치시키기 위해
  // localStorage 접근은 마운트 후에 수행합니다.
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('slo_targets') : null;
      if (raw) {
        const parsed = JSON.parse(raw) as SLOTarget[];
        // 비동기 마이크로태스크로 설정하여 동기적인 이펙트 내 setState 경고를 회피합니다.
        Promise.resolve().then(() => setTargets(parsed));
      }
    } catch {
      // ignore
    }
  }, []);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<number | null>(null);

  const persist = (next: SLOTarget[]) => {
    setTargets(next);
    try {
      localStorage.setItem('slo_targets', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleToggle = (id: string) => {
    persist(targets.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
  };

  const handleValueChange = (id: string, value: number) => {
    persist(targets.map((t) => (t.id === id ? { ...t, target: value } : t)));
  };

  const startEdit = (t: SLOTarget) => {
    setEditingId(t.id);
    setEditingValue(t.target);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue(null);
  };

  const saveEdit = (id: string) => {
    if (editingValue == null) return;
    handleValueChange(id, editingValue);
    setEditingId(null);
    setEditingValue(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">설정된 SLO 목록</h2>
          <p className="text-sm text-gray-600 mt-1">저장된 SLO를 토글하고 값을 바로 수정하세요</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{targets.length}</div>
          <div className="text-xs text-gray-500">총 항목</div>
        </div>
      </div>

      {targets.length === 0 ? (
        <div className="p-4 text-sm text-gray-600">저장된 SLO가 없습니다.</div>
      ) : (
        <div className="space-y-4">
          {targets.map((t) => {
            const cfg = metricConfig[t.metric];
            const isEditing = editingId === t.id;
            return (
              <div
                key={t.id}
                className={`border rounded-lg p-4 transition-all duration-150 ${
                  t.enabled ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900">{cfg.name}</div>
                      <div className="text-xs text-gray-500">{cfg.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggle(t.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shrink-0 ${
                        t.enabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={t.enabled}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          t.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>

                    {!isEditing ? (
                      <button
                        onClick={() => startEdit(t)}
                        className="px-3 py-1 rounded-md border border-gray-300 text-xs text-gray-700 font-medium hover:bg-gray-50"
                      >
                        수정
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(t.id)}
                          className="px-3 py-1 rounded-md bg-blue-600 text-xs text-white font-medium hover:bg-blue-700"
                        >
                          저장
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 rounded-md border border-gray-300 text-xs text-gray-700 font-medium hover:bg-gray-50"
                        >
                          취소
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-700">목표값</label>
                      <div className="flex items-baseline gap-2">
                        <input
                          type="number"
                          value={editingValue ?? t.target}
                          onChange={(e) => setEditingValue(parseFloat(e.target.value || '0'))}
                          min={cfg.min}
                          max={cfg.max}
                          step={cfg.step}
                          className="w-20 px-2 py-1 text-sm text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{cfg.unit}</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      value={editingValue ?? t.target}
                      onChange={(e) => setEditingValue(parseFloat(e.target.value || '0'))}
                      min={cfg.min}
                      max={cfg.max}
                      step={cfg.step}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        {cfg.min}
                        {cfg.unit}
                      </span>
                      <span>
                        {cfg.max}
                        {cfg.unit}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
