'use client';

import { useState } from 'react';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import type { Agent, AgentSetupFormValues } from '@/types/install-agent';

interface LicenseKeyStepProps {
  agent: Agent;
  formValues: AgentSetupFormValues;
  onChange: (values: AgentSetupFormValues) => void;
  onNext: (values?: Partial<AgentSetupFormValues>) => void;
}

export default function LicenseKeyStep({ formValues, onChange, onNext }: LicenseKeyStepProps) {
  const [showKey, setShowKey] = useState(false);
  const [errors, setErrors] = useState<{ licenseKey?: string; serviceName?: string }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formValues.licenseKey.trim()) {
      newErrors.licenseKey = 'License Key는 필수입니다';
    }

    if (!formValues.serviceName.trim()) {
      newErrors.serviceName = 'Service Name은 필수입니다';
    } else if (formValues.serviceName.length > 100) {
      newErrors.serviceName = 'Service Name은 100자 이하여야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({ licenseKey: formValues.licenseKey, serviceName: formValues.serviceName });
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* License Key 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          License Key / API Key <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={formValues.licenseKey}
            onChange={(e) => {
              onChange({ ...formValues, licenseKey: e.target.value });
              if (errors.licenseKey) setErrors({ ...errors, licenseKey: undefined });
            }}
            placeholder="예: ppt_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.licenseKey ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showKey ? <HiEyeSlash className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
          </button>
        </div>
        {errors.licenseKey && <p className="mt-1 text-sm text-red-600">{errors.licenseKey}</p>}
        <p className="mt-2 text-xs text-gray-500">
          License Key는 대시보드 설정 페이지에서 확인할 수 있습니다.
        </p>
      </div>

      {/* Service Name 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Service Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formValues.serviceName}
          onChange={(e) => {
            onChange({ ...formValues, serviceName: e.target.value });
            if (errors.serviceName) setErrors({ ...errors, serviceName: undefined });
          }}
          placeholder="예: my-api-service"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.serviceName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.serviceName && <p className="mt-1 text-sm text-red-600">{errors.serviceName}</p>}
        <p className="mt-2 text-xs text-gray-500">
          이 이름은 Panopticon 대시보드에서 서비스를 식별하는 데 사용됩니다.
        </p>
      </div>

      {/* Environment 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">실행 환경</label>
        <select
          value={formValues.serviceEnvironment}
          onChange={(e) => onChange({ ...formValues, serviceEnvironment: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="development">Development</option>
          <option value="staging">Staging</option>
          <option value="production">Production</option>
        </select>
      </div>

      {/* 안내 박스 */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h4 className="font-medium text-amber-900 mb-2">⚠️ 중요 정보</h4>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• License Key는 안전하게 보관하세요. 외부에 공개되면 안 됩니다.</li>
          <li>• Service Name은 소문자, 숫자, 하이픈만 사용 가능합니다.</li>
          <li>• 이후 환경 변수로 이 정보들이 자동으로 설정됩니다.</li>
        </ul>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        className="w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        다음 단계로
      </button>
    </div>
  );
}
