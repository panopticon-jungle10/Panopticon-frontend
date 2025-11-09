'use client';

import React, { useMemo, useState } from 'react';

import FilterBar from '@/components/features/apm/services/service_id/logs/FilterBar';
import StatGrid from '@/components/features/apm/services/service_id/logs/StatGrid';
import LogList from '@/components/features/apm/services/service_id/logs/LogList';
import { mockLogs, mockStats } from '@/components/features/apm/services/service_id/logs/mock';

export default function ServiceLogsPage() {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('');
  const [service, setService] = useState('');

  const services = useMemo(() => ['', ...Array.from(new Set(mockLogs.map((l) => l.service)))], []);
  const levels = ['', 'ERROR', 'WARNING', 'INFO'];

  // 필터링
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockLogs.filter((l) => {
      const matchQuery =
        q === '' ||
        l.message.toLowerCase().includes(q) ||
        l.service.toLowerCase().includes(q) ||
        l.traceId.toLowerCase().includes(q);
      const matchLevel = level === '' || l.level === level;
      const matchService = service === '' || l.service === service;
      return matchQuery && matchLevel && matchService;
    });
  }, [query, level, service]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <FilterBar
        query={query}
        level={level}
        service={service}
        levels={levels}
        services={services}
        onChangeQuery={setQuery}
        onChangeLevel={setLevel}
        onChangeService={setService}
      />
      <StatGrid items={mockStats} />
      <LogList items={filtered} />
    </div>
  );
}
