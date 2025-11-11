// Heatmap placeholder

'use client';
import dynamic from 'next/dynamic';
import { mockErrorResponse } from './mock';
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function ErrorDistribution() {
  const { errors } = mockErrorResponse;
  const resources = Array.from(new Set(errors.map((e) => e.resource)));
  const services = Array.from(new Set(errors.map((e) => e.service_name)));

  const data = errors.map((e) => [
    resources.indexOf(e.resource),
    services.indexOf(e.service_name),
    e.count,
  ]);
  const maxCount = Math.max(...errors.map((e) => e.count));

  const option = {
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (params: any) => {
        const service = services[params.value[1]];
        const resource = resources[params.value[0]];
        const count = params.value[2];
        return `<b>${service}</b><br/>${resource}<br/>Count: ${count}`;
      },
    },
    grid: { top: 60, right: 30, bottom: 70, left: 120 },
    xAxis: {
      type: 'category',
      data: resources,
      axisLabel: { color: '#6b7280', rotate: 30, fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: services,
      axisLabel: { color: '#6b7280', fontSize: 12 },
    },
    visualMap: {
      min: 0,
      max: maxCount,
      calculable: true,
      orient: 'vertical',
      right: 10,
      top: 'center',
      inRange: {
        color: ['#2563eb', '#60a5fa', '#facc15', '#ef4444'],
      },
    },
    series: [
      {
        name: 'Error Distribution',
        type: 'heatmap',
        data,
        label: {
          show: true,
          formatter: (p: any) => (p.value[2] > 0 ? p.value[2] : ''),
          color: '#111827',
          fontSize: 10,
        },
      },
    ],
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Error Distribution</h2>
      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
}
