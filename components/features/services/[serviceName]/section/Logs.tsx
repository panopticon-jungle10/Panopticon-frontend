'use client';

import { useMemo, useState, useCallback } from 'react';
import LogList from '../logs/LogList';
import Pagination from '../../Pagination';
import { useQuery } from '@tanstack/react-query';
import { getLogs } from '@/src/api/apm';
import { LogLevel, LogEntry, LogItem } from '@/types/apm';
import { useTimeRangeStore } from '@/src/store/timeRangeStore';
import { useErrorLogsWebSocket } from '@/src/hooks/useErrorLogsWebSocket';
import LogAnalysis from '@/components/analysis/LogAnalysis';
import StateHandler from '@/components/ui/StateHandler';
import { FiLayers } from 'react-icons/fi';
import TagSearchBar, { Tag } from '@/components/ui/TagSearchBar';
import { ReactNode } from 'react';
import type { HighlightedLogItem } from '../logs/LogItem';

interface LogsSectionProps {
  serviceName: string;
}

export default function LogsSection({ serviceName }: LogsSectionProps) {
  // const [level, setLevel] = useState<LogLevel | ''>('ERROR');
  const level: LogLevel = 'ERROR'; // ERROR 레벨만 필터링
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [tags, setTags] = useState<Tag[]>([]); // 태그 상태
  const [keyword, setKeyword] = useState(''); // keyword 검색을 위한 상태 추가

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // 웹소켓으로 받은 실시간 에러 로그를 누적하는 상태
  const [realtimeLogs, setRealtimeLogs] = useState<LogItem[]>([]);

  const { startTime, endTime } = useTimeRangeStore();

  // 웹소켓으로 에러 로그 수신
  const handleLogReceived = useCallback((log: LogItem) => {
    setRealtimeLogs((prev) => [log, ...prev]); // 최신 로그를 맨 앞에 추가
  }, []);

  useErrorLogsWebSocket({
    serviceName,
    onLogReceived: handleLogReceived,
    enabled: true,
  });

  // 로그 목록 가져오기 (새 API)
  const {
    data: logsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['logs', serviceName, level, startTime, endTime],
    queryFn: () =>
      getLogs({
        service_name: serviceName,
        level: level || undefined,
        from: startTime,
        to: endTime,
        size: 200, // message 기반 키워드 추출 위해 size 증가
      }),
    retry: false, // API 오류 시 재시도 하지 않음
    throwOnError: false, // 오류를 throw하지 않고 isError 상태로만 처리
  });

  // API 로그 데이터 변환
  const apiLogs = useMemo(() => {
    if (!logsData?.items) return [];
    return logsData.items.map((log) => ({
      id: `api-${log.service_name}-${log.timestamp}`,
      level: log.level as LogLevel,
      service: log.service_name,
      traceId: log.trace_id || '',
      message: log.message,
      timestamp: new Date(log.timestamp).toLocaleString('ko-KR'),
      spanId: (log as any).span_id || '',
    }));
  }, [logsData]);

  // 실시간 로그 데이터 변환
  const realtimeLogEntries = useMemo(() => {
    return realtimeLogs.map((log) => ({
      id: `ws-${log.service_name}-${log.timestamp}`,
      level: log.level as LogLevel,
      service: log.service_name,
      traceId: log.trace_id || '',
      message: log.message,
      timestamp: new Date(log.timestamp).toLocaleString('ko-KR'),
      spanId: '',
    }));
  }, [realtimeLogs]);

  // API 로그 + 실시간 로그 병합 (실시간 로그가 먼저 표시됨)
  // API 호출 시 이미 level로 필터링되므로 클라이언트 필터링 불필요
  const logs = useMemo(() => {
    return [...realtimeLogEntries, ...apiLogs];
  }, [realtimeLogEntries, apiLogs]);

  // 자동 Suggestion 데이터
  const messageKeywords = useMemo(() => {
    const freq: Record<string, number> = {};
    logs.forEach((log) => {
      const words = log.message
        .toLowerCase()
        .replace(/[^a-z0-9 ]/gi, ' ')
        .split(/\s+/);
      words.forEach((w) => {
        if (w.length < 3) return;
        if (/^\d+$/.test(w)) return;
        freq[w] = (freq[w] || 0) + 1;
      });
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([w]) => w);
  }, [logs]);

  const serviceNames = useMemo(() => [...new Set(logs.map((l) => l.service))], [logs]);
  const traceIds = useMemo(() => [...new Set(logs.map((l) => l.traceId).filter(Boolean))], [logs]);
  const spanIds = useMemo(() => [...new Set(logs.map((l) => l.spanId).filter(Boolean))], [logs]);

  // 하이라이트 함수
  const highlight = (text: string, keywords: string[]): ReactNode => {
    const safe = keywords
      .map((k) => k.trim())
      .filter(Boolean)
      .filter((k) => text.toLowerCase().includes(k.toLowerCase()));

    if (safe.length === 0) return text;

    const escaped = safe.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');

    return text.split(regex).map((part, i) =>
      escaped.some((k) => part.toLowerCase() === k.toLowerCase()) ? (
        <mark key={i} className="bg-blue-200 text-blue-900 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  // 필터링
  const filteredLogs = useMemo(() => {
    let result = [...logs];

    tags.forEach(({ key, value }) => {
      const v = value.toLowerCase();
      if (key === 'msg') result = result.filter((l) => l.message.toLowerCase().includes(v));
      if (key === 'service') result = result.filter((l) => l.service.toLowerCase().includes(v));
      if (key === 'trace') result = result.filter((l) => l.traceId.toLowerCase().includes(v));
      if (key === 'span') result = result.filter((l) => l.spanId.toLowerCase().includes(v));
      if (key === 'level') result = result.filter((l) => l.level.toLowerCase() === v);
    });

    if (keyword.trim()) {
      const k = keyword.toLowerCase();
      result = result.filter(
        (l) =>
          l.message.toLowerCase().includes(k) ||
          l.service.toLowerCase().includes(k) ||
          l.traceId.toLowerCase().includes(k),
      );
    }

    return result;
  }, [tags, keyword, logs]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));

  const paginatedLogs = useMemo(() => {
    const startIdx = (page - 1) * pageSize;
    return filteredLogs.slice(startIdx, startIdx + pageSize);
  }, [filteredLogs, page]);

  // 하이라이트 적용된 logs로 변환
  const highlightKeywords = useMemo(
    () => [keyword, ...tags.map((t) => t.value)].filter(Boolean),
    [keyword, tags],
  );

  // 문자열 필드를 그대로 두고, ReactNode는 별도 필드에 저장
  const highlightedPaginatedLogs = useMemo<HighlightedLogItem[]>(() => {
    return paginatedLogs.map((l) => ({
      ...l,
      highlighted: {
        message: highlight(l.message, highlightKeywords),
        service: highlight(l.service, highlightKeywords),
        traceId: highlight(l.traceId, highlightKeywords),
      },
    }));
  }, [paginatedLogs, highlightKeywords]);

  const handleLogClick = (log: LogEntry) => {
    setSelectedLog(log);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedLog(null), 300);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">에러 로그</h2>

      <div className="w-full max-w-screen-xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <TagSearchBar
            tags={tags}
            onTagsChange={setTags}
            keyword={keyword}
            onKeywordChange={(v) => {
              setKeyword(v);
              setPage(1);
            }}
            messageKeywords={messageKeywords}
            serviceNames={serviceNames}
            traceIds={traceIds}
            spanIds={spanIds}
          />
        </div>

        <div className="h-[52px] px-5 flex items-center rounded-xl border bg-white shadow-sm shrink-0 gap-2">
          <FiLayers className="w-5 h-5 text-blue-600" />
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] text-gray-500">총 로그 개수</span>
            <span className="text-[18px] font-semibold text-gray-700">
              {filteredLogs.length.toLocaleString()} 개
            </span>
          </div>
        </div>
      </div>

      <section id="logs" className="flex flex-col gap-4 md:gap-6 scroll-mt-24">
        <StateHandler
          isLoading={isLoading}
          isError={isError}
          isEmpty={filteredLogs.length === 0}
          type="table"
          height={200}
        >
          {/* LogList에 하이라이트된 logs 전달 */}
          <LogList items={highlightedPaginatedLogs} onItemClick={handleLogClick} />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage(page - 1)}
            onNext={() => setPage(page + 1)}
          />
        </StateHandler>
      </section>

      <LogAnalysis log={selectedLog} isOpen={isPanelOpen} onClose={handleClosePanel} />
    </div>
  );
}
