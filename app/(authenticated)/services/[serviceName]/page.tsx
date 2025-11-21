'use client';

import LogsSection from '@/components/features/services/[serviceName]/section/Logs';
import TracesSection from '@/components/features/services/[serviceName]/section/Traces';
import ResourcesSection from '@/components/features/services/[serviceName]/section/Resources';
import { useParams } from 'next/navigation';
import OverviewSection from '@/components/features/services/[serviceName]/section/Overview';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ServiceOverview() {
  const params = useParams();
  const serviceName = params.serviceName as string;

  return (
    <div className="space-y-8">
      <Breadcrumb />

      <section id="overview" className="pt-4 scroll-mt-8">
        <OverviewSection serviceName={serviceName} />
      </section>

      <section id="resources" className="pt-4 scroll-mt-8">
        <ResourcesSection serviceName={serviceName} />
      </section>

      <section id="traces" className="pt-4 scroll-mt-8">
        <TracesSection serviceName={serviceName} />
      </section>

      <section id="logs" className="pt-4 scroll-mt-8">
        <LogsSection serviceName={serviceName} />
      </section>
    </div>
  );
}
