'use client';

import { PiPulseLight } from 'react-icons/pi';
import InstallGuideLayout from './Layout';
import type { InstallationStep } from '@/types/agent-install';

const steps: InstallationStep[] = [
  {
    title: '가이드 문서 준비 중',
    description:
      'Panopticon 백엔드 Trace 연동 가이드는 최신 SDK 기준으로 재작성 중입니다. 기존 서비스에서 사용 중인 OpenTelemetry SDK와 Collector 구성을 유지하면서 OTLP HTTP/GRPC Exporter의 엔드포인트를 Panopticon Ingest URL (https://api.jungle-panopticon.cloud/producer/v1/traces)로 변경하면 Trace를 바로 전송할 수 있습니다.',
  },
  {
    title: '환경별 맞춤 설정이 필요하신가요?',
    description:
      'Apm 서버, 언어 런타임, 배포 방식(예: Kubernetes, Docker, VM) 정보와 함께 Panopticon 담당자에게 문의해 주세요. Collector 설정 예시, 샘플 코드, 대시보드 확인 방법을 단계별로 전달드립니다.',
  },
];

export default function BackendTraceGuide() {
  return (
    <InstallGuideLayout
      title="Backend Trace 설치 가이드 (준비 중)"
      description="백엔드 애플리케이션의 분산 추적 수집 가이드를 정리하는 중입니다. 아래 임시 안내를 참고하거나 담당자에게 직접 요청해 주세요."
      icon={<PiPulseLight className="h-12 w-12" />}
      badges={[
        { label: 'Backend' },
        { label: 'Trace 수집', tone: 'secondary' },
      ]}
      steps={steps}
    >
      <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-900">
        자세한 스크립트가 필요한 경우 Slack 지원 채널 또는 Panopticon CS 메일로 문의하면 개별
        설치 문서를 가장 먼저 받아볼 수 있습니다.
      </div>
    </InstallGuideLayout>
  );
}
