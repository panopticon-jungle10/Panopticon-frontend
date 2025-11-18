'use client';

import { PiStackLight } from 'react-icons/pi';
import InstallGuideLayout from './Layout';
import type { InstallationStep } from '@/types/agent-install';

const steps: InstallationStep[] = [
  {
    title: 'Trace + Log 통합 가이드 준비 중',
    description:
      'Panopticon에서는 백엔드 Trace(OpenTelemetry)와 Log(Structured Logger + Fluent Bit)를 하나의 서비스로 엮어 보여줄 수 있도록 통합 가이드를 작성하고 있습니다. 현재는 Trace 전송은 오텔 Exporter, 로그 전송은 Backend Log 가이드를 그대로 따라 진행한 뒤 Panopticon 서비스 이름을 동일하게 맞추면 됩니다.',
  },
  {
    title: 'Collector · Fluent Bit 연결',
    description:
      'Trace 수집용 OpenTelemetry Collector와 로그 수집용 Fluent Bit을 각각 Panopticon Ingest URL, Log Ingest URL에 연결해 주세요. 동일한 `service_name` 값을 사용하면 Trace -> Log drill-down이 자동으로 동작합니다.',
  },
  {
    title: '맞춤 지원 요청',
    description:
      '멀티 클러스터, 멀티 언어 환경 등 복잡한 구성이면 Panopticon 담당자에게 현황을 전달해 주세요. Collector/Fluent Bit 설정 샘플과 검증 스크립트를 함께 전달드립니다.',
  },
];

export default function BackendLogTraceGuide() {
  return (
    <InstallGuideLayout
      title="Trace + Log 동시 수집 가이드 (준비 중)"
      description="백엔드 애플리케이션의 Trace와 Log를 한 번에 수집하는 통합 가이드를 정리하고 있습니다. 임시로 아래 단계를 참고하거나 담당자에게 상세 문서를 요청해 주세요."
      icon={<PiStackLight className="h-12 w-12" />}
      badges={[
        { label: 'Backend' },
        { label: 'Trace & Log', tone: 'secondary' },
      ]}
      steps={steps}
    >
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Trace 수집은 <strong>Backend Trace</strong>, 로그 수집은 <strong>Backend Log</strong>{' '}
        가이드를 먼저 적용해 주세요. 두 가이드를 모두 마친 뒤 Panopticon 대시보드에서 서비스
        이름이 동일하게 표시되면 통합 추적 기능을 바로 확인할 수 있습니다.
      </div>
    </InstallGuideLayout>
  );
}
