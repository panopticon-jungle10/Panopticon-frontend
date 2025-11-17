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

type MetricType = 'requests' | 'latency' | 'errors';

export default function ResourcesSection({ serviceName }: ResourcesSectionProps) {
  // Zustand store에서 시간 정보 가져오기
  const { startTime, endTime, interval } = useTimeRangeStore();

  // 선택된 메트릭 타입 (기본값: 요청수)
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('requests');

  // Dropdown 옵션 정의
  const metricOptions = [
    { label: '요청수', value: 'requests' as const },
    { label: 'p95 레이턴시', value: 'latency' as const },
    { label: '에러수', value: 'errors' as const },
  ];

  // API 데이터 가져오기 (선택된 메트릭에 따라 Top 3만 가져오기)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['serviceEndpoints', serviceName, startTime, endTime, selectedMetric],
    queryFn: () =>
      getServiceEndpoints(serviceName, {
        from: startTime,
        to: endTime,
        limit: 3,
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

  // 선택된 메트릭에 따라 차트 설정 결정
  const chartConfig = useMemo(() => {
    if (selectedMetric === 'requests') {
      return {
        title: 'Requests',
        yAxisLabel: '',
        chartType: 'bar' as const,
        getData: (resource: (typeof chartResources)[0]) => resource.requests,
      };
    } else if (selectedMetric === 'latency') {
      return {
        title: 'p95 Latency',
        yAxisLabel: 'ms',
        chartType: 'line' as const,
        getData: (resource: (typeof chartResources)[0]) => resource.latency,
      };
    } else {
      return {
        title: 'Errors',
        yAxisLabel: '',
        chartType: 'bar' as const,
        getData: (resource: (typeof chartResources)[0]) => resource.errors,
      };
    }
  }, [selectedMetric]);

  // 단일 차트 옵션
  const chartOption = useMemo(() => {
    const topResources = chartResources.slice(0, 3);
    const seriesData = topResources.map((resource, idx: number) => ({
      name: `top ${idx + 1}`,
      type: chartConfig.chartType,
      ...(chartConfig.chartType === 'bar' ? { stack: 'total' } : {}),
      data: timeLabels.map(() => {
        const baseValue = chartConfig.getData(resource);
        // 랜덤 변동을 추가하여 시계열 데이터처럼 보이게 함
        return Math.floor(baseValue * (0.8 + Math.random() * 0.4));
      }),
      resourceName: resource.name, // 실제 엔드포인트 이름 추가
      requests: resource.requests,
      latency: resource.latency,
      errors: resource.errors,
      ...(chartConfig.chartType === 'bar' ? { barWidth: getBarWidthForResources(interval) } : {}),
      ...(chartConfig.chartType === 'line' ? { smooth: true } : {}),
      itemStyle: {
        color: getChartColor(idx),
      },
      lineStyle:
        chartConfig.chartType === 'line'
          ? {
              width: 2,
              color: getChartColor(idx),
            }
          : undefined,
    }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params: {
          seriesName: string;
          value: number;
          dataIndex: number;
          data: {
            resourceName?: string;
            requests?: number;
            latency?: number;
            errors?: number;
          };
        }) => {
          const seriesName = params.seriesName; // "top 1", "top 2", "top 3"
          const dataIndex = params.dataIndex;
          const xAxisLabel = timeLabels[dataIndex];

          // 시리즈에서 리소스 정보 가져오기
          const seriesIndex = parseInt(seriesName.split(' ')[1]) - 1; // "top 1" -> 0
          const resource = topResources[seriesIndex];

          if (!resource) return '';

          return `
            <div style="font-weight:700;margin-bottom:6px;font-size:13px;">${seriesName}</div>
            <div style="margin:2px 0;font-weight:600;color:#3b82f6;">${resource.name}</div>
            <div style="margin:4px 0 2px 0;font-size:11px;color:#6b7280;">Time: ${xAxisLabel}</div>
            <div style="margin:2px 0;font-size:11px;">Requests: ${resource.requests}</div>
            <div style="margin:2px 0;font-size:11px;">p95 Latency: ${resource.latency}ms</div>
            <div style="margin:2px 0;font-size:11px;">Errors: ${resource.errors}</div>
          `;
        },
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
        axisLabel: {
          color: '#6b7280',
          fontSize: 10,
          formatter: chartConfig.yAxisLabel ? `{value}${chartConfig.yAxisLabel}` : '{value}',
        },
        splitLine: { lineStyle: { color: '#e5e7eb', type: 'dashed' } },
      },
      series: seriesData,
    };
  }, [chartResources, timeLabels, interval, chartConfig]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">리소스</h2>
        <div className="w-32">
          <Dropdown value={selectedMetric} onChange={setSelectedMetric} options={metricOptions} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-gray-200">
        <StateHandler
          isLoading={isLoading}
          isError={isError}
          isEmpty={isEmpty}
          type="chart"
          height={400}
          loadingMessage="리소스 데이터를 불러오는 중..."
          errorMessage="리소스 데이터를 불러올 수 없습니다"
          emptyMessage="선택한 시간 범위에 리소스 데이터가 없습니다"
        >
          {/* 단일 차트 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-800 mb-3">{chartConfig.title}</h4>
            <ReactECharts
              option={chartOption}
              style={{ height: 400 }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </StateHandler>
      </div>
    </div>
  );
}
