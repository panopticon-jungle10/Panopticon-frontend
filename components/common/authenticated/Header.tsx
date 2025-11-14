'use client';

import { FiBell, FiUser, FiSettings } from 'react-icons/fi';
import { useParams } from 'next/navigation';
import { HeaderDropdown } from './HeaderDropdown';
import Logo from '@/components/icons/Logo';
import { useMemo } from 'react';

export const AuthenticatedHeader = () => {
  const params = useParams();

  // URL에서 appId 추출
  const appId = params?.appId as string | undefined;

  // Setting 드롭다운 아이템 (동적으로 생성)
  const settingItems = useMemo(() => {
    const items = [
      {
        href: '/apps',
        label: 'App Register',
        ariaLabel: 'Go to App Register page',
      },
    ];

    // appId가 있으면 Install Agents 메뉴 추가
    if (appId) {
      items.push({
        href: `/apps/${appId}/install`,
        label: 'Install Agents',
        ariaLabel: 'Go to Install Agents page',
      });
    }

    return items;
  }, [appId]);

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
              triggerIcon={<FiSettings className="w-6 h-6 text-zinc-700" />}
              triggerLabel="Setting menu"
              triggerHref="/apps"
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
            <button className="hover:text-blue-600 transition">
              <FiUser className="w-7 h-7 text-zinc-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
