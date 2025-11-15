/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import type { SpanItem } from '@/types/apm';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

interface WaterfallViewProps {
  spans: SpanItem[];
  onSpanSelect: (id: string | null) => void;
}

import { getBucketColor, getBucketLabel, getBucketByIndex } from '@/src/utils/durationBuckets';

export default function WaterfallView({ spans, onSpanSelect }: WaterfallViewProps) {
  const chartOption = useMemo<EChartsOption | null>(() => {
    if (!spans || spans.length === 0) {
      return null;
    }

    const maxDuration = Math.max(...spans.map((s) => s.duration_ms ?? 0), 1);

    const data = spans.map((s) => {
      const dur = s.duration_ms ?? 0;
      const ratio = dur / maxDuration;
      const color = getBucketColor(ratio);

      return {
        value: dur,
        name: s.name,
        spanId: s.span_id,
        itemStyle: {
          color: color,
          borderWidth: 0,
          // selectedSpan에 따른 하이라이트 제거: 항상 동일한 스타일 사용
          shadowBlur: 0,
          shadowColor: 'rgba(0, 0, 0, 0)',
        },
      };
    });

    const yAxisData = spans.map((s) => (s.name.length > 25 ? s.name.slice(0, 22) + '...' : s.name));

    return {
      backgroundColor: 'transparent',
      grid: {
        left: '25%',
        right: '15%',
        top: '5%',
        bottom: '5%',
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderWidth: 0,
        textStyle: {
          color: '#ffffff',
          fontSize: 15,
        },
        padding: 16,
        formatter: (params: any) => {
          if (params && params.data) {
            const spanId = params.data.spanId;
            const span = spans.find((s) => s.span_id === spanId);
            if (!span) return '';
            const ratio = (span.duration_ms ?? 0) / maxDuration;
            const statusText = getBucketLabel(ratio);
            return `<div style="line-height: 1.8;">
              <div style="font-weight: 600; font-size: 16px; margin-bottom: 10px; color: #fff;">${
                span.name
              }</div>
                <div style="color: #e2e8f0; margin-bottom: 8px; font-size: 15px;">Duration: <span style="color: #fff; font-weight: 600;">${(
                  span.duration_ms ?? 0
                ).toFixed(2)} ms</span></div>
                <div style="color: #e2e8f0; margin-bottom: 6px; font-size: 15px;">Status: ${statusText}</div>
              <div style="color: #94a3b8; font-size: 12px; margin-top: 8px; font-family: monospace;">${
                span.span_id
              }</div>
            </div>`;
          }
          return '';
        },
      },
      xAxis: {
        type: 'value',
        name: 'Duration (ms)',
        nameTextStyle: {
          fontSize: 13,
          color: '#6b7280',
          padding: [0, 0, 0, 10],
        },
        axisLabel: {
          fontSize: 12,
          color: '#6b7280',
        },
        splitLine: {
          lineStyle: {
            color: '#e5e7eb',
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: yAxisData,
        axisLabel: {
          fontSize: 12,
          color: '#374151',
          fontWeight: 500,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d1d5db',
          },
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          type: 'bar',
          data: data,
          barWidth: '60%',
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
      ],
    };
  }, [spans]);

  if (!spans || spans.length === 0) {
    return <div className="text-sm text-gray-500">표시할 스팬 데이터가 없습니다</div>;
  }

  if (!chartOption) {
    return <div className="text-sm text-gray-500">차트를 생성할 수 없습니다</div>;
  }

  const onEvents = {
    click: (params: any) => {
      if (params.data && params.data.spanId) {
        onSpanSelect(params.data.spanId);
      }
    },
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-linear-to-b from-indigo-500 to-purple-500 rounded-full"></div>
          <h3 className="text-base font-semibold text-gray-900">Span Duration Waterfall</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          {Array.from({ length: 5 }).map((_, i) => {
            const b = getBucketByIndex(i);
            return (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: b.color }}></div>
                <span>{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-1 bg-linear-to-br from-slate-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <ReactEChartsCore
          echarts={echarts}
          option={chartOption}
          onEvents={onEvents}
          style={{ height: '100%', width: '100%', minHeight: '500px' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </div>
  );
}
