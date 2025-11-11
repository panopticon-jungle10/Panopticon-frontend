'use client';
import dynamic from 'next/dynamic';
import * as echarts from 'echarts';
import { mockErrorTrendData } from './mock';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface TrendParam {
  color: string;
  seriesName: string;
  value: [string, number];
}

export default function ErrorTrendChart() {
  /* 급격한 에러 증가 감지 포인트 */
  const criticalPoints = mockErrorTrendData.flatMap((s) =>
    s.data
      .filter((p, i) => i > 1 && p.count > s.data[i - 1].count * 1.4) //  에러 수 이전 지점보다 1.4배 이상 증가
      .map((p) => ({
        service: s.service,
        color: s.color,
        timestamp: p.timestamp,
        count: p.count,
      })),
  );

  /* ECharts 그래프 전체 설정 */
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: { color: '#f9fafb', fontSize: 12 },
      borderColor: 'transparent',
      formatter: (params: TrendParam[]) =>
        params
          .map(
            (p) =>
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

    /* 데이터 그래프 본체 */
    series: [
      ...mockErrorTrendData.map((s) => ({
        name: s.service,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: s.color },
        areaStyle: {
          opacity: 0.25,
          color: new (require('echarts').graphic.LinearGradient)(0, 0, 0, 1, [
            { offset: 0, color: s.color },
            { offset: 1, color: 'rgba(255,255,255,0)' },
          ]),
        },
        emphasis: { focus: 'series' },
        data: s.data.map((p) => [p.timestamp, p.count]),
        z: 2,
      })),

      /* Critical Spikes */
      {
        name: 'Critical Spikes',
        type: 'effectScatter',
        data: criticalPoints.map((p) => [p.timestamp, p.count]),
        symbolSize: (val: [string, number]) => Math.min(val[1] / 30, 18),
        itemStyle: { color: '#ef4444' },
        rippleEffect: { scale: 3, brushType: 'stroke' },
        z: 5,
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
