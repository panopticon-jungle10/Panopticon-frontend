'use client';

import { useState } from 'react';
import { HiXMark, HiChevronLeft } from 'react-icons/hi2';
import { AGENTS, getDefaultAgentSetupValues } from '@/types/agent-install';
import type { AgentRuntime, AgentSetupFormValues } from '@/types/agent-install';
import InstrumentationMethodStep from './steps/InstrumentationMethodStep';
import RuntimeEnvironmentStep from './steps/RuntimeEnvironmentStep';
import TelemetryTypeStep from './steps/TelemetryTypeStep';
import LicenseKeyStep from './steps/LicenseKeyStep';
import InstallGuideStep from './steps/InstallGuideStep';
import ValidationStep from './steps/ValidationStep';

interface AgentSetupPanelProps {
  agentRuntime: AgentRuntime;
  onClose: () => void;
  onComplete?: (values: AgentSetupFormValues) => void;
}

type SetupStep = 'instrumentation' | 'runtime' | 'telemetry' | 'license' | 'guide' | 'validation';

export default function AgentSetupPanel({
  agentRuntime,
  onClose,
  onComplete,
}: AgentSetupPanelProps) {
  const [currentStep, setCurrentStep] = useState<SetupStep>('instrumentation');
  const [formValues, setFormValues] = useState<AgentSetupFormValues>(
    getDefaultAgentSetupValues({
      agentRuntime,
      framework: AGENTS.find((a) => a.id === agentRuntime)?.frameworks[0].id,
    }),
  );

  const agent = AGENTS.find((a) => a.id === agentRuntime);
  if (!agent) return null;

  const stepSequence: SetupStep[] = [
    'instrumentation',
    'runtime',
    'telemetry',
    'license',
    'guide',
    'validation',
  ];
  const currentStepIndex = stepSequence.indexOf(currentStep);

  const handleNext = (newValues?: Partial<AgentSetupFormValues>) => {
    if (newValues) {
      setFormValues((prev) => ({ ...prev, ...newValues }));
    }
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < stepSequence.length) {
      setCurrentStep(stepSequence[nextStepIndex]);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(stepSequence[currentStepIndex - 1]);
    }
  };

  const handleComplete = () => {
    onComplete?.(formValues);
  };

  const stepLabels: Record<SetupStep, string> = {
    instrumentation: 'Instrumentation',
    runtime: 'Runtime Env',
    telemetry: 'Telemetry',
    license: 'License Key',
    guide: 'Install Guide',
    validation: 'Validation',
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 헤더 */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
              Agent Setup
            </p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">{agent.label}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiXMark className="h-6 w-6" />
          </button>
        </div>

        {/* 진행 상황 표시 - 2줄 */}
        <div className="space-y-3">
          {/* 첫 번째 줄: Step 1-3 */}
          <div className="flex items-center justify-between gap-2">
            {stepSequence.slice(0, 3).map((step, index) => {
              const isActive = step === currentStep;
              const isCompleted = stepSequence.indexOf(step) < currentStepIndex;

              return (
                <div key={step} className="flex flex-1 items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full text-xs font-medium flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <span className="text-xs font-medium text-gray-600 truncate">
                    {stepLabels[step]}
                  </span>
                  {index < 2 && (
                    <div
                      className={`flex-1 border-t-2 min-w-2 ${
                        isCompleted ? 'border-green-600' : 'border-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* 두 번째 줄: Step 4-6 */}
          <div className="flex items-center justify-between gap-2">
            {stepSequence.slice(3).map((step, index) => {
              const isActive = step === currentStep;
              const isCompleted = stepSequence.indexOf(step) < currentStepIndex;

              return (
                <div key={step} className="flex flex-1 items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full text-xs font-medium flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 4}
                  </div>
                  <span className="text-xs font-medium text-gray-600 truncate">
                    {stepLabels[step]}
                  </span>
                  {index < 2 && (
                    <div
                      className={`flex-1 border-t-2 min-w-2 ${
                        isCompleted ? 'border-green-600' : 'border-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {currentStep === 'instrumentation' && (
          <InstrumentationMethodStep
            agent={agent}
            formValues={formValues}
            onChange={setFormValues}
            onNext={handleNext}
          />
        )}

        {currentStep === 'runtime' && (
          <RuntimeEnvironmentStep
            formValues={formValues}
            onChange={setFormValues}
            onNext={handleNext}
          />
        )}

        {currentStep === 'telemetry' && (
          <TelemetryTypeStep formValues={formValues} onChange={setFormValues} onNext={handleNext} />
        )}

        {currentStep === 'license' && (
          <LicenseKeyStep formValues={formValues} onChange={setFormValues} onNext={handleNext} />
        )}

        {currentStep === 'guide' && (
          <InstallGuideStep agent={agent} formValues={formValues} onNext={handleNext} />
        )}

        {currentStep === 'validation' && (
          <ValidationStep agent={agent} formValues={formValues} onComplete={handleComplete} />
        )}
      </div>

      {/* 푸터 */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HiChevronLeft className="h-4 w-4" />
            이전
          </button>

          <div className="text-sm text-gray-600">
            {currentStepIndex + 1} / {stepSequence.length}
          </div>

          {currentStep !== 'validation' && (
            <button
              onClick={() => handleNext()}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              다음
            </button>
          )}

          {currentStep === 'validation' && (
            <button
              onClick={handleComplete}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
