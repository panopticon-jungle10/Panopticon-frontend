/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface EndpointItem {
  endpoint_name: string;
  request_count?: number;
  latency_p95_ms?: number;
  error_rate?: number; // 0~1 값
  color?: string; // Pie와 동일 색
}

interface Props {
  items: EndpointItem[];
  selectedMetric: 'requests' | 'error_rate' | 'latency';
  height?: number;
  onBarClick?: (endpointName: string) => void;
  colors?: string[];
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

    const palette = colors?.length ? colors : undefined;

    const isErrorRate = selectedMetric === 'error_rate';

    const baseValues = items.map((ep) => {
      if (selectedMetric === 'requests') return ep.request_count ?? 0;
      if (selectedMetric === 'latency') return Number((ep.latency_p95_ms ?? 0).toFixed(2));
      return Number(((ep.error_rate ?? 0) * 100).toFixed(2)); // error_rate → percentage
    });

    const errorRateTotal = isErrorRate ? baseValues.reduce((sum, v) => sum + v, 0) : 0;

    const values = items.map((ep, idx) => {
      const raw = baseValues[idx] ?? 0;
      const value =
        isErrorRate && errorRateTotal > 0
          ? Number(((raw / errorRateTotal) * 100).toFixed(2)) // match pie slice percentage
          : raw;

      return {
        name: ep.endpoint_name,
        value,
        itemStyle: {
          color: ep.color ?? palette?.[idx % palette.length],
        },
      };
    });

    // error_rate일 때 y축 자동 확장
    const maxValue = Math.max(...values.map((v) => v.value));
    const dynamicMax = isErrorRate ? Math.ceil(maxValue * 1.2) : undefined;

    return {
      backgroundColor: 'transparent',

      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const p = params[0];
          if (selectedMetric === 'error_rate') return `${p.name}<br/>${p.value.toFixed(2)}%`;
          if (selectedMetric === 'latency') return `${p.name}<br/>${p.value} ms`;
          return `${p.name}<br/>${p.value}`;
        },
      },

      grid: { left: 40, right: 20, top: 30, bottom: 40 },

      xAxis: {
        type: 'category',
        data: items.map((i) => i.endpoint_name),
      },

      yAxis: {
        type: 'value',
        max: dynamicMax,
        axisLabel: {
          formatter: (val: number) =>
            selectedMetric === 'error_rate'
              ? `${val}%`
              : selectedMetric === 'latency'
              ? `${val}ms`
              : val.toLocaleString(),
        },
      },

      series: [
        {
          type: 'bar',
          barWidth: '45%',
          data: values,
          label: {
            show: true,
            position: 'top',
            formatter: (p: any) =>
              selectedMetric === 'error_rate'
                ? `${p.value.toFixed(2)}%`
                : selectedMetric === 'latency'
                ? `${p.value} ms`
                : p.value,
          },
          itemStyle: { borderRadius: [4, 4, 0, 0] },
        },
      ],
    };
  }, [items, selectedMetric, colors]);

  const events = {
    click: (params: any) => {
      if (params?.name && onBarClick) onBarClick(params.name);
    },
  };

  return <ReactECharts option={option} style={{ height }} onEvents={events} />;
}
