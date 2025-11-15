import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { LogItem } from '@/types/apm';

interface UseErrorLogsWebSocketOptions {
  serviceName?: string;
  onLogReceived: (log: LogItem) => void;
  enabled?: boolean;
}

/**
 * 에러 로그를 실시간으로 수신하는 웹소켓 훅
 * @param serviceName - 특정 서비스의 로그만 수신 (선택사항)
 * @param onLogReceived - 로그 수신 시 호출되는 콜백 함수
 * @param enabled - 웹소켓 연결 활성화 여부 (기본값: true)
 */
export function useErrorLogsWebSocket({
  serviceName,
  onLogReceived,
  enabled = true,
}: UseErrorLogsWebSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // 최신 콜백을 항상 참조하기 위한 ref
  const onLogReceivedRef = useRef(onLogReceived);

  useEffect(() => {
    // 콜백 ref를 useEffect 내에서 업데이트
    onLogReceivedRef.current = onLogReceived;
  });

  useEffect(() => {
    const connect = (): void => {
      const serverUrl = process.env.NEXT_PUBLIC_WS_ERROR_LOGS_URL;
      const wsPath = process.env.NEXT_PUBLIC_WS_ERROR_LOGS_PATH || '/ws/error-logs';

      if (!serverUrl) {
        console.warn(
          '웹소켓 URL이 설정되지 않았습니다. NEXT_PUBLIC_WS_ERROR_LOGS_URL 환경변수를 확인하세요.',
        );
        return;
      }

      try {
        // 기존 연결이 있으면 정리
        if (socketRef.current) {
          socketRef.current.close();
        }

        const socket = io(serverUrl, {
          path: wsPath,
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: maxReconnectAttempts,
          reconnectionDelay: 3000,
        });

        socketRef.current = socket;
        console.log('Socket.IO 연결 시도:', serverUrl, 'path:', wsPath);

        socket.on('connect', () => {
          console.log('Socket.IO 연결 성공, socketId:', socket.id);
          reconnectAttemptsRef.current = 0;
        });

        socket.on('error-log', (log: LogItem) => {
          try {
            onLogReceivedRef.current(log);
          } catch (error) {
            console.error('로그 파싱 오류:', error);
          }
        });

        socket.on('connect_error', (error) => {
          console.error('Socket.IO 연결 오류:', error);
          reconnectAttemptsRef.current += 1;
        });

        socket.on('disconnect', (reason) => {
          console.log('Socket.IO 연결 종료:', reason);

          if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            console.error('최대 재연결 시도 횟수 초과');
          }
        });
      } catch (error) {
        console.error('Socket.IO 연결 실패:', error);
      }
    };

    const disconnect = (): void => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      reconnectAttemptsRef.current = 0;
    };

    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [serviceName, enabled]);
}
