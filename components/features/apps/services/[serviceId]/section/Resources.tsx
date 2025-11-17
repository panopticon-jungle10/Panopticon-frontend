'use client';

import { useMemo, useState } from 'react';
import Dropdown from '@/components/ui/Dropdown';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { getServiceEndpoints } from '@/src/api/apm';
import { useTimeRangeStore } from '@/src/store/timeRangeStore';
import StateHandler from '@/components/ui/StateHandler';
import {
  formatChartTimeLabel,
  getBarWidthForResources,
  getXAxisIntervalForResources,
} from '@/src/utils/chartFormatter';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface ResourcesSectionProps {
  serviceName: string;
}

// 차트 색상 팔레트
const CHART_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
];

// 색상 선택 함수
function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

export default function ResourcesSection({ serviceName }: ResourcesSectionProps) {
  // Zustand store에서 시간 정보 가져오기
  const { startTime, endTime, interval } = useTimeRangeStore();

  // Top N 상태 (모든 차트에 공통으로 적용)
  const [topN, setTopN] = useState<1 | 2 | 3 | 4 | 5>(3);

  // Dropdown 옵션 정의
  const topNOptions = [
    { label: 'Top 1', value: 1 as const },
    { label: 'Top 2', value: 2 as const },
    { label: 'Top 3', value: 3 as const },
    { label: 'Top 4', value: 4 as const },
    { label: 'Top 5', value: 5 as const },
  ];

  // API 데이터 가져오기
  const { data, isLoading, isError } = useQuery({
    queryKey: ['serviceEndpoints', serviceName, startTime, endTime],
    queryFn: () =>
      getServiceEndpoints(serviceName, {
        from: startTime,
        to: endTime,
        limit: 100,
      }),
    retry: false,
    throwOnError: false,
  });

  // 차트용 데이터 변환
  const chartResources = useMemo(() => {
    if (!data?.endpoints) return [];
    return data.endpoints.map((endpoint) => ({
      name: endpoint.endpoint_name,
      requests: endpoint.request_count,
      latency: endpoint.latency_p95_ms,
      errors: Math.round(endpoint.request_count * endpoint.error_rate),
    }));
  }, [data]);

  const isEmpty = chartResources.length === 0;

  // 시간대 레이블 생성 (interval에 따라 동적으로 생성)
  const timeLabels = useMemo(() => {
    const labels: string[] = [];
    const now = new Date();

    // interval에 따른 라벨 개수 결정
    let labelCount = 24; // 기본값
    if (['5m', '10m'].includes(interval)) {
      labelCount = 12; // 짧은 간격: 12개 라벨
    } else if (['30m', '1h'].includes(interval)) {
      labelCount = 12;
    } else if (['2h', '12h'].includes(interval)) {
      labelCount = 8;
    } else if (['1d', '2d'].includes(interval)) {
      labelCount = 6;
    }

    // 시간 레이블 생성
    const timeStep = Math.ceil(24 / labelCount);
    for (let i = 23; i >= 0; i--) {
      if ((23 - i) % timeStep === 0) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        labels.push(formatChartTimeLabel(time, interval));
      }
    }
    return labels;
  }, [interval]);

  // Requests 차트 옵션
  const requestsChartOption = useMemo(() => {
    const topResources = chartResources.slice(0, topN);
    const seriesData = topResources.map((resource, idx: number) => ({
      name: resource.name,
      type: 'bar' as const,
      stack: 'total',
      data: timeLabels.map(() => Math.floor(Math.random() * 1000) + 100),
      barWidth: getBarWidthForResources(interval),
      itemStyle: {
        color: getChartColor(idx),
      },
    }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        bottom: 0,
        textStyle: { fontSize: 10 },
      },
      grid: { left: 60, right: 20, top: 20, bottom: 100 },
      xAxis: {
        type: 'category',
        data: timeLabels,
        axisLabel: {
          color: '#6b7280',
          fontSize: 10,
          interval: getXAxisIntervalForResources(interval, timeLabels.length),
          rotate: 45,
        },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#6b7280', fontSize: 10 },
        splitLine: { lineStyle: { color: '#e5e7eb', type: 'dashed' } },
      },
      series: seriesData,
    };
  }, [chartResources, topN, timeLabels, interval]);

  // p95 Latency 차트 옵션
  const latencyChartOption = useMemo(() => {
    const topResources = chartResources.slice(0, topN);
    const seriesData = topResources.map((resource, idx: number) => ({
      name: resource.name,
      type: 'line' as const,
      data: timeLabels.map(() => Math.floor(Math.random() * 500) + 50),
      smooth: true,
      lineStyle: {
        width: 2,
        color: getChartColor(idx),
      },
      itemStyle: {
        color: getChartColor(idx),
      },
    }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: 0,
        textStyle: { fontSize: 10 },
      },
      grid: { left: 60, right: 20, top: 20, bottom: 100 },
      xAxis: {
        type: 'category',
        data: timeLabels,
        axisLabel: {
          color: '#6b7280',
          fontSize: 10,
          interval: getXAxisIntervalForResources(interval, timeLabels.length),
          rotate: 45,
        },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#6b7280', fontSize: 10, formatter: '{value}ms' },
        splitLine: { lineStyle: { color: '#e5e7eb', type: 'dashed' } },
      },
      series: seriesData,
    };
  }, [chartResources, topN, timeLabels, interval]);

  // Errors 차트 옵션
  const errorsChartOption = useMemo(() => {
    const topResources = chartResources.slice(0, topN);
    const seriesData = topResources.map((resource, idx: number) => ({
      name: resource.name,
      type: 'bar' as const,
      stack: 'total',
      data: timeLabels.map(() => Math.floor(Math.random() * 50)),
      barWidth: getBarWidthForResources(interval),
      itemStyle: {
        color: getChartColor(idx),
      },
    }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        bottom: 0,
        textStyle: { fontSize: 10 },
      },
      grid: { left: 60, right: 20, top: 20, bottom: 100 },
      xAxis: {
        type: 'category',
        data: timeLabels,
        axisLabel: {
          color: '#6b7280',
          fontSize: 10,
          interval: getXAxisIntervalForResources(interval, timeLabels.length),
          rotate: 45,
        },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#6b7280', fontSize: 10 },
        splitLine: { lineStyle: { color: '#e5e7eb', type: 'dashed' } },
      },
      series: seriesData,
    };
  }, [chartResources, topN, timeLabels, interval]);

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
      <StateHandler
        isLoading={isLoading}
        isError={isError}
        isEmpty={isEmpty}
        type="chart"
        height={800}
        loadingMessage="리소스 데이터를 불러오는 중..."
        errorMessage="리소스 데이터를 불러올 수 없습니다"
        emptyMessage="선택한 시간 범위에 리소스 데이터가 없습니다"
      >
        {/* 상단 컨트롤 */}
        <div className="flex justify-end items-center mb-6">
          <Dropdown value={topN} onChange={setTopN} options={topNOptions} />
        </div>

        {/* 차트 영역 - 3행 1열 */}
        <div className="space-y-6">
          {/* Requests 차트 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Requests</h4>
            <ReactECharts
              option={requestsChartOption}
              style={{ height: 300 }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>

          {/* p95 Latency 차트 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-800 mb-3">p95 Latency</h4>
            <ReactECharts
              option={latencyChartOption}
              style={{ height: 300 }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>

          {/* Errors 차트 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Errors</h4>
            <ReactECharts
              option={errorsChartOption}
              style={{ height: 300 }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </div>
      </StateHandler>
    </div>
  );
}
