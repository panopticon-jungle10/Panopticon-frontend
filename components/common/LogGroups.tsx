'use client';

import React, { useMemo } from 'react';
import type { LogEntry } from '@/types/apm';

interface LogGroup {
  key: string;
  title: string;
  items: LogEntry[];
}

interface ExtendedGroup extends LogGroup {
  primaryLevel: string;
  primaryPriority: number;
}

interface Props {
  items: LogEntry[];
  maxGroups?: number;
  // 페이지 관련: page와 pageSize가 주어지면 해당 페이지만 표시
  page?: number;
  pageSize?: number;
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

// 그룹 계산 유틸: 전체 그룹(정렬 포함)을 반환
export function computeGroups(items: LogEntry[]): ExtendedGroup[] {
  const map = new Map<string, LogEntry[]>();

  for (const it of items) {
    const key = normalizeMessage(it.message || '') || 'other';
    const arr = map.get(key) || [];
    arr.push(it);
    map.set(key, arr);
  }

  const levelPriority = (lvl?: string) => {
    if (!lvl) return 99;
    const L = lvl.toUpperCase();
    if (L === 'ERROR') return 0;
    if (L === 'WARN' || L === 'WARNING') return 1;
    if (L === 'DEBUG') return 2;
    if (L === 'INFO') return 3;
    return 99;
  };

  const arr: ExtendedGroup[] = Array.from(map.entries()).map(([k, v]) => {
    const primary = v.reduce((best: string | null, it) => {
      if (!best) return it.level || null;
      return levelPriority(it.level) < levelPriority(best) ? it.level : best;
    }, null as string | null);

    return {
      key: k,
      title: v[0]?.message || k,
      items: v,
      primaryLevel: primary || 'INFO',
      primaryPriority: levelPriority(primary || 'INFO'),
    };
  });

  arr.sort((a: ExtendedGroup, b: ExtendedGroup) => {
    if (a.primaryPriority !== b.primaryPriority) return a.primaryPriority - b.primaryPriority;
    return b.items.length - a.items.length;
  });

  return arr;
}

export default function LogGroups({ items, maxGroups = 20, page, pageSize, onGroupClick }: Props) {
  const fullGroups = useMemo(() => computeGroups(items), [items]);
  const totalGroups = fullGroups.length;

  // 페이징이 주어지면 해당 페이지만 표시, 아니면 maxGroups 기준으로 자름
  const groups = useMemo<ExtendedGroup[]>(() => {
    if (typeof page === 'number' && typeof pageSize === 'number') {
      const start = Math.max(0, (page - 1) * pageSize);
      return fullGroups.slice(start, start + pageSize);
    }
    return fullGroups.slice(0, maxGroups);
  }, [fullGroups, page, pageSize, maxGroups]);

  if (!items || items.length === 0)
    return <div className="text-sm text-gray-500">로그가 없습니다</div>;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold mb-1">로그 그룹 (유사 메시지)</h3>
      <div className="text-xs text-gray-500">
        그룹 <strong>{totalGroups}</strong>개 중 <strong>{groups.length}</strong>개 표시
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {groups.map((g) => (
          <div
            key={g.key}
            role="button"
            onClick={() => onGroupClick && onGroupClick(g.key, g.title, g.items)}
            // 왼쪽 테두리 색상을 레벨에 따라 변경
            className={`border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer bg-white border-l-4 ${
              g.primaryLevel === 'ERROR'
                ? 'border-l-red-500'
                : g.primaryLevel === 'WARN' || g.primaryLevel === 'WARNING'
                ? 'border-l-amber-500'
                : g.primaryLevel === 'DEBUG'
                ? 'border-l-gray-300'
                : g.primaryLevel === 'INFO'
                ? 'border-l-blue-200'
                : 'border-l-gray-200'
            }`}
          >
            <div className="flex flex-col items-start justify-center">
              <div className="text-sm font-medium text-gray-800 wrap-break-word">{g.title}</div>
              <div className="text-xs text-gray-500 mt-1">{g.items.length}개 메시지</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
