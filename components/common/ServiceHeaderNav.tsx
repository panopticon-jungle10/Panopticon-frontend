'use client';

import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { HiArrowLeft } from 'react-icons/hi2';

const tabs = ['Summary', 'Dashboards'];

export function ServiceHeaderNav() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const appId = params.appId;
  const serviceId = params.serviceId;

  if (!appId || !serviceId) {
    return null;
  }

  const basePath = '/apps/' + appId + '/services/' + serviceId;
  const isDashboards = pathname?.includes('/dashboards');

  const handleBack = () => {
    router.push('/apps/' + appId + '/services');
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-6 text-sm font-semibold">
          {tabs.map(function (tab) {
            const href = tab === 'Summary' ? basePath : basePath + '/dashboards';
            const isActive = tab === 'Summary' ? !isDashboards : !!isDashboards;
            return (
              <Link
                key={tab}
                href={href}
                className={
                  'pb-3 transition ' +
                  (isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700')
                }
              >
                {tab}
              </Link>
            );
          })}
        </div>

        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 shadow-sm transition hover:bg-gray-100"
        >
          <HiArrowLeft className="w-4 h-4" />
          서비스 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}
