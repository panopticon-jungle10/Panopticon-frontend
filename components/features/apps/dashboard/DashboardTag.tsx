'use client';

interface DashboardTagProps {
  name: string;
}

const tagColorMap: Record<string, { bg: string; text: string }> = {
  Backend: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Platform: { bg: 'bg-sky-100', text: 'text-sky-700' },
  Database: { bg: 'bg-purple-100', text: 'text-purple-700' },
  APM: { bg: 'bg-green-100', text: 'text-green-700' },
};

export function DashboardTag({ name }: DashboardTagProps) {
  const colors = tagColorMap[name] ?? { bg: 'bg-gray-100', text: 'text-gray-700' };
  const toneClass = `${colors.bg} ${colors.text}`;

  return (
    <span
      className={
        'inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold border uppercase tracking-wide ' +
        toneClass
      }
    >
      {name}
    </span>
  );
}
