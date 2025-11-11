// Dynamic Scatter Overlay (ECharts)

'use client';
import dynamic from 'next/dynamic';
import { mockErrorTrendData } from './mock';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function ErrorTrendChart() {
  // 급격한 에러 증가 감지 포인트
  const criticalPoints = mockErrorTrendData.flatMap((s) =>
    s.data
      .filter((p, i) => i > 1 && p.count > s.data[i - 1].count * 1.4)
      .map((p) => ({
        service: s.service,
        color: s.color,
        timestamp: p.timestamp,
        count: p.count,
      })),
  );

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: { color: '#f9fafb', fontSize: 12 },
      borderColor: 'transparent',
      formatter: (params: any) =>
        params
          .map(
            (p: any) =>
              `<div><b style="color:${p.color}">${p.seriesName}</b>: ${p.value[1]} errors</div>`,
          )
          .join(''),
    },
    legend: {
      bottom: 0,
      data: mockErrorTrendData.map((s) => s.service),
      textStyle: { color: '#6b7280' },
    },
    grid: { left: 60, right: 30, top: 40, bottom: 60 },

    // xAxis를 'time' 타입으로
    xAxis: {
      type: 'time',
      axisLabel: {
        color: '#9ca3af',
        fontSize: 11,
        formatter: (value: string) =>
          new Date(value).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
      },
      splitLine: { show: false },
    },

    yAxis: {
      type: 'value',
      name: 'Error Count',
      nameTextStyle: { color: '#6b7280' },
      splitLine: { lineStyle: { color: '#e5e7eb', type: 'dashed' } },
    },

    series: [
      ...mockErrorTrendData.map((s) => ({
        name: s.service,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: s.color, width: 2 },
        data: s.data.map((p) => [p.timestamp, p.count]),
      })),
      {
        name: 'Critical Spikes',
        type: 'effectScatter',
        data: criticalPoints.map((p) => [p.timestamp, p.count]),
        symbolSize: (val: any) => Math.min(val[1] / 30, 18),
        itemStyle: { color: '#ef4444' },
        rippleEffect: { scale: 3, brushType: 'stroke' },
      },
    ],
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Error Trend</h2>
      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
}
