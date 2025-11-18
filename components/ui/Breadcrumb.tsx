'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiChevronRight } from 'react-icons/hi2';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const PATH_LABELS: Record<string, string> = {
  services: '서비스 목록',
  dashboard: '대시보드',
  install: '설치',
  analysis: '분석',
  notifications: '알림 설정',
};

// Breadcrumb에서 제외할 경로들
const EXCLUDED_PATHS = ['settings'];

export default function Breadcrumb() {
  const pathname = usePathname();

  // 경로를 분리하고 빈 값 및 제외할 경로 제거
  const paths = pathname
    .split('/')
    .filter((path) => path && EXCLUDED_PATHS.includes(path) === false);

  // 홈만 있는 경우 breadcrumb 표시 안함
  if (paths.length === 0) {
    return null;
  }

  // breadcrumb 아이템 생성
  const breadcrumbs: BreadcrumbItem[] = [{ label: '홈', href: '/' }];

  // 원본 pathname을 사용하여 실제 href 생성
  const originalPaths = pathname.split('/').filter(Boolean);

  paths.forEach((path, index) => {
    // 원본 경로에서 해당하는 위치 찾기
    let originalIndex = 0;
    let matchCount = 0;

    for (let i = 0; i < originalPaths.length; i++) {
      if (EXCLUDED_PATHS.includes(originalPaths[i]) === false) {
        if (matchCount === index) {
          originalIndex = i;
          break;
        }
        matchCount++;
      }
    }

    const href = '/' + originalPaths.slice(0, originalIndex + 1).join('/');
    const isLast = index === paths.length - 1;

    // 라벨 결정: 매핑된 라벨이 있으면 사용, 없으면 원본 사용
    const label = PATH_LABELS[path] || decodeURIComponent(path);

    breadcrumbs.push({
      label,
      href: isLast ? undefined : href,
    });
  });

  return (
    <nav className="flex items-center gap-2 text-base" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="text-blue-600 hover:text-blue-800 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
          {index < breadcrumbs.length - 1 && <HiChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      ))}
    </nav>
  );
}
