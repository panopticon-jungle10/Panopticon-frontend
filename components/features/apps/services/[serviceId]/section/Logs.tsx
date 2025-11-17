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

interface LogsSectionProps {
  serviceName: string;
}

export default function LogsSection({ serviceName }: LogsSectionProps) {
  // const [level, setLevel] = useState<LogLevel | ''>('ERROR');
  const level: LogLevel = 'ERROR'; // ERROR 레벨만 필터링
  const [page, setPage] = useState(1);
  const pageSize = 15;
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
  const { data: logsData } = useQuery({
    queryKey: ['logs', serviceName, level, startTime, endTime],
    queryFn: () =>
      getLogs({
        service_name: serviceName,
        level: level || undefined,
        from: startTime,
        to: endTime,
        size: 60,
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
    }));
  }, [realtimeLogs]);

  // API 로그 + 실시간 로그 병합 (실시간 로그가 먼저 표시됨)
  // API 호출 시 이미 level로 필터링되므로 클라이언트 필터링 불필요
  const logs = useMemo(() => {
    return [...realtimeLogEntries, ...apiLogs];
  }, [realtimeLogEntries, apiLogs]);

  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize));
  const paginatedLogs = useMemo(() => {
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    return logs.slice(startIdx, endIdx);
  }, [logs, page, pageSize]);

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleLogClick = (log: LogEntry) => {
    setSelectedLog(log);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    // 애니메이션이 끝난 후 selectedLog를 null로 설정
    setTimeout(() => setSelectedLog(null), 300);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">에러 로그</h2>
      <section id="logs" className="flex flex-col gap-4 md:gap-6 scroll-mt-24">
        <LogList items={paginatedLogs} onItemClick={handleLogClick} />
        <Pagination page={page} totalPages={totalPages} onPrev={handlePrev} onNext={handleNext} />
      </section>

      <LogAnalysis log={selectedLog} isOpen={isPanelOpen} onClose={handleClosePanel} />
    </div>
  );
}
