/// 에러 로그 1개 => UI 스타일만 담당

import type { LogEntry } from '@/types/apm';
import LevelBadge from './LevelBadge';
import type { ReactNode } from 'react';

// 문자열 필드는 그대로 두고 하이라이트용 ReactNode는 별도 필드에 저장
export type HighlightedLogItem = LogEntry & {
  highlighted?: {
    service: ReactNode;
    message: ReactNode;
    traceId: ReactNode;
  };
};

interface LogItemProps {
  item: HighlightedLogItem;
  onClick?: (log: LogEntry) => void;
}

export default function LogItem({ item, onClick }: LogItemProps) {
  const serviceContent = item.highlighted?.service ?? item.service;
  const traceContent = item.highlighted?.traceId ?? item.traceId;
  const messageContent = item.highlighted?.message ?? item.message;

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 flex flex-col md:flex-row md:items-start md:justify-between hover:shadow-sm transition cursor-pointer"
      onClick={() => onClick?.(item)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <LevelBadge level={item.level} />
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
            {serviceContent}
          </span>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500 truncate max-w-[200px]">
            {traceContent}
          </span>
        </div>
        <div className="mt-2 text-gray-900 font-medium wrap-break-word">{messageContent}</div>
      </div>
      <div className="mt-3 md:mt-0 md:ml-4 md:shrink-0 text-left md:text-right text-sm text-gray-500 flex items-center gap-2">
        <span>🕒</span>
        <span className="tabular-nums">{item.timestamp}</span>
        <span className="text-gray-400">›</span>
      </div>
    </div>
  );
}