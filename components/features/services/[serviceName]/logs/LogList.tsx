// 에러 로그 목록 => 로그 목록 전체 + 상태 관리

import type { LogEntry } from '@/types/apm';
import LogItem, { HighlightedLogItem } from './LogItem';

// LogEntry 확장 타입으로 교체
interface LogListProps {
  items: HighlightedLogItem[];
  onItemClick?: (log: LogEntry) => void;
}

export default function LogList({ items, onItemClick }: LogListProps) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((l) => (
        <LogItem key={l.id} item={l} onClick={onItemClick} />
      ))}
    </div>
  );
}
