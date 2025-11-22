'use client';

import { useState } from 'react';
import { AGENTS } from '@/types/install-agent';
import type { AgentRuntime, AgentSetupFormValues } from '@/types/install-agent';
import SlideOverLayout from '@/components/ui/SlideOverLayout';
import AgentSetupPanel from './AgentSetupPanel';

export default function AgentSelectionPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentRuntime | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleAgentSelect = (agentId: AgentRuntime) => {
    setSelectedAgent(agentId);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedAgent(null);
  };

  const handleSetupComplete = (values: AgentSetupFormValues) => {
    // TODO: 서비스 생성 API 호출
    console.log('Setup complete:', values);
    handlePanelClose();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
            Agent Installation
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">에이전트 설치</h1>
          <p className="mt-2 text-gray-600">
            서비스의 런타임 환경에 맞는 에이전트를 선택하여 설치를 시작하세요.
          </p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => handleAgentSelect(agent.id)}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-left transition-all hover:border-blue-400 hover:shadow-lg"
            >
              {/* 배경 그라디언트 */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative z-10 space-y-4">
                {/* 아이콘 또는 레이블 */}
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-lg font-bold text-blue-600">
                  {agent.label.charAt(0)}
                </div>

                {/* 타이틀 */}
                <h3 className="text-lg font-semibold text-gray-900">{agent.label}</h3>

                {/* 설명 */}
                <p className="text-sm text-gray-600">{agent.description}</p>

                {/* 프레임워크 목록 */}
                <div className="space-y-1 border-t border-gray-200 pt-4">
                  <p className="text-xs font-medium text-gray-500">지원하는 프레임워크</p>
                  <ul className="space-y-1">
                    {agent.frameworks.slice(0, 3).map((fw) => (
                      <li key={fw.id} className="text-xs text-gray-600">
                        • {fw.label}
                      </li>
                    ))}
                    {agent.frameworks.length > 3 && (
                      <li className="text-xs text-gray-500">외 {agent.frameworks.length - 3}개</li>
                    )}
                  </ul>
                </div>

                {/* Arrow 아이콘 */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-sm font-medium text-blue-600">설치 시작</span>
                  <svg
                    className="h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SlideOver 패널 */}
      <SlideOverLayout
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        widthClass="w-full md:w-[900px] lg:w-[1000px]"
        panelClassName="fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0 overflow-y-auto"
      >
        {selectedAgent && (
          <AgentSetupPanel
            agentRuntime={selectedAgent}
            onClose={handlePanelClose}
            onComplete={handleSetupComplete}
          />
        )}
      </SlideOverLayout>
    </div>
  );
}
