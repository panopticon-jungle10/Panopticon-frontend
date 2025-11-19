'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useErrorLogsWebSocket } from '@/src/hooks/useErrorLogsWebSocket';
import { LogItem } from '@/types/apm';

interface AlarmContextType {
  unreadCount: number;
  hasNewAlarm: boolean;
  recentErrors: LogItem[];
  clearAlarm: () => void;
  resetUnreadCount: () => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export function AlarmProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewAlarm, setHasNewAlarm] = useState(false);
  const [recentErrors, setRecentErrors] = useState<LogItem[]>([]);

  // 새 에러 로그가 도착했을 때
  const handleLogReceived = useCallback((log: LogItem) => {
    // 읽지 않은 알림 카운트 증가
    setUnreadCount((prev) => prev + 1);

    // 최근 에러 로그 목록 업데이트 (최대 5개 유지)
    setRecentErrors((prev) => [log, ...prev].slice(0, 5));

    // 펄스 애니메이션 활성화
    setHasNewAlarm(true);

    // 5초 후 펄스 애니메이션 자동 제거
    setTimeout(() => setHasNewAlarm(false), 5000);
  }, []);

  // WebSocket 연결 - serviceName 없이 전체 에러 로그 수신
  useErrorLogsWebSocket({
    onLogReceived: handleLogReceived,
    enabled: true,
  });

  const clearAlarm = useCallback(() => {
    setHasNewAlarm(false);
  }, []);

  const resetUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return (
    <AlarmContext.Provider
      value={{ unreadCount, hasNewAlarm, recentErrors, clearAlarm, resetUnreadCount }}
    >
      {children}
    </AlarmContext.Provider>
  );
}

export function useAlarm() {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
}
