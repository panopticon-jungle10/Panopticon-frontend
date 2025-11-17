'use client';

import { useEffect, useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import {
  SERVICE_ENVIRONMENT_OPTIONS,
  SERVICE_LANGUAGE_OPTIONS,
  getDefaultServiceFormValues,
} from '@/types/serviceSetup';
import type {
  CreateServiceFormValues,
  CreateServiceModalProps,
  ServiceModalMode,
} from '@/types/serviceSetup';

export default function CreateServiceModal({
  open,
  mode = 'create',
  onClose,
  onSubmit,
  initialValues,
}: CreateServiceModalProps) {
  const [formValues, setFormValues] = useState<CreateServiceFormValues>(
    getDefaultServiceFormValues(initialValues),
  );

  useEffect(() => {
    if (!open) return undefined;
    const raf = requestAnimationFrame(() => {
      setFormValues(getDefaultServiceFormValues(initialValues));
    });
    return () => cancelAnimationFrame(raf);
  }, [initialValues, open]);

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit?.(formValues);
  };

  const isSubmitDisabled =
    !formValues.serviceName || (!formValues.collectLogs && !formValues.collectTraces);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <p className="text-xs text-blue-500 font-semibold">Service List</p>
            <h2 className="text-xl text-gray-900">
              {mode === 'edit' ? '서비스 설정 수정' : '서비스 생성'}
            </h2>
          </div>
          <button onClick={onClose} aria-label="닫기" className="text-gray-400 hover:text-gray-600 transition-colors">
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                서비스 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formValues.serviceName}
                onChange={(event) => setFormValues((prev) => ({ ...prev, serviceName: event.target.value }))}
                placeholder="예: user-service"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">영문, 숫자, 하이픈(-)만 사용 가능합니다.</p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                언어 <span className="text-red-500">*</span>
              </label>
              <select
                value={formValues.language}
                onChange={(event) => setFormValues((prev) => ({ ...prev, language: event.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {SERVICE_LANGUAGE_OPTIONS.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                배포환경 <span className="text-red-500">*</span>
              </label>
              <select
                value={formValues.environment}
                onChange={(event) => setFormValues((prev) => ({ ...prev, environment: event.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {SERVICE_ENVIRONMENT_OPTIONS.map((environment) => (
                  <option key={environment.value} value={environment.value}>
                    {environment.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-3">
                수집객체 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formValues.collectLogs}
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, collectLogs: event.target.checked }))
                    }
                    className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">로그 (Logs)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formValues.collectTraces}
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, collectTraces: event.target.checked }))
                    }
                    className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">트레이스 (Traces)</span>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm text-blue-900 mb-2">📦 Agent 설치 안내</h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                서비스 생성 후 Agent를 설치하셔야 데이터 수집이 시작됩니다. 설치 가이드는 생성 완료 페이지에서 확인하실 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="px-6 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'edit' ? '설정 저장' : '설치시작'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
