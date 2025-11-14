'use client';
import { useRouter } from 'next/navigation';
import LogsSection from '@/components/features/apps/services/[serviceId]/section/Logs';
import { SelectDate } from '@/components/features/apps/services/SelectDate';
import TracesSection from '@/components/features/apps/services/[serviceId]/section/Traces';
import ChartsSection from '@/components/features/apps/services/[serviceId]/section/Charts';
import { TimeRange } from '@/types/time';
import ResourcesSection from '@/components/features/apps/services/[serviceId]/section/Resources';
import { useParams } from 'next/navigation';
import { useTimeRangeStore } from '@/src/store/timeRangeStore';
import type { TimeRange as TimeRangeType } from '@/src/utils/timeRange';
import { HiArrowLeft } from 'react-icons/hi2';

export default function ServiceOverview() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const appId = params.appId as string;

  const { timeRange, setTimeRange } = useTimeRangeStore();

  const handleBackToServices = () => {
    router.push('/apps/' + appId + '/services');
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range.value as TimeRangeType);
  };

  const selectedTimeRange: TimeRange = {
    label: timeRange === '1h' ? '1 hour' : timeRange,
    value: timeRange,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-4xl font-black text-gray-900">Summary</h1>

        <div className="flex justify-end">
          <SelectDate value={selectedTimeRange} onChange={handleTimeRangeChange} />
        </div>
      </div>

      <div id="resources" className="pt-4 scroll-mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Overview</h2>
        <ResourcesSection serviceName={serviceId} />
      </div>

      <ChartsSection serviceName={serviceId} />

      <div id="resources" className="pt-4 scroll-mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Resources</h2>
        <ResourcesSection serviceName={serviceId} />
      </div>

      <div id="dependencies" className="pt-4 scroll-mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Dependencies</h2>
        <div className="bg-white p-5 rounded-lg border border-gray-200">준비 중...</div>
      </div>

      <div id="traces" className="pt-4 scroll-mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Traces</h2>
        <TracesSection serviceName={serviceId} />
      </div>

      <div id="errors" className="pt-4 scroll-mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Errors</h2>
        <div className="bg-white p-5 rounded-lg border border-gray-200">준비 중...</div>
      </div>

      <div id="logs" className="pt-4 scroll-mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Logs</h2>
        <LogsSection serviceName={serviceId} />
      </div>
    </div>
  );
}
