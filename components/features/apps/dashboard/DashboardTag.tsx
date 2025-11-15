'use client';

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  Platform: { bg: "bg-blue-100", text: "text-blue-700" },
  Backend: { bg: "bg-indigo-100", text: "text-indigo-700" },
  Database: { bg: "bg-purple-100", text: "text-purple-700" },
  APM: { bg: "bg-green-100", text: "text-green-700" },
  SRE: { bg: "bg-orange-100", text: "text-orange-700" },
};

export function DashboardTag({ name }: { name: string }) {
  const c = COLOR_MAP[name] ?? { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <span
      className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text}`}
    >
      {name}
    </span>
  );
}
