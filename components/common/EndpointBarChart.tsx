'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface EndpointItem {
  endpoint_name: string;
  request_count?: number;
  latency_p95_ms?: number;
  error_rate?: number;
  color: string; // Pie에서 전달된 색상
}

interface Props {
  items: EndpointItem[];
  selectedMetric: 'requests' | 'error_rate' | 'latency';
  height?: number;
  onBarClick?: (endpointName: string) => void;
}

export default function EndpointBarChart({
  items,
  selectedMetric,
  height = 350,
  onBarClick,
}: Props) {
  const option = useMemo(() => {
    const values = items.map((ep) => {
      let v = 0;
      if (selectedMetric === 'requests') v = ep.request_count ?? 0;
      if (selectedMetric === 'latency') v = Number((ep.latency_p95_ms ?? 0).toFixed(2));
      if (selectedMetric === 'error_rate') v = Math.round((ep.error_rate ?? 0) * 100);

      return {
        value: v,
        name: ep.endpoint_name,
        itemStyle: { color: ep.color }, // Pie와 동일한 색 적용
      };
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.85)',
        textStyle: { color: '#fff' },
        formatter: (params: any) => {
          const p = params[0];
          // latency는 소수점 2자리로 표시
          if (selectedMetric === 'latency') {
            return `${p.name}<br/>${p.value.toFixed(2)} ms`;
          }
          return `${p.name}<br/>${p.value}`;
        },
      },

      grid: { left: 40, right: 20, top: 30, bottom: 40 },

      xAxis: {
        type: 'category',
        data: items.map((i) => i.endpoint_name),
        axisLabel: { color: '#6b7280', fontSize: 11 },
      },

      yAxis: {
        type: 'value',
        axisLabel: { color: '#6b7280', fontSize: 11 },
      },

      series: [
        {
          type: 'bar',
          barWidth: '45%',
          data: values,

          // 숫자 표시
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
  }, [items, selectedMetric]);

  const events = {
    click: (params: any) => {
      if (params?.name && onBarClick) onBarClick(params.name);
    },
  };

  return <ReactECharts option={option} style={{ height }} onEvents={events} />;
}
