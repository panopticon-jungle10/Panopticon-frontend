'use client';

import { INSTRUMENTATION_METHODS } from '@/src/constants/agent-install';
import type { Agent, AgentSetupFormValues, InstrumentationMethod } from '@/types/agent-install';

interface InstrumentationMethodStepProps {
  agent: Agent;
  formValues: AgentSetupFormValues;
  onChange: (values: AgentSetupFormValues) => void;
  onNext: (values?: Partial<AgentSetupFormValues>) => void;
}

export default function InstrumentationMethodStep({
  agent,
  formValues,
  onChange,
  onNext,
}: InstrumentationMethodStepProps) {
  const handleMethodChange = (method: InstrumentationMethod) => {
    onChange({ ...formValues, instrumentationMethod: method });
  };

  const handleFrameworkChange = (framework: string) => {
    onChange({ ...formValues, framework });
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* 프레임워크 선택 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">프레임워크 선택</h3>
        <div className="grid grid-cols-2 gap-3">
          {agent.frameworks.map((fw) => (
            <button
              key={fw.id}
              onClick={() => handleFrameworkChange(fw.id)}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors text-left ${
                formValues.framework === fw.id
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {fw.label}
            </button>
          ))}
        </div>
      </div>

      {/* Instrumentation Method 선택 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">계측 방법 선택</h3>
        <p className="text-sm text-gray-600 mb-4">
          에이전트가 서비스를 어떻게 계측할지 선택하세요.
        </p>

        <div className="space-y-3">
          {INSTRUMENTATION_METHODS.map((method) => (
            <label key={method.id} className="relative block">
              <input
                type="radio"
                name="instrumentationMethod"
                value={method.id}
                checked={formValues.instrumentationMethod === method.id}
                onChange={() => handleMethodChange(method.id)}
                className="sr-only"
              />
              <div
                className={`rounded-lg border px-4 py-4 cursor-pointer transition-colors ${
                  formValues.instrumentationMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`h-5 w-5 rounded-full border-2 mt-1 ${
                      formValues.instrumentationMethod === method.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {formValues.instrumentationMethod === method.id && (
                      <div className="h-full w-full flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{method.label}</p>
                    <p className="mt-1 text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 설명 박스 */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h4 className="font-medium text-blue-900 mb-2">📌 선택한 계측 방법</h4>
        <p className="text-sm text-blue-700">
          {formValues.instrumentationMethod === 'auto'
            ? '자동 계측은 설정 없이 자동으로 라이브러리를 감지하여 계측합니다. 가장 빠르고 간편합니다.'
            : formValues.instrumentationMethod === 'manual'
            ? '수동 계측은 코드에 직접 계측 코드를 작성하여 세밀한 제어가 가능합니다.'
            : 'Docker/Kubernetes 환경에서 환경변수로 기본 설정을 구성하여 계측합니다.'}
        </p>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={() => onNext()}
        className="w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        다음 단계로
      </button>
    </div>
  );
}
