'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useErrorLogsWebSocket } from '@/src/hooks/useErrorLogsWebSocket';
import { LogItem } from '@/types/apm';
import { sendErrorNotification } from '@/src/utils/notifications';

interface AlarmContextValue {
  unreadCount: number;
  hasNewAlarm: boolean;
  recentErrors: LogItem[];
  clearAlarm: () => void;
  resetUnreadCount: () => void;
}

const AlarmContext = createContext<AlarmContextValue | undefined>(undefined);

const SLACK_NOTIFICATION_THRESHOLD = 20;
const MAX_RECENT_ERRORS = 10;

export default function AlarmProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewAlarm, setHasNewAlarm] = useState(false);
  const [recentErrors, setRecentErrors] = useState<LogItem[]>([]);

  // 서버로 전송할 버퍼 (ref로 유지)
  const errorBufferRef = useRef<LogItem[]>([]);

  const sendBufferIfNeeded = useCallback(async () => {
    const buffer = errorBufferRef.current;
    if (buffer.length >= SLACK_NOTIFICATION_THRESHOLD) {
      const errorsToSend = buffer.slice();
      // 비동기로 전송하고 버퍼 초기화
      try {
        // 여러 채널로 동시 전송 시도 (각 채널은 내부에서 설정 확인)
        await Promise.allSettled([
          sendErrorNotification('slack', errorsToSend),
          sendErrorNotification('discord', errorsToSend),
          sendErrorNotification('teams', errorsToSend),
        ]);
      } catch (e) {
        console.error('Notification send failed', e);
      }
      errorBufferRef.current = [];
    }
  }, []);

  const handleLogReceived = useCallback(
    (log: LogItem) => {
      // recentErrors 업데이트
      setRecentErrors((prev) => {
        const next = [log, ...prev].slice(0, MAX_RECENT_ERRORS);
        return next;
      });

      // unread 및 표시 상태
      setUnreadCount((c) => c + 1);
      setHasNewAlarm(true);

      // 버퍼에 추가
      errorBufferRef.current.push(log);
      // 전송 조건 검사
      void sendBufferIfNeeded();
    },
    [sendBufferIfNeeded],
  );

  // 전체 서비스 에러 수신 (serviceName 없이 전체 에러 로그 수신)
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
