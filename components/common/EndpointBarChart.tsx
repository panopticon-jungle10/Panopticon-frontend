'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface EndpointItem {
  endpoint_name: string;
  request_count?: number;
  latency_p95_ms?: number;
  error_rate?: number;
  color: string; // ★ Pie에서 전달된 색상
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
      if (selectedMetric === 'latency') v = ep.latency_p95_ms ?? 0;
      if (selectedMetric === 'error_rate') v = Math.round((ep.error_rate ?? 0) * 100);

      return {
        value: v,
        name: ep.endpoint_name,
        itemStyle: { color: ep.color }, // ★ Pie와 동일한 색 적용
      };
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
      },
      grid: { left: 40, right: 20, top: 20, bottom: 40 },
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
        },
      ],
    };
  }, [items, selectedMetric]);

  const events = {
    click: (params: any) => {
      const name = params?.name;
      if (name && onBarClick) onBarClick(name);
    },
  };

  return <ReactECharts option={option} style={{ height }} onEvents={events} />;
}
