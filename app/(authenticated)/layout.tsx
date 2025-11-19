import { AuthenticatedHeader } from '@/components/common/authenticated/Header';
import { AlarmProvider } from '@/src/providers/AlarmProvider';
import type { ReactNode } from 'react';

export default function mainLayout({ children }: { children: ReactNode }) {
  return (
    <AlarmProvider>
      <div className="h-screen flex flex-col">
        <AuthenticatedHeader />
        <main className="flex-1 overflow-y-auto w-full">{children}</main>
      </div>
    </AlarmProvider>
  );
}
