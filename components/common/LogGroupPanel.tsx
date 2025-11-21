'use client';

import { useState } from 'react';
import SlideOverLayout from '@/components/ui/SlideOverLayout';
import { IoClose } from 'react-icons/io5';
import LogAnalysis from '@/components/analysis/LogAnalysis';
import { LogEntry, LogLevel } from '@/types/apm';

interface GroupShape {
  key: string;
  title: string;
  items: LogEntry[];
}

interface Props {
  isOpen: boolean;
  group: GroupShape | null;
  onClose: () => void;
  widthClass?: string;
}

export default function LogGroupPanel({ isOpen, group, onClose, widthClass = 'w-[60vw]' }: Props) {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  if (!group) return null;

  return (
    <>
      <SlideOverLayout
        isOpen={isOpen}
        onClose={onClose}
        widthClass={widthClass}
        enableEsc={!isAnalysisOpen}
        backdropClassName={
          isAnalysisOpen
            ? 'fixed inset-0 bg-black/5 backdrop-blur-sm z-20 transition-opacity duration-300 opacity-100'
            : 'fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 transition-opacity duration-300 opacity-100'
        }
        panelClassName={
          isAnalysisOpen
            ? 'fixed top-0 right-0 h-full bg-white shadow-2xl z-30 transform transition-transform duration-300 ease-in-out translate-x-0 filter blur-sm'
            : 'fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0'
        }
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{group.title}</h2>
            <div className="text-sm text-gray-600 mt-1">{group.items.length}개 메시지</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors hover:cursor-pointer"
            aria-label="Close panel"
          >
            <IoClose className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map((it, idx) => (
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
                  setIsAnalysisOpen(true);
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

      <LogAnalysis
        log={selectedLog}
        isOpen={isAnalysisOpen}
        onClose={() => {
          setIsAnalysisOpen(false);
        }}
      />
    </>
  );
}
