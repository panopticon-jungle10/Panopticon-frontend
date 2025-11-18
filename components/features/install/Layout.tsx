'use client';

import { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { CopyableCodeBlock } from '@/components/features/install/common/CopyableCodeBlock';
import type { InstallationStep } from '@/types/agent-install';

export type InstallGuideBadge = {
  label: string;
  tone?: 'primary' | 'secondary';
};

export interface InstallGuideLayoutProps extends PropsWithChildren {
  title: string;
  description: string;
  icon?: React.ReactNode;
  badges?: InstallGuideBadge[];
  steps: InstallationStep[];
  backLabel?: string;
  backHref?: string;
  onBackClick?: () => void;
}

export default function InstallGuideLayout({
  title,
  description,
  icon,
  badges = [],
  steps,
  backLabel = '설치 옵션 다시 선택',
  backHref = '/services',
  onBackClick,
  children,
}: InstallGuideLayoutProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }

    if (backHref) {
      router.push(backHref);
      return;
    }

    router.back();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <button
          onClick={handleBackClick}
          className="mb-8 flex items-center gap-2 text-blue-600 transition hover:text-blue-700"
        >
          <IoArrowBack className="h-5 w-5" />
          <span>{backLabel}</span>
        </button>

        <header className="mb-10 flex flex-wrap items-center gap-4 rounded-2xl border border-blue-100 bg-white/70 p-6 shadow-sm">
          {icon && <div className="text-blue-600">{icon}</div>}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
              설치 가이드
            </p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">{title}</h1>
            <p className="mt-2 text-gray-600">{description}</p>
          </div>
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    badge.tone === 'secondary'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}
        </header>

        <section className="space-y-8">
          {steps.map((step, index) => (
            <article
              key={`${step.title}-${index}`}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                  {index + 1}
                </span>
                <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
              </div>
              {step.description && <p className="mb-4 text-gray-600">{step.description}</p>}
              {step.code && <CopyableCodeBlock code={step.code} language={step.language} />}
            </article>
          ))}
        </section>

        {children && <div className="mt-12 space-y-6">{children}</div>}
      </div>
    </div>
  );
}
