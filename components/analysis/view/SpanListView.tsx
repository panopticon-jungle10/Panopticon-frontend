'use client';
import React from 'react';
import type { SpanItem } from '@/types/apm';

interface SpanListViewProps {
  spans: SpanItem[];
  onSpanSelect: (id: string | null) => void;
  selectedSpanId: string | null;
}

export default function SpanListView({ spans, onSpanSelect, selectedSpanId }: SpanListViewProps) {
  if (!spans || spans.length === 0) {
    return <div className="text-sm text-gray-500">스팬 데이터가 없습니다</div>;
  }

  return (
    <div className="space-y-2">
      <div className="divide-y divide-gray-100 rounded-md border border-gray-50 overflow-hidden">
        {spans.map((s) => (
          <div
            key={s.span_id}
            onClick={() => onSpanSelect(s.span_id)}
            className={`p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
              selectedSpanId === s.span_id ? 'bg-blue-50' : ''
            }`}
          >
            <div>
              <div className="text-sm font-medium text-gray-900">{s.name}</div>
              <div className="text-xs text-gray-500 font-mono">
                {new Date(s.timestamp).toLocaleString()}
              </div>
            </div>
            <div className="text-sm text-gray-600">{(s.duration_ms ?? 0).toFixed(2)} ms</div>
          </div>
        ))}
      </div>
    </div>
  );
}
