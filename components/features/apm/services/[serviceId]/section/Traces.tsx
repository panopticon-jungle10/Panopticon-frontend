'use client';
import Table from '@/components/ui/Table';
import Pagination from '@/components/features/apm/services/Pagination';
import PageSizeSelect from '@/components/features/apm/services/PageSizeSelect';
import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServiceTraces } from '@/src/api/apm';
import { Trace } from '@/types/apm';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface TracesSectionProps {
  serviceName: string;
}

// 차트용 데이터 포인트 타입
interface TracePoint {
  timestamp: string;
  duration: number;
  latencyBreakdown: number; // LATENCY BREAKDOWN 컬럼용 (duration과 동일한 값)
  status: 'success' | 'error';
  traceId: string;
  resource: string;
  service: string;
  statusCode: number;
}

// 테이블 컬럼 정의
const TRACE_TABLE_COLUMNS: Array<{
  key: keyof TracePoint;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: TracePoint[keyof TracePoint], row: TracePoint) => React.ReactNode;
}> = [
  {
    key: 'timestamp',
    header: 'DATE',
    width: '15%',
  },
  {
    key: 'resource',
    header: 'RESOURCE',
    width: '25%',
  },
  {
    key: 'service',
    header: 'SERVICE',
    width: '15%',
    render: (value: TracePoint[keyof TracePoint]) => (
      <div className="flex items-center">
        <span>{String(value)}</span>
      </div>
    ),
  },
  {
    key: 'duration',
    header: 'DURATION',
    width: '10%',
    render: (value: TracePoint[keyof TracePoint]) => {
      const ms = Number(value);
      if (ms >= 1000) {
        return `${(ms / 1000).toFixed(2)}s`;
      }
      return `${ms}ms`;
    },
  },
  {
    key: 'statusCode',
    header: 'STATUS CODE',
    width: '10%',
    render: (value: TracePoint[keyof TracePoint], row: TracePoint) => {
      const code = Number(value);
      const isError = row.status === 'error';
      return (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {code}
        </span>
      );
    },
  },
  {
    key: 'latencyBreakdown',
    header: 'LATENCY BREAKDOWN',
    width: '25%',
    sortable: false,
    render: (value: TracePoint[keyof TracePoint]) => {
      const duration = Number(value);
      const maxDuration = 2000;
      const percentage = Math.min((duration / maxDuration) * 100, 100);

      return (
        <div className="w-full bg-gray-100 h-4 rounded overflow-hidden">
          <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
        </div>
      );
    },
  },
];

// Trace를 TracePoint로 변환
function transformTraceToPoint(trace: Trace): TracePoint {
  const date = new Date(trace.date);
  return {
    timestamp: date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    duration: trace.duration_ms,
    latencyBreakdown: trace.duration_ms, // duration과 동일한 값
    status: trace.error || trace.status_code >= 400 ? 'error' : 'success',
    traceId: trace.trace_id,
    resource: trace.resource,
    service: trace.service,
    statusCode: trace.status_code,
  };
}

export default function TracesSection({ serviceName }: TracesSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30); // 한 페이지에 보여줄 항목 수

  // API 데이터 가져오기
  const { data, isLoading, error } = useQuery({
    queryKey: ['serviceTraces', serviceName, currentPage, itemsPerPage],
    queryFn: () => getServiceTraces(serviceName, { page: currentPage, limit: itemsPerPage }),
  });

  // 데이터 변환
  const traces = useMemo(() => {
    if (!data?.traces) return [];
    let transformedTraces = data.traces.map(transformTraceToPoint);
    // error=true가 먼저 오도록 정렬
    transformedTraces = transformedTraces.sort((a: TracePoint, b: TracePoint) => {
      if (a.status === b.status) return 0;
      return a.status === 'error' ? -1 : 1;
    });
    return transformedTraces;
  }, [data]);

  const totalCount = data?.total || 0;

  // 상태별 색상 매핑
  const getColorByStatus = (status: string) => {
    switch (status) {
      case 'success':
        return '#10b981'; // green
      case 'error':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  // 상태별로 데이터 분리
  const successTraces = traces
    .filter((t: TracePoint) => t.status === 'success')
    .map((t: TracePoint) => [t.timestamp, t.duration]);
  const errorTraces = traces
    .filter((t: TracePoint) => t.status === 'error')
    .map((t: TracePoint) => [t.timestamp, t.duration]);

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: 60,
      right: 20,
      top: 60,
      bottom: 60,
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        color: '#6b7280',
        fontSize: 11,
        rotate: 45,
        interval: 'auto',
        hideOverlap: true,
      },
      axisLine: { show: true, lineStyle: { color: '#9ca3af', width: 1 } },
      axisTick: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      name: 'Duration (ms)',
      nameLocation: 'middle',
      nameGap: 45,
      nameTextStyle: { color: '#6b7280', fontSize: 12 },
      axisLabel: { color: '#6b7280', fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#e5e7eb', type: 'dashed' } },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderColor: 'transparent',
      textStyle: { color: '#f9fafb', fontSize: 12 },
      padding: 8,
      formatter: (params: { value: [string, number]; seriesName: string; dataIndex: number }) => {
        const [time, duration] = params.value;
        const status = params.seriesName;
        const trace = traces.filter((t: TracePoint) => t.status === status.toLowerCase())[params.dataIndex];

        if (!trace) return '';

        return `
          <div style="font-weight:600;margin-bottom:4px;">${status}</div>
          <div style="margin:2px 0;">Trace ID: ${trace.traceId}</div>
          <div style="margin:2px 0;">Service: ${trace.service}</div>
          <div style="margin:2px 0;">Resource: ${trace.resource}</div>
          <div style="margin:2px 0;">Time: ${time}</div>
          <div style="margin:2px 0;">Duration: ${duration} ms</div>
          <div style="margin:2px 0;">Status: ${trace.statusCode}</div>
        `;
      },
    },
    legend: {
      bottom: 0,
      data: ['Success', 'Error'],
      icon: 'circle',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 15,
      textStyle: { color: '#6b7280', fontSize: 11 },
    },
    series: [
      {
        name: 'Success',
        type: 'scatter',
        data: successTraces,
        symbolSize: 8,
        itemStyle: {
          color: getColorByStatus('success'),
          opacity: 0.7,
        },
        emphasis: {
          itemStyle: {
            color: getColorByStatus('success'),
            opacity: 1,
            borderColor: '#fff',
            borderWidth: 2,
          },
        },
      },
      {
        name: 'Error',
        type: 'effectScatter',
        data: errorTraces,
        symbolSize: 10,
        itemStyle: {
          color: getColorByStatus('error'),
        },
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
          period: 4,
        },
        emphasis: {
          itemStyle: {
            color: getColorByStatus('error'),
            opacity: 1,
            borderColor: '#fff',
            borderWidth: 2,
          },
        },
      },
    ],
  };

  // 페이지 계산
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로 리셋
  };

  // 페이지네이션 핸들러
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (error) {
    return (
      <div className="bg-white p-5 rounded-lg border border-gray-200">
        <div className="text-center text-red-500 py-8">
          <p className="font-semibold mb-2">Error loading traces</p>
          <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  if (isLoading && traces.length === 0) {
    return (
      <div className="bg-white p-5 rounded-lg border border-gray-200">
        <div className="text-center text-gray-500 py-8">Loading traces...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
      {/* 차트 */}
      <ReactECharts option={option} style={{ height: 400 }} />
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <PageSizeSelect
          value={itemsPerPage}
          onChange={handlePageSizeChange}
          options={[10, 30, 50]}
        />
      </div>

      {/* 테이블 */}
      <div className="mt-6">
        <Table<TracePoint> columns={TRACE_TABLE_COLUMNS} data={traces} className="w-full" />
      </div>

      {/* 페이지네이션 */}
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />
    </div>
  );
}
