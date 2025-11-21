'use client';

import React, { useMemo } from 'react';
import type { LogEntry } from '@/types/apm';

interface LogGroup {
  key: string;
  title: string;
  items: LogEntry[];
}

interface Props {
  items: LogEntry[];
  maxGroups?: number;
  // 그룹 클릭 시 호출 (그룹 key, 대표 메시지, 그룹에 포함된 항목)
  onGroupClick?: (key: string, title: string, items: LogEntry[]) => void;
}

// 간단한 메시지 정규화: 소문자, 숫자/헥스/특수문자 제거, 공백 축약, 길이 제한
function normalizeMessage(msg: string) {
  return msg
    .toLowerCase()
    .replace(/0x[a-f0-9]+/gi, ' ') // hex
    .replace(/\d+/g, ' ') // numbers
    .replace(/[^a-z0-9\s]/gi, ' ') // punct
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

export default function LogGroups({ items, maxGroups = 8, onGroupClick }: Props) {
  const groups: LogGroup[] = useMemo(() => {
    const map = new Map<string, LogEntry[]>();

    for (const it of items) {
      const key = normalizeMessage(it.message || '') || 'other';
      const arr = map.get(key) || [];
      arr.push(it);
      map.set(key, arr);
    }

    // convert to array and sort by size desc
    const arr = Array.from(map.entries()).map(([k, v]) => ({
      key: k,
      title: v[0]?.message || k,
      items: v,
    }));
    arr.sort((a, b) => b.items.length - a.items.length);
    return arr.slice(0, maxGroups);
  }, [items, maxGroups]);

  if (!items || items.length === 0)
    return <div className="text-sm text-gray-500">로그가 없습니다</div>;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold mb-1">로그 그룹 (유사 메시지)</h3>
      <div className="text-xs text-gray-500">그룹 {groups.length}개 표시</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {groups.map((g) => (
          <div
            key={g.key}
            role="button"
            onClick={() => onGroupClick && onGroupClick(g.key, g.title, g.items)}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 wrap-break-word">{g.title}</div>
                <div className="text-xs text-gray-500 mt-1">{g.items.length}개 메시지</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              대표 메시지를 클릭하면 그룹 패널이 열립니다.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
