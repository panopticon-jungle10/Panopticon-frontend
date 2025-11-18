'use client';

import { ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PiMonitorLight } from 'react-icons/pi';
import { StepIndicator } from './common/StepIndicator';
import { CopyableCodeBlock } from './common/CopyableCodeBlock';

type StepSection = {
  heading?: string;
  description?: string;
  code: string;
  language?: string;
};

type ScenarioStep = {
  subtitle: string;
  title: string;
  description: string;
  meta?: string;
  sections: StepSection[];
  checklist?: string[];
};

const steps: ScenarioStep[] = [
  {
    subtitle: 'Step 1 of 4',
    title: '프론트용 OpenTelemetry 패키지 설치',
    description:
      '브라우저에서 Trace를 생성·전송하기 위해 Next.js 프론트엔드에 필요한 OpenTelemetry 패키지를 설치합니다.',
    meta: '작업 유형: terminal',
    sections: [
      {
        code: `# [frontend 디렉터리]에서 실행합니다. (코드 파일 수정 없이 패키지만 설치)
npm install --save \\
  @opentelemetry/api@^1.9.0 \\
  @opentelemetry/sdk-trace-web@^2.2.0 \\
  @opentelemetry/exporter-trace-otlp-http@^0.208.0 \\
  @opentelemetry/instrumentation-fetch@^0.208.0 \\
  @opentelemetry/instrumentation-document-load@^0.54.0 \\
  @opentelemetry/resources@^2.2.0 \\
  @opentelemetry/core@^2.2.0 \\
  @opentelemetry/context-zone-peer-dep@^2.2.0 \\
  zone.js@^0.15.1`,
        language: 'bash',
      },
    ],
  },
  {
    subtitle: 'Step 2 of 4',
    title: '브라우저용 OTEL 초기화 파일 추가',
    description:
      '브라우저에서 실행되는 OpenTelemetry SDK를 초기화하고,\n\n페이지 로드(DocumentLoad)와 API 호출(Fetch)을 자동으로 Trace로 수집합니다.',
    meta: '작업 유형: 📄 새 파일 생성',
    sections: [
      {
        code: `// [새 파일] frontend/src/lib/otel-browser.ts

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
} from '@opentelemetry/semantic-conventions';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

const serviceName =
  process.env.NEXT_PUBLIC_SERVICE_NAME || 'frontend-service';
const deploymentEnv =
  process.env.NEXT_PUBLIC_DEPLOYMENT_ENV || 'development';
const otlpUrl =
  process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_URL ||
  'http://localhost:3005/producer/v1/traces';

const provider = new WebTracerProvider({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: serviceName,
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: deploymentEnv,
  }),
});

const exporter = new OTLPTraceExporter({
  url: otlpUrl,
});

provider.addSpanProcessor(
  new BatchSpanProcessor(exporter, {
    maxQueueSize: 50,
    scheduledDelayMillis: 5000,
  }),
);

provider.register({
  propagator: new W3CTraceContextPropagator(),
});

registerInstrumentations({
  instrumentations: [
    new DocumentLoadInstrumentation(),
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: /.*/,
      clearTimingResources: true,
    }),
  ],
});`,
        language: 'typescript',
      },
    ],
  },
  {
    subtitle: 'Step 3 of 4',
    title: 'Next.js 레이아웃에 OTEL Provider를 연결',
    description:
      '브라우저에서만 OTEL 초기화를 실행하기 위해 동적으로 otel-browser.ts를 로드하는 Provider 컴포넌트를 추가합니다.',
    meta: '📄 작업 유형: file-create & file-edit',
    sections: [
      {
        heading: '3-1. frontend/src/components/OtelProvider.tsx',
        code: `'use client';

import { ReactNode, useEffect } from 'react';

export default function OtelProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('../lib/otel-browser');
    }
  }, []);

  return <>{children}</>;
}`,
        language: 'typescript',
      },
      {
        heading: '3-2. frontend/src/app/layout.tsx',
        code: `import OtelProvider from '@/components/OtelProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <OtelProvider>{children}</OtelProvider>
      </body>
    </html>
  );
}`,
        language: 'typescript',
      },
    ],
  },
  {
    subtitle: 'Step 4 of 4',
    title: '환경 변수 설정 & Trace 수집 확인',
    description:
      '브라우저가 Panopticon Ingest 서버로 Trace를 전송할 수 있도록 서비스 이름과 OTLP 엔드포인트를 환경 변수로 설정합니다.',
    meta: '작업 유형: 📝 기존 환경 설정(.env) 파일에 값 추가 ',
    sections: [
      {
        code: `# [기존 또는 새 파일] frontend/.env.local
# 브라우저에서 사용 가능한 환경 변수를 추가합니다.

// [파일 예시] frontend/.env.local
NEXT_PUBLIC_SERVICE_NAME=your-frontend-service      # UI 서비스 이름
NEXT_PUBLIC_DEPLOYMENT_ENV=production               # 환경 이름 (예: development / staging / production)
NEXT_PUBLIC_OTEL_EXPORTER_OTLP_URL=https://api.jungle-panopticon.cloud/producer/v1/traces
# Panopticon 데이터 수집 서버 엔드포인트
`,
        language: 'bash',
      },
    ],
    checklist: [
      '프론트엔드 서버를 재시작합니다.',
      '브라우저를 새로고침합니다.',
      '간단한 페이지 이동이나 버튼 액션을 수행해 Trace를 발생시킵니다.',
      'Panopticon 대시보드에서 Trace 생성 여부를 확인합니다.',
    ],
  },
];

export default function FrontendTraceGuide() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = steps.length;
  const activeStep = useMemo(() => steps[currentStep - 1], [currentStep]);

  const handlePrev = () => setCurrentStep((prev) => Math.max(1, prev - 1));
  const handleNext = () => {
    if (currentStep === totalSteps) {
      router.push('/services');
      return;
    }
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="relative mb-12 w-full">
          <button
            onClick={() => router.push('/services')}
            className="absolute left-0 top-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            {'\ub2e4\ub978 \uc2dc\ub098\ub9ac\uc624 \uc120\ud0dd'}
          </button>
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            className="sticky top-6 z-20"
          />
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white/95 p-8 shadow-xl shadow-blue-100/40">
          <div className="flex flex-wrap items-start gap-4 border-b border-blue-50 pb-6">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <PiMonitorLight className="h-10 w-10" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-500">{activeStep.subtitle}</p>
              <h1 className="mt-1 text-3xl font-bold text-gray-900">{activeStep.title}</h1>
              {activeStep.meta && (
                <p className="mt-2 text-sm font-semibold text-gray-500">{activeStep.meta}</p>
              )}
            </div>
          </div>

          <p className="mt-6 text-base text-gray-700">{activeStep.description}</p>

          <div className="mt-8 space-y-6">
            {activeStep.sections.map((section, index) => (
              <div
                key={section.heading ?? `${activeStep.subtitle}-${index}`}
                className="rounded-xl border border-gray-200 bg-gray-50/80 p-5"
              >
                {section.heading && (
                  <h3 className="mb-2 text-sm font-semibold text-gray-900">{section.heading}</h3>
                )}
                {section.description && (
                  <p className="text-sm text-gray-600">{section.description}</p>
                )}
                <CopyableCodeBlock
                  code={section.code}
                  language={section.language}
                  className="mt-4"
                />
              </div>
            ))}
          </div>

          {currentStep === totalSteps && activeStep.checklist && (
            <div className="mt-10 rounded-xl border border-green-200 bg-green-50 p-6">
              <h3 className="text-lg font-semibold text-green-900">
                {'\ucd5c\uc885 \ud655\uc778'}
              </h3>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm text-green-800">
                {activeStep.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
            >
              이전 단계
            </button>
            <button
              onClick={handleNext}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {currentStep === totalSteps
                ? '\ub300\uc2dc\ubcf4\ub4dc\ub85c \uc774\ub3d9'
                : '\ub2e4\uc74c \ub2e8\uacc4'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
