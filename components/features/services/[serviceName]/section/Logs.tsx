'use client';

import { useMemo, useState, useCallback } from 'react';
import Pagination from '../../Pagination';
import { useQuery } from '@tanstack/react-query';
import { getLogs } from '@/src/api/apm';
import { LogLevel, LogEntry, LogItem } from '@/types/apm';
import { useTimeRangeStore } from '@/src/store/timeRangeStore';
import { useErrorLogsWebSocket } from '@/src/hooks/useErrorLogsWebSocket';
import LogAnalysis from '@/components/analysis/LogAnalysis';
import StateHandler from '@/components/ui/StateHandler';
import LogGroups from '@/components/common/LogGroups';
import { FiLayers } from 'react-icons/fi';
import SlideOverLayout from '@/components/ui/SlideOverLayout';
import { IoClose } from 'react-icons/io5';
import TagSearchBar, { Tag } from '@/components/ui/TagSearchBar';

interface LogsSectionProps {
  serviceName: string;
}

export default function LogsSection({ serviceName }: LogsSectionProps) {
  // level은 태그에서 선택되면 그 값을 사용하고, 없으면 기본 ERROR 사용

  // 간단한 메시지 정규화(그룹화 기준과 동일하게 유지)
  const normalizeMessage = (msg: string) =>
    msg
      .toLowerCase()
      .replace(/0x[a-f0-9]+/gi, ' ')
      .replace(/\d+/g, ' ')
      .replace(/[^a-z0-9\s]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [tags, setTags] = useState<Tag[]>([{ key: 'level', value: 'ERROR' }]); // 태그 상태 (초기값: level:ERROR)
  const [keyword, setKeyword] = useState(''); // keyword 검색을 위한 상태 추가

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isGroupPanelOpen, setIsGroupPanelOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    key: string;
    title: string;
    items: LogEntry[];
  } | null>(null);

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
    queryKey: ['logs', serviceName, startTime, endTime],
    queryFn: () =>
      getLogs({
        service_name: serviceName,
        from: startTime,
        to: endTime,
        size: 10000, // message 기반 키워드 추출 위해 size 증가(1만개)
      }),
    refetchInterval: 30000, // 30초마다 갱신
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
      spanId: log.span_id || '',
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

  // 필터링
  const filteredLogs = useMemo(() => {
    let result = [...logs];

    tags.forEach(({ key, value }) => {
      const v = value;
      if (key === 'msg') {
        // msg 태그는 그룹화된 키(정규화된 메시지)와 일치하는 항목으로 필터링
        const nv = normalizeMessage(v);
        result = result.filter((l) => normalizeMessage(l.message) === nv);
      }
      if (key === 'service')
        result = result.filter((l) => l.service.toLowerCase().includes(v.toLowerCase()));
      if (key === 'level') result = result.filter((l) => l.level.toLowerCase() === v.toLowerCase());
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

  // 페이지네이션용 데이터는 현재 사용하지 않음

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedLog(null), 300);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">로그</h2>

      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
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
          {/* 그룹화 뷰 */}
          <div className="mb-4">
            <LogGroups
              items={filteredLogs}
              onGroupClick={(key, title, items) => {
                setSelectedGroup({ key, title, items });
                setIsGroupPanelOpen(true);
              }}
            />
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage(page - 1)}
            onNext={() => setPage(page + 1)}
          />
        </StateHandler>
      </section>

      {/* 그룹 패널: 그룹을 클릭하면 열리는 패널 (첫 번째 패널) */}
      {isGroupPanelOpen && selectedGroup && (
        <SlideOverLayout
          isOpen={isGroupPanelOpen}
          onClose={() => setIsGroupPanelOpen(false)}
          widthClass="w-[60%]"
          enableEsc={!isPanelOpen}
          // 그룹 패널은 LogAnalysis가 열리면 뒤로 밀리고 흐릿해져야 함
          backdropClassName={
            isPanelOpen
              ? 'fixed inset-0 bg-black/5 backdrop-blur-sm z-20 transition-opacity duration-300 opacity-100'
              : 'fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 transition-opacity duration-300 opacity-100'
          }
          panelClassName={
            isPanelOpen
              ? 'fixed top-0 right-0 h-full bg-white shadow-2xl z-30 transform transition-transform duration-300 ease-in-out translate-x-0 filter blur-sm'
              : 'fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0'
          }
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{selectedGroup.title}</h2>
              <div className="text-sm text-gray-600 mt-1">
                {selectedGroup.items.length}개 메시지
              </div>
            </div>
            <button
              onClick={() => setIsGroupPanelOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors hover:cursor-pointer"
              aria-label="Close panel"
            >
              <IoClose className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedGroup.items.map((it, idx) => (
                <div
                  key={`${it.service}-${it.timestamp}-${idx}`}
                  onClick={() => {
                    setSelectedLog({
                      id: `${it.service}-${it.timestamp}-${idx}`,
                      level: it.level as LogLevel,
                      service: it.service || '',
                      traceId: it.traceId || '',
                      message: it.message,
                      timestamp: it.timestamp,
                    });
                    setIsPanelOpen(true);
                  }}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer bg-white"
                >
                  <div className="text-xs text-gray-500 font-mono">{it.service}</div>
                  <div className="mt-2 text-sm text-gray-800 line-clamp-3">{it.message}</div>
                  <div className="mt-3 text-xs text-gray-400">
                    {new Date(it.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SlideOverLayout>
      )}

      <LogAnalysis log={selectedLog} isOpen={isPanelOpen} onClose={handleClosePanel} />
    </div>
  );
}
