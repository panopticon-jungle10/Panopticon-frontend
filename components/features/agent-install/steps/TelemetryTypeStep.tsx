'use client';

import { TELEMETRY_TYPES } from '@/types/agent-install';
import type { AgentSetupFormValues, TelemetryType } from '@/types/agent-install';

interface TelemetryTypeStepProps {
  formValues: AgentSetupFormValues;
  onChange: (values: AgentSetupFormValues) => void;
  onNext: (values?: Partial<AgentSetupFormValues>) => void;
}

export default function TelemetryTypeStep({
  formValues,
  onChange,
  onNext,
}: TelemetryTypeStepProps) {
  const handleTelemetryToggle = (type: TelemetryType) => {
    const isSelected = formValues.telemetryTypes.includes(type);
    const newTypes = isSelected
      ? formValues.telemetryTypes.filter((t) => t !== type)
      : [...formValues.telemetryTypes, type];

    // Traces는 항상 포함되어야 함
    if (type === 'traces' && !isSelected) {
      onChange({ ...formValues, telemetryTypes: newTypes });
    } else if (type === 'traces' && isSelected && newTypes.length === 0) {
      // Traces 제거 방지
      return;
    } else {
      onChange({ ...formValues, telemetryTypes: newTypes });
    }
  };

  const isTracesSelected = formValues.telemetryTypes.includes('traces');

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">수집 데이터 종류</h3>
        <p className="text-gray-600">
          에이전트가 수집할 데이터 종류를 선택하세요. Traces는 필수 항목입니다.
        </p>
      </div>

      {/* 텔레메트리 타입 체크박스 */}
      <div className="space-y-3">
        {TELEMETRY_TYPES.map((telemetry) => {
          const isSelected = formValues.telemetryTypes.includes(telemetry.id);
          const isDisabled = telemetry.id === 'traces'; // Traces는 항상 활성화

          return (
            <label
              key={telemetry.id}
              className={`relative block rounded-lg border px-4 py-4 transition-all ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => !isDisabled && handleTelemetryToggle(telemetry.id)}
                disabled={isDisabled}
                className="sr-only"
              />
              <div className="flex items-start gap-3">
                <div
                  className={`h-5 w-5 rounded border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : isDisabled
                      ? 'border-gray-300 bg-gray-100'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{telemetry.label}</p>
                  <p className="mt-1 text-sm text-gray-600">{telemetry.description}</p>
                  {telemetry.default && (
                    <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      필수
                    </span>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* 데이터 수집 안내 */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h4 className="font-medium text-blue-900 mb-2">📊 수집되는 데이터</h4>
        <div className="space-y-2 text-sm text-blue-700">
          {formValues.telemetryTypes.includes('traces') && (
            <p>
              • <strong>Traces</strong>: 요청의 흐름과 성능 데이터
            </p>
          )}
          {formValues.telemetryTypes.includes('metrics') && (
            <p>
              • <strong>Metrics</strong>: CPU, 메모리, 응답시간 등 주요 지표
            </p>
          )}
          {formValues.telemetryTypes.includes('logs') && (
            <p>
              • <strong>Logs</strong>: 애플리케이션의 상세 로그
            </p>
          )}
          {formValues.telemetryTypes.includes('profiling') && (
            <p>
              • <strong>Profiling</strong>: CPU, 메모리 사용량 상세 분석
            </p>
          )}
        </div>
      </div>

      {/* 주의사항 */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h4 className="font-medium text-amber-900 mb-2">💡 팁</h4>
        <ul className="space-y-1 text-sm text-amber-800">
          <li>• Traces는 필수 항목이며, 항상 수집됩니다.</li>
          <li>• Profiling은 성능 오버헤드가 있을 수 있으니 필요할 때만 활성화하세요.</li>
          <li>• 나중에 대시보드에서 수집 항목을 변경할 수 있습니다.</li>
        </ul>
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
