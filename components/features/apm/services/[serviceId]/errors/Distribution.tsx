// Heatmap placeholder
'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { mockErrorResponse } from './mock';
import { ErrorItem } from './types';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function ErrorDistribution() {
  const { errors } = mockErrorResponse;
  const resources = [...new Set(errors.map((e) => e.resource))];
  const services = [...new Set(errors.map((e) => e.service_name))];

  // Heatmap 데이터
  const data = errors.map((e) => [
    resources.indexOf(e.resource),
    services.indexOf(e.service_name),
    e.count,
  ]);

  const maxCount = Math.max(...errors.map((e) => e.count));

  // Heatmap 옵션
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
    grid: { top: 60, right: 30, bottom: 90, left: 120 },
    xAxis: {
      type: 'category',
      data: resources,
      axisLabel: { color: '#6b7280', fontSize: 11, rotate: 0 },
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
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
      inRange: {
        color: ['#bfdbfe', '#3b82f6', '#1e3a8a'],
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

  // Heatmap 클릭 시 테이블 행 스크롤 & 하이라이트
  const onEvents = {
    click: (params: any) => {
      const service = services[params.value[1]];
      const resource = resources[params.value[0]];
      const rowId = `row-${service}-${resource}`;
      const target = document.getElementById(rowId);

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('bg-yellow-100');
        setTimeout(() => target.classList.remove('bg-yellow-100'), 1500);
      }
    },
  };

  return (
    <div className="space-y-6">
      {/* Heatmap */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Error Distribution</h2>
        <ReactECharts option={option} onEvents={onEvents} style={{ height: 400 }} />
      </div>

      {/* Table (디자인 개선 버전) */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Error List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 w-[40%]">
                  Error Message
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 w-[20%]">Service</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 w-[25%]">
                  Resource
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 w-[10%]">Count</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 w-[10%]">
                  Last Seen
                </th>
              </tr>
            </thead>
            <tbody>
              {errors.map((row) => (
                <tr
                  key={`${row.service_name}-${row.resource}`}
                  id={`row-${row.service_name}-${row.resource}`}
                  className="hover:bg-gray-50 transition-colors border-b"
                >
                  <td className="py-2.5 px-4 text-gray-800 text-sm">{row.error_message}</td>
                  <td className="py-2.5 px-4 text-gray-700 text-sm">{row.service_name}</td>
                  <td className="py-2.5 px-4 text-gray-700 text-sm">{row.resource}</td>
                  <td className="py-2.5 px-4 text-red-600 font-semibold text-sm">{row.count}</td>
                  <td className="py-2.5 px-4 text-gray-500 text-sm">
                    {new Date(row.last_seen).toLocaleTimeString('en-US', {
                      hour12: false,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
