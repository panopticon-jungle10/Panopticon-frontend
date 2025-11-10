'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

// API 응답 타입
interface TraceResponse {
  traces: Trace[];
  total: number;
  page: number;
  limit: number;
}

interface Trace {
  trace_id: string;
  date: string; // ISO 8601 format
  resource: string;
  service: string;
  duration_ms: number;
  method: string;
  status_code: number;
  span_count: number;
  error: boolean;
}

// 차트용 데이터 포인트 타입
interface TracePoint {
  timestamp: string;
  duration: number;
  status: 'success' | 'error';
  traceId: string;
  resource: string;
  service: string;
  statusCode: number;
}

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
    status: trace.error || trace.status_code >= 400 ? 'error' : 'success',
    traceId: trace.trace_id,
    resource: trace.resource,
    service: trace.service,
    statusCode: trace.status_code,
  };
}

export default function TracesSection() {
  const [traces, setTraces] = useState<TracePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // API 호출 함수
  const fetchTraces = async () => {
    try {
      // TODO: 실제 API 엔드포인트로 교체 필요
      // const serviceId = window.location.pathname.split('/').pop();
      // const response = await fetch(`/api/apm/services/${serviceId}/traces?page=1&limit=50`);
      
      // 임시: 더미 데이터 생성 (실제 API 연동 시 제거)
      const mockResponse: TraceResponse = {
        traces: Array.from({ length: 30 }, (_, i) => ({
          trace_id: `trace_${Date.now()}_${i}`,
          date: new Date(Date.now() - Math.random() * 300000).toISOString(),
          resource: [`GET /api/users/${i}`, `POST /api/orders`, `GET /api/products/${i}`][Math.floor(Math.random() * 3)],
          service: ['user-service', 'order-service', 'product-service'][Math.floor(Math.random() * 3)],
          duration_ms: Math.floor(Math.random() * 2000) + 50,
          method: ['GET', 'POST', 'PUT'][Math.floor(Math.random() * 3)],
          status_code: [200, 201, 400, 500][Math.floor(Math.random() * 4)],
          span_count: Math.floor(Math.random() * 10) + 1,
          error: Math.random() > 0.8,
        })),
        total: 1234,
        page: 1,
        limit: 50,
      };

      // 실제 API 사용 시:
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const data: TraceResponse = await response.json();

      const data = mockResponse;
      
      const transformedTraces = data.traces.map(transformTraceToPoint);
      setTraces(transformedTraces);
      setTotalCount(data.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch traces');
      console.error('Error fetching traces:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 초기 데이터 로드 (1회만)
    fetchTraces();
  }, []);

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
  const successTraces = traces.filter((t) => t.status === 'success').map((t) => [t.timestamp, t.duration]);
  const errorTraces = traces.filter((t) => t.status === 'error').map((t) => [t.timestamp, t.duration]);

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
        const trace = traces.filter(t => t.status === status.toLowerCase())[params.dataIndex];
        
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

  if (error) {
    return (
      <div className="bg-white p-5 rounded-lg border border-gray-200">
        <div className="text-center text-red-500 py-8">
          <p className="font-semibold mb-2">Error loading traces</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading && traces.length === 0) {
    return (
      <div className="bg-white p-5 rounded-lg border border-gray-200">
        <div className="text-center text-gray-500 py-8">
          Loading traces...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
      <ReactECharts option={option} style={{ height: 400 }} />
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>
          Showing {traces.length} traces of {totalCount.toLocaleString()} total
        </div>
      </div>
    </div>
  );
}