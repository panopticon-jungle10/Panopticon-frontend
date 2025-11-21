/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface EndpointItem {
  endpoint_name: string;
  request_count?: number;
  latency_p95_ms?: number;
  error_rate?: number;
  color?: string; // Pie에서 전달한 색상 (옵션)
}

interface Props {
  items: EndpointItem[];
  selectedMetric: 'requests' | 'error_rate' | 'latency';
  height?: number;
  onBarClick?: (endpointName: string) => void;
  colors?: string[]; // 팔레트 (옵션) - 없으면 기본 팔레트 사용
}

export default function EndpointBarChart({
  items,
  selectedMetric,
  height = 350,
  onBarClick,
  colors,
}: Props) {
  const option = useMemo(() => {
    if (!items?.length) return null;

    const palette = colors && colors.length > 0 ? colors : undefined;

    const values = items.map((ep, idx) => {
      let v = 0;
      if (selectedMetric === 'requests') v = ep.request_count ?? 0;
      if (selectedMetric === 'latency') v = Number((ep.latency_p95_ms ?? 0).toFixed(2));
      if (selectedMetric === 'error_rate') v = Math.round((ep.error_rate ?? 0) * 100);

      const color = ep.color ?? (palette ? palette[idx % palette.length] : undefined);

      return {
        value: v,
        name: ep.endpoint_name,
        itemStyle: color ? { color } : undefined, // Pie와 동일색 또는 팔레트/기본색
      };
    });

    return {
      backgroundColor: 'transparent',

      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.85)',
        borderColor: 'transparent',
        textStyle: { color: '#fff' },
        formatter: (params: any) => {
          const p = params[0];
          if (selectedMetric === 'latency') return `${p.name}<br/>${p.value.toFixed(2)} ms`;
          return `${p.name}<br/>${p.value}`;
        },
      },

      grid: { left: 40, right: 20, top: 30, bottom: 40 },

      // 가로막대: x축 = category, y축 = value
      xAxis: {
        type: 'category',
        data: items.map((i) => i.endpoint_name),
        axisLabel: { color: '#6b7280', fontSize: 11 },
      },

      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#6b7280',
          fontSize: 11,
          formatter: (val: number) => {
            if (selectedMetric === 'latency') return `${val.toFixed(0)}ms`;
            return val.toLocaleString();
          },
        },
      },

      series: [
        {
          type: 'bar',
          barWidth: '45%',
          data: values,

          // 가로 막대라 값 위치는 top
          label: {
            show: true,
            position: 'top',
            fontSize: 14,
            fontWeight: 600,
            color: '#374151',
            formatter: (params: any) => {
              const v = params.value;
              if (selectedMetric === 'latency') return `${v.toFixed(2)} ms`;
              return v;
            },
          },

          itemStyle: {
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    };
  }, [items, selectedMetric, colors]);

  const events = {
    click: (params: any) => {
      if (params?.name && onBarClick) onBarClick(params.name);
    },
  };

  if (!option) {
    return (
      <div className="h-[350px] flex items-center justify-center text-sm text-gray-500">
        차트 데이터를 불러오는 중입니다
      </div>
    );
  }

  return <ReactECharts option={option} style={{ height }} onEvents={events} />;
}
