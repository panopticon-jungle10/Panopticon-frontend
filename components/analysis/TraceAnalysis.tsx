'use client';

import { IoClose } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTraceById } from '@/src/api/apm';
import StateHandler from '@/components/ui/StateHandler';
import FlameGraph from './FlameGraph';
import WaterfallChart from './WaterfallChart';

/**
 * Trace Analysis Component : Slide-over Panel 방식(모달 X)
 */
interface TraceAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  traceId: string;
}

type ViewMode = 'flamegraph' | 'waterfall';

export default function TraceAnalysis({ isOpen, onClose, traceId }: TraceAnalysisProps) {
  // traceId를 key로 사용하여 상태 초기화
  const [viewMode, setViewMode] = useState<ViewMode>('flamegraph');

  // Trace 데이터 가져오기
  const { data, isLoading, isError } = useQuery({
    queryKey: ['trace', traceId],
    queryFn: () => getTraceById(traceId),
    enabled: isOpen && !!traceId,
  });

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 패널이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Trace Analysis</h2>
            <p className="text-sm text-gray-500 mt-1">Trace ID: {traceId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors hover:cursor-pointer"
            aria-label="Close panel"
          >
            <IoClose className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors hover:cursor-pointer ${
              viewMode === 'flamegraph'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setViewMode('flamegraph')}
          >
            Flame Graph
          </button>
          <button
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors hover:cursor-pointer ${
              viewMode === 'waterfall'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setViewMode('waterfall')}
          >
            Waterfall
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-129px)] overflow-y-auto">
          <StateHandler
            isLoading={isLoading}
            isError={isError}
            isEmpty={!data?.spans || data.spans.length === 0}
            type="chart"
            loadingMessage="트레이스 데이터를 불러오는 중..."
            errorMessage="트레이스 데이터를 불러올 수 없습니다"
            emptyMessage="트레이스에 스팬 데이터가 없습니다"
          >
            <div className="p-6">
              {viewMode === 'flamegraph' ? (
                <FlameGraph spans={data?.spans || []} />
              ) : (
                <WaterfallChart spans={data?.spans || []} />
              )}
            </div>
          </StateHandler>
        </div>
      </div>
    </>
  );
}
