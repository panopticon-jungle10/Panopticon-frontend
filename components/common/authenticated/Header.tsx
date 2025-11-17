'use client';

import { FiBell, FiSettings, FiLayers } from 'react-icons/fi';
import { HeaderDropdown } from './HeaderDropdown';
import { UserProfile } from './UserProfile';
import Logo from '@/components/icons/Logo';

export const AuthenticatedHeader = () => {
  // Setting 드롭다운 아이템
  const settingItems = [
    {
      href: '/services',
      label: 'App Register',
      ariaLabel: 'Go to App Register page',
    },
    {
      href: '/services/install',
      label: 'Install Agents',
      ariaLabel: 'Go to Install Agents page',
    },
  ];

  // APM 드롭다운 아이템
  const apmItems = [
    {
      href: '/services',
      label: 'Service list',
      ariaLabel: 'Go to the service list for this app',
    },
    {
      href: '/services/user-service',
      label: 'Summary',
      ariaLabel: 'Go to the summary view for user-service',
    },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white shadow-md font-sans">
      <div className="flex items-center px-6 py-4">
        <div className="shrink-0">
          <Logo />
        </div>

        {/* 오른쪽 아이콘들: Setting 드롭다운 */}
        <div className="ml-auto flex items-center gap-6">
          <div className="flex items-center gap-5">
            <HeaderDropdown
              triggerIcon={<FiLayers className="w-6 h-6 text-zinc-700" />}
              triggerLabel="APM menu"
              triggerHref="/services"
              title="APM"
              items={apmItems}
            />
            <HeaderDropdown
              triggerIcon={<FiSettings className="w-6 h-6 text-zinc-700" />}
              triggerLabel="Setting menu"
              triggerHref="/services"
              title="Setting"
              items={settingItems}
            />
          </div>

          {/* 구분선 */}
          <div className="h-6 w-px bg-zinc-300" />

          {/* 알림, 마이페이지 */}
          <div className="flex items-center gap-5">
            <button className="hover:text-blue-600 transition">
              <FiBell className="w-7 h-7 text-zinc-700" />
            </button>
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
};
