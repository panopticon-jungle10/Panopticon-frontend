'use client';

import LogsSection from '@/components/features/apps/services/[serviceId]/section/Logs';
import TracesSection from '@/components/features/apps/services/[serviceId]/section/Traces';
import ResourcesSection from '@/components/features/apps/services/[serviceId]/section/Resources';
import { useParams } from 'next/navigation';
import OverviewSection from '@/components/features/apps/services/[serviceId]/section/Overview';

export default function ServiceOverview() {
  const params = useParams();
  const serviceId = params.serviceId as string;

  return (
    <div className="space-y-8">
      <section id="overview" className="pt-4 scroll-mt-8">
        <OverviewSection serviceName={serviceId} />
      </section>

      <section id="resources" className="pt-4 scroll-mt-8">
        <ResourcesSection serviceName={serviceId} />
      </section>

      <section id="traces" className="pt-4 scroll-mt-8">
        <TracesSection serviceName={serviceId} />
      </section>

      {/* <section id="errors-logs" className="pt-4 scroll-mt-8">
        <LogsSection serviceName={serviceId} />
      </section> */}
    </div>
  );
}
