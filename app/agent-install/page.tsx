'use client';

import Logo from '@/components/icons/Logo';
import { SiKubernetes, SiDocker, SiApple, SiAmazonecs } from 'react-icons/si';

export default function AgentInstallPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Install Panopticon Agent
          </h1>
          <p className="text-lg text-gray-600">컨테이너 플랫폼을 선택하고 에이전트를 설치하세요</p>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-center text-black">
            Container Platform 선택
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button className={`p-8 rounded-xl border-2 transition-all duration-200 text-black`}>
              <div className="flex flex-col items-center gap-4">
                <SiKubernetes className={`w-16 h-16`} />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Kubernetes</h3>
                  <p className="text-sm text-gray-600">
                    K8s 클러스터에서 에이전트를 DaemonSet으로 배포
                  </p>
                </div>
              </div>
            </button>
            {/* Docker Card */}
            <button className={`p-8 rounded-xl border-2 transition-all duration-200 text-black`}>
              <div className="flex flex-col items-center gap-4">
                <SiApple className={`w-16 h-16`} />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Kubernetes</h3>
                  <p className="text-sm text-gray-600">
                    K8s 클러스터에서 에이전트를 DaemonSet으로 배포
                  </p>
                </div>
              </div>
            </button>
            <button className={`p-8 rounded-xl border-2 transition-all duration-200 text-black`}>
              <div className="flex flex-col items-center gap-4">
                <SiDocker className={`w-16 h-16`} />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Kubernetes</h3>
                  <p className="text-sm text-gray-600">
                    K8s 클러스터에서 에이전트를 DaemonSet으로 배포
                  </p>
                </div>
              </div>
            </button>
            <button className={`p-8 rounded-xl border-2 transition-all duration-200 text-black`}>
              <div className="flex flex-col items-center gap-4">
                <SiAmazonecs className={`w-16 h-16`} />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Kubernetes</h3>
                  <p className="text-sm text-gray-600">
                    K8s 클러스터에서 에이전트를 DaemonSet으로 배포
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => (window.location.href = '/main')}
            className="text-gray-600 hover:text-gray-900 underline text-sm"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
