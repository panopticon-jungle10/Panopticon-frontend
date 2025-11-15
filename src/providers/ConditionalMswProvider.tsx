'use client';

import { ReactNode, useEffect, useState } from 'react';

/**
 * MSW Provider Wrapper
 * 개발 환경에서만 MSW를 동적으로 로드합니다.
 * production 빌드 시에는 mocks 폴더를 참조하지 않습니다.
 */
export default function ConditionalMswProvider({ children }: { children: ReactNode }) {
  const [MswComponent, setMswComponent] = useState<React.ComponentType<{ children: ReactNode }> | null>(null);

  useEffect(() => {
    // MSW 활성화 여부 확인
    if (process.env.NEXT_PUBLIC_ENABLE_MOCKING === 'true') {
      // 런타임에만 동적 import 시도
      import('@/mocks/MswProvider')
        .then((module) => {
          setMswComponent(() => module.default);
        })
        .catch(() => {
          // mocks 폴더가 없으면 무시
          console.warn('[MSW] MswProvider not found, skipping...');
        });
    }
  }, []);

  // MSW가 로드되지 않았거나 비활성화된 경우 children만 반환
  if (!MswComponent) {
    return <>{children}</>;
  }

  // MSW가 로드된 경우 래핑
  return <MswComponent>{children}</MswComponent>;
}
