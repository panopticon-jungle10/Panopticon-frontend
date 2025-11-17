'use client';

import { ServiceHeaderNav } from '@/components/common/ServiceHeaderNav';
import Sidebar from '@/components/features/services/[serviceId]/Sidebar';
import { SelectDate } from '@/components/features/services/SelectDate';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useTimeRangeStore } from '@/src/store/timeRangeStore';
import type { TimeRange as TimeRangeType } from '@/src/utils/timeRange';
import { TimeRange } from '@/types/time';
import { PRESET_RANGES } from '@/src/constants/timeRanges';

export const dynamicParams = true;

export default function ApmLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showSidebar = (pathname?.includes('/dashboards') ?? false) === false;

  const { timeRange, setTimeRange } = useTimeRangeStore();

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range.value as TimeRangeType);
  };

  const selectedTimeRange: TimeRange = PRESET_RANGES.find((range) => range.value === timeRange) || {
    label: timeRange,
    value: timeRange,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-8 px-8 py-6">
        <ServiceHeaderNav />
        <div className="flex gap-6">
          {showSidebar && (
            <div className="flex flex-col gap-4 sticky top-6 h-fit">
              <Sidebar />
              <SelectDate value={selectedTimeRange} onChange={handleTimeRangeChange} />
            </div>
          )}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
