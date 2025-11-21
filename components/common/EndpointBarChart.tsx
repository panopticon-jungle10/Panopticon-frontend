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
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderColor: 'transparent',
        textStyle: { color: '#f9fafb', fontSize: 12 },
        padding: 10,
        formatter: (params: any) => {
          const name = params.name ?? '';
          const ep = items.find((i) => i.endpoint_name === name) || {};
          const requests = ep.request_count ?? 0;
          const p95 = ep.latency_p95_ms ?? 0;
          const errorRate =
            ep.error_rate !== undefined && ep.error_rate !== null ? ep.error_rate * 100 : null;

          const mainMetricLabel =
            selectedMetric === 'requests'
              ? '요청수'
              : selectedMetric === 'error_rate'
              ? '에러율'
              : '지연시간';
          const mainMetricValue =
            selectedMetric === 'requests'
              ? requests.toLocaleString()
              : selectedMetric === 'error_rate'
              ? `${((ep.error_rate ?? 0) * 100).toFixed(2)}%`
              : `${p95.toFixed(2)} ms`;

          const errorRateText = errorRate !== null ? `${errorRate.toFixed(2)}%` : '-';

          return `
            <div style="font-weight:700;margin-bottom:6px;font-size:14px;">${name}</div>
            <div style="margin:4px 0;font-size:12px;">${mainMetricLabel}: ${mainMetricValue}</div>
            <div style="margin:4px 0;font-size:12px;">지연시간(P95): ${p95.toFixed(2)} ms</div>
            <div style="margin:4px 0;font-size:12px;">에러율: ${errorRateText}</div>
          `;
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
