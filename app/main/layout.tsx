import { Header } from '@/components/common/app/Header';
import type { ReactNode } from 'react';

export default function mainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="w-screen h-screen p-6">{children}</main>
    </>
  );
}
