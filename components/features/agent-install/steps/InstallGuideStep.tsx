'use client';

import { useState } from 'react';
import { HiCheckCircle, HiDocumentDuplicate } from 'react-icons/hi2';
import type { Agent, AgentSetupFormValues } from '@/types/install-agent';
import CodeBlock from '../CodeBlock';

interface InstallGuideStepProps {
  agent: Agent;
  formValues: AgentSetupFormValues;
  onNext: (values?: Partial<AgentSetupFormValues>) => void;
}

export default function InstallGuideStep({ agent, formValues, onNext }: InstallGuideStepProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const selectedFramework = agent.frameworks.find((f) => f.id === formValues.framework);

  // 프레임워크별 설치 가이드
  const getInstallGuide = () => {
    const baseEnv = `OTEL_SERVICE_NAME=${formValues.serviceName}
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:3005
OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer%20${formValues.licenseKey}`;

    if (agent.id === 'nodejs') {
      const npmInstall = `npm install --save \\
  @opentelemetry/api@^1.9.0 \\
  @opentelemetry/sdk-node@^0.208.0 \\
  @opentelemetry/auto-instrumentations-node@^0.67.0 \\
  @opentelemetry/exporter-trace-otlp-http@^0.208.0 \\
  @opentelemetry/resources@^2.2.0 \\
  @opentelemetry/semantic-conventions@^1.38.0`;

      const tracingFile = `// src/tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
} from '@opentelemetry/semantic-conventions';

const serviceName = process.env.OTEL_SERVICE_NAME || '${formValues.serviceName}';
const environment = process.env.NODE_ENV || '${formValues.serviceEnvironment}';
const tracesEndpoint =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
  'http://host.docker.internal:3005/producer/v1/traces';

const resource = new Resource({
  [SEMRESATTRS_SERVICE_NAME]: serviceName,
  [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: environment,
});

const traceExporter = new OTLPTraceExporter({ url: tracesEndpoint });

const sdk = new NodeSDK({
  resource,
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((log) => console.log('Error terminating tracing', log))
    .finally(() => process.exit(0));
});`;

      const mainImport = `// app.ts 또는 main.ts 최상단에
import './tracing';

// 나머지 코드...`;

      const envFile = `.env
${baseEnv}`;

      return [
        {
          title: 'Step 1: NPM 패키지 설치',
          description: 'OpenTelemetry 필요 패키지를 설치합니다.',
          code: npmInstall,
          language: 'bash',
        },
        {
          title: 'Step 2: tracing.ts 파일 생성',
          description: '애플리케이션 시작 시 NodeSDK를 초기화합니다.',
          code: tracingFile,
          language: 'typescript',
        },
        {
          title: 'Step 3: 메인 파일에서 tracing import',
          description: '애플리케이션 진입점 최상단에서 tracing을 import합니다.',
          code: mainImport,
          language: 'typescript',
        },
        {
          title: 'Step 4: 환경변수 설정',
          description: '.env 파일에 다음 내용을 추가합니다.',
          code: envFile,
          language: 'bash',
        },
      ];
    }

    if (agent.id === 'python') {
      const pipInstall = `pip install opentelemetry-api \\
    opentelemetry-sdk \\
    opentelemetry-exporter-otlp \\
    opentelemetry-instrumentation \\
    opentelemetry-instrumentation-fastapi \\
    opentelemetry-instrumentation-requests`;

      const pythonInit = `# main.py 또는 __init__.py
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

import os

# 환경변수 설정
service_name = os.getenv('OTEL_SERVICE_NAME', '${formValues.serviceName}')
otlp_exporter_endpoint = os.getenv('OTEL_EXPORTER_OTLP_ENDPOINT', 'http://localhost:3005/v1/traces')

# Resource 생성
resource = Resource(attributes={
    SERVICE_NAME: service_name,
    "deployment.environment": os.getenv('NODE_ENV', '${formValues.serviceEnvironment}')
})

# Tracer Provider 설정
trace_provider = TracerProvider(resource=resource)
otlp_exporter = OTLPSpanExporter(endpoint=otlp_exporter_endpoint)
trace_provider.add_span_processor(BatchSpanProcessor(otlp_exporter))
trace.set_tracer_provider(trace_provider)

# FastAPI 자동 계측
if '[fastapi]' in '${selectedFramework?.label}':
    FastAPIInstrumentor.instrument_app(app)`;

      const envFile = `.env
${baseEnv.replace('OTEL_EXPORTER_OTLP_ENDPOINT', 'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT')}`;

      return [
        {
          title: 'Step 1: pip으로 패키지 설치',
          description: 'OpenTelemetry Python 패키지를 설치합니다.',
          code: pipInstall,
          language: 'bash',
        },
        {
          title: 'Step 2: Tracer 초기화',
          description: '애플리케이션 시작 시 Tracer를 초기화합니다.',
          code: pythonInit,
          language: 'python',
        },
        {
          title: 'Step 3: 환경변수 설정',
          description: '.env 파일에 다음 내용을 추가합니다.',
          code: envFile,
          language: 'bash',
        },
      ];
    }

    // Java 가이드
    if (agent.id === 'java') {
      const mvnDep = `<dependency>
  <groupId>io.opentelemetry</groupId>
  <artifactId>opentelemetry-api</artifactId>
  <version>1.39.0</version>
</dependency>
<dependency>
  <groupId>io.opentelemetry</groupId>
  <artifactId>opentelemetry-sdk</artifactId>
  <version>1.39.0</version>
</dependency>
<dependency>
  <groupId>io.opentelemetry</groupId>
  <artifactId>opentelemetry-exporter-otlp</artifactId>
  <version>1.39.0</version>
</dependency>`;

      const envFile = `.env
${baseEnv}`;

      return [
        {
          title: 'Step 1: Maven 의존성 추가',
          description: 'pom.xml에 OpenTelemetry 의존성을 추가합니다.',
          code: mvnDep,
          language: 'xml',
        },
        {
          title: 'Step 2: 환경변수 설정',
          description: '.env 파일에 다음 내용을 추가합니다.',
          code: envFile,
          language: 'bash',
        },
      ];
    }

    return [];
  };

  const guides = getInstallGuide();

  const handleCopy = (index: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">설치 가이드</h3>
        <p className="text-gray-600">
          {selectedFramework?.label} ({agent.label})에 에이전트를 설치하는 단계별 가이드입니다.
        </p>
      </div>

      {/* 설치 단계들 */}
      <div className="space-y-6">
        {guides.map((guide, index) => (
          <div key={index} className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900">{guide.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{guide.description}</p>
            </div>
            <div className="relative">
              <CodeBlock code={guide.code} language={guide.language} />
              <button
                onClick={() => handleCopy(index, guide.code)}
                className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 transition-colors"
              >
                {copiedIndex === index ? (
                  <>
                    <HiCheckCircle className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <HiDocumentDuplicate className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 체크리스트 */}
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <h4 className="font-medium text-green-900 mb-3">✓ 완료 체크리스트</h4>
        <ul className="space-y-2 text-sm text-green-800">
          <li className="flex items-center gap-2">
            <input type="checkbox" disabled className="h-4 w-4" />
            <span>위 단계별로 에이전트를 설치했습니다</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" disabled className="h-4 w-4" />
            <span>환경변수를 설정했습니다</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" disabled className="h-4 w-4" />
            <span>애플리케이션을 재시작했습니다</span>
          </li>
        </ul>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={() => onNext()}
        className="w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        다음 단계로 (Validation)
      </button>
    </div>
  );
}
