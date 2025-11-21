/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useTimeRangeStore } from '@/src/store/timeRangeStore';
import { TIME_RANGE_DURATION_MS } from '@/src/utils/timeRange';
import StateHandler from '@/components/ui/StateHandler';
import MetricIntervalPanel from './MetricIntervalPanel';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface Props {
  requestsOption: any;
  errorRateOption: any;
  latencyOption: any;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  chartData?: any;
  serviceName: string;
}

export default function OverviewCharts({
  requestsOption,
  errorRateOption,
  latencyOption,
  isLoading,
  isError,
  isEmpty,
  chartData,
  serviceName,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (key: string) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
  };

  const selectedCount = selected.length;
  // interval panel 상태
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelRange, setPanelRange] = useState<{ start: number; end: number } | null>(null);

  const { timeRange } = useTimeRangeStore();

  const openIntervalAround = (timestamp: number) => {
    const tsNum = Number(timestamp);
    if (Number.isNaN(tsNum)) return;
    const totalRangeMs = TIME_RANGE_DURATION_MS[timeRange];
    // expand window proportional to overall time range (1/6), clamp between 2.5min and 7 days
    const minWindow = 2.5 * 60 * 1000; // 2.5 minutes
    const maxWindow = 7 * 24 * 60 * 60 * 1000; // 7 days
    const windowMs = Math.max(minWindow, Math.min(totalRangeMs / 6, maxWindow));
    const start = tsNum - windowMs / 2;
    const end = tsNum + windowMs / 2;
    setPanelRange({ start, end });
    setPanelOpen(true);
  };

  const renderChartByKey = (key: string) => {
    if (key === 'requests')
      return (
        <ReactECharts
          option={requestsOption}
          style={{ height: selectedCount === 1 ? 420 : 320 }}
          notMerge={true}
          onEvents={{
            click: (params: any) => {
              const ts =
                (params?.value && (Array.isArray(params.value) ? params.value[0] : params.value)) ||
                (params?.data && (Array.isArray(params.data) ? params.data[0] : params.data));
              openIntervalAround(ts);
            },
          }}
        />
      );
    if (key === 'errorRate')
      return (
        <ReactECharts
          option={errorRateOption}
          style={{ height: selectedCount === 1 ? 420 : 320 }}
          notMerge={true}
          onEvents={{
            click: (params: any) => {
              const ts =
                (params?.value && (Array.isArray(params.value) ? params.value[0] : params.value)) ||
                (params?.data && (Array.isArray(params.data) ? params.data[0] : params.data));
              openIntervalAround(ts);
            },
          }}
        />
      );
    if (key === 'latency')
      return (
        <ReactECharts
          option={latencyOption}
          style={{ height: selectedCount === 1 ? 420 : 320 }}
          notMerge={true}
          onEvents={{
            click: (params: any) => {
              const ts =
                (params?.value && (Array.isArray(params.value) ? params.value[0] : params.value)) ||
                (params?.data && (Array.isArray(params.data) ? params.data[0] : params.data));
              openIntervalAround(ts);
            },
          }}
        />
      );
    return null;
  };

  const renderLayout = () => {
    switch (selectedCount) {
      case 1:
        return (
          <div className="mt-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <StateHandler
                isLoading={isLoading}
                isError={isError}
                isEmpty={isEmpty}
                type="chart"
                height={420}
                loadingMessage="메트릭을 불러오는 중..."
                emptyMessage="표시할 메트릭 데이터가 없습니다"
              >
                {renderChartByKey(selected[0])}
              </StateHandler>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {selected.map((k) => (
              <div key={k} className="bg-white p-4 rounded-lg border border-gray-200">
                <StateHandler
                  isLoading={isLoading}
                  isError={isError}
                  isEmpty={isEmpty}
                  type="chart"
                  height={320}
                  loadingMessage="메트릭을 불러오는 중..."
                  emptyMessage="표시할 메트릭 데이터가 없습니다"
                >
                  {renderChartByKey(k)}
                </StateHandler>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <StateHandler
                isLoading={isLoading}
                isError={isError}
                isEmpty={isEmpty}
                type="chart"
                height={250}
                loadingMessage="메트릭을 불러오는 중..."
                emptyMessage="표시할 메트릭 데이터가 없습니다"
              >
                <ReactECharts
                  option={requestsOption}
                  style={{ height: 250 }}
                  notMerge={true}
                  onEvents={{
                    click: (params: any) => {
                      const ts =
                        (params?.value &&
                          (Array.isArray(params.value) ? params.value[0] : params.value)) ||
                        (params?.data &&
                          (Array.isArray(params.data) ? params.data[0] : params.data));
                      openIntervalAround(ts);
                    },
                  }}
                />
              </StateHandler>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <StateHandler
                isLoading={isLoading}
                isError={isError}
                isEmpty={isEmpty}
                type="chart"
                height={250}
                loadingMessage="메트릭을 불러오는 중..."
                emptyMessage="표시할 에러율 데이터가 없습니다"
              >
                <ReactECharts
                  option={errorRateOption}
                  style={{ height: 250 }}
                  notMerge={true}
                  onEvents={{
                    click: (params: any) => {
                      const ts =
                        (params?.value &&
                          (Array.isArray(params.value) ? params.value[0] : params.value)) ||
                        (params?.data &&
                          (Array.isArray(params.data) ? params.data[0] : params.data));
                      openIntervalAround(ts);
                    },
                  }}
                />
              </StateHandler>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <StateHandler
                isLoading={isLoading}
                isError={isError}
                isEmpty={isEmpty}
                type="chart"
                height={250}
                loadingMessage="레이턴시 데이터를 불러오는 중..."
                emptyMessage="표시할 레이턴시 데이터가 없습니다"
              >
                <ReactECharts
                  option={latencyOption}
                  style={{ height: 250 }}
                  notMerge={true}
                  onEvents={{
                    click: (params: any) => {
                      const ts =
                        (params?.value &&
                          (Array.isArray(params.value) ? params.value[0] : params.value)) ||
                        (params?.data &&
                          (Array.isArray(params.data) ? params.data[0] : params.data));
                      openIntervalAround(ts);
                    },
                  }}
                />
              </StateHandler>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={() => toggle('requests')}
          className={`px-3 py-1 rounded-md text-sm font-medium border ${
            selected.includes('requests')
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-200'
          }`}
        >
          요청수
        </button>
        <button
          onClick={() => toggle('errorRate')}
          className={`px-3 py-1 rounded-md text-sm font-medium border ${
            selected.includes('errorRate')
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-200'
          }`}
        >
          에러율
        </button>
        <button
          onClick={() => toggle('latency')}
          className={`px-3 py-1 rounded-md text-sm font-medium border ${
            selected.includes('latency')
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-200'
          }`}
        >
          레이턴시
        </button>
      </div>

      {renderLayout()}
      <MetricIntervalPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        start={panelRange?.start ?? 0}
        end={panelRange?.end ?? 0}
        chartData={chartData}
        serviceName={serviceName}
      />
    </div>
  );
}
