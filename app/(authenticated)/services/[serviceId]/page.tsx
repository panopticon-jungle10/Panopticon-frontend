'use client';

import Link from 'next/link';
import LogsSection from '@/components/features/services/[serviceId]/section/Logs';
import TracesSection from '@/components/features/services/[serviceId]/section/Traces';
import ResourcesSection from '@/components/features/services/[serviceId]/section/Resources';
import { useParams } from 'next/navigation';
import OverviewSection from '@/components/features/services/[serviceId]/section/Overview';
import { HiArrowLeft } from 'react-icons/hi2';

export default function ServiceOverview() {
  const params = useParams();
  const serviceId = params.serviceId as string;

  return (
    <div className="space-y-8">
      <Link
        href="/services"
        className="inline-flex items-center gap-1 text-lg text-gray-600 hover:text-gray-900 transition"
      >
        {/* TODO : Breadcrumb로 변경 필요 */}
        <HiArrowLeft className="w-4 h-4" />
        서비스 목록으로 돌아가기
      </Link>

      <section id="overview" className="pt-4 scroll-mt-8">
        <OverviewSection serviceName={serviceId} />
      </section>

      <section id="resources" className="pt-4 scroll-mt-8">
        <ResourcesSection serviceName={serviceId} />
      </section>

      <section id="traces" className="pt-4 scroll-mt-8">
        <TracesSection serviceName={serviceId} />
      </section>

      <section id="errors-logs" className="pt-4 scroll-mt-8">
        <LogsSection serviceName={serviceId} />
      </section>
    </div>
  );
}
