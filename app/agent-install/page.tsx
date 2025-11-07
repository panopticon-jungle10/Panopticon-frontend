'use client';

import { useState } from 'react';
import Logo from '@/components/icons/Logo';
import { SiKubernetes, SiDocker, SiApple, SiAmazonecs, SiOpentelemetry } from 'react-icons/si';
import { IoArrowBack } from 'react-icons/io5';
import { FiCopy, FiCheck } from 'react-icons/fi';

type Platform = 'kubernetes' | 'docker' | 'ecs' | 'macos' | 'opentelemetry' | null;

export default function AgentInstallPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(null);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
  };

  const handleBack = () => {
    setSelectedPlatform(null);
  };

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const renderInstallationView = () => {
    const platforms = {
      docker: {
        icon: <SiDocker className="w-8 h-8 text-blue-500" />,
        title: 'Install the Panopticon Agent on Docker',
        command: `docker run -d --name panopticon-agent \\
  -e PANOPTICON_API_KEY=<YOUR_API_KEY> \\
  -e PANOPTICON_SITE="panopticon.com" \\
  -v /var/run/docker.sock:/var/run/docker.sock:ro \\
  -v /proc/:/host/proc/:ro \\
  -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro \\
  panopticon/agent:latest`,
      },
      kubernetes: {
        icon: <SiKubernetes className="w-8 h-8 text-blue-600" />,
        title: 'Install the Panopticon Agent on Kubernetes',
        command: `kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: panopticon-agent-config
data:
  PANOPTICON_API_KEY: "<YOUR_API_KEY>"
  PANOPTICON_SITE: "panopticon.com"
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: panopticon-agent
spec:
  selector:
    matchLabels:
      app: panopticon-agent
  template:
    metadata:
      labels:
        app: panopticon-agent
    spec:
      containers:
      - name: agent
        image: panopticon/agent:latest
        envFrom:
        - configMapRef:
            name: panopticon-agent-config
EOF`,
      },
      ecs: {
        icon: <SiAmazonecs className="w-8 h-8 text-orange-500" />,
        title: 'Install the Panopticon Agent on Amazon ECS',
        command: `{
  "family": "panopticon-agent",
  "containerDefinitions": [
    {
      "name": "panopticon-agent",
      "image": "panopticon/agent:latest",
      "environment": [
        {
          "name": "PANOPTICON_API_KEY",
          "value": "<YOUR_API_KEY>"
        },
        {
          "name": "PANOPTICON_SITE",
          "value": "panopticon.com"
        }
      ]
    }
  ]
}`,
      },
      macos: {
        icon: <SiApple className="w-8 h-8 text-gray-800" />,
        title: 'Install the Panopticon Agent on macOS',
        command: `# Download and install the Panopticon Agent
curl -L https://panopticon.com/agent/macos/install.sh | sh

# Configure the agent
sudo panopticon-agent config set api_key <YOUR_API_KEY>
sudo panopticon-agent config set site panopticon.com

# Start the agent
sudo panopticon-agent start`,
      },
      opentelemetry: {
        icon: <SiOpentelemetry className="w-8 h-8 text-purple-600" />,
        title: 'Install the Panopticon Agent with OpenTelemetry',
        command: `# Install OpenTelemetry Collector
curl -L https://panopticon.com/agent/otel/install.sh | sh

# Configure the collector
cat > otel-config.yaml <<EOF
receivers:
  otlp:
    protocols:
      grpc:
      http:

exporters:
  panopticon:
    endpoint: "https://panopticon.com"
    api_key: "<YOUR_API_KEY>"

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [panopticon]
EOF

# Start the collector
otelcol --config otel-config.yaml`,
      },
    };

    const platform = platforms[selectedPlatform as keyof typeof platforms];
    if (!platform) return null;

    return (
      <>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <IoArrowBack className="w-5 h-5" />
          <span>Select a different Platform</span>
        </button>

        <div className="bg-white test-black rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            {platform.icon}
            <h1 className="text-3xl font-bold text-black">{platform.title}</h1>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-4 text-black">
                    Customize your observability coverage
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-3">CORE OBSERVABILITY</p>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between p-3 bg-white rounded border">
                          <div>
                            <h3 className="font-semibold text-black">Infrastructure Monitoring</h3>
                            <p className="text-sm text-gray-600">
                              Full visibility into your infrastructure with performance metrics and
                              integrations.
                            </p>
                          </div>
                          <span className="text-sm text-gray-500 ml-4">Included</span>
                        </div>
                        <div className="flex items-start justify-between p-3 bg-white rounded border">
                          <div>
                            <h3 className="font-semibold text-black">
                              Application Performance Monitoring
                            </h3>
                            <p className="text-sm text-gray-600">
                              Instrument services to collect health metrics and trace distributed
                              requests.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-start justify-between p-3 bg-white rounded border">
                          <div>
                            <h3 className="font-semibold text-black">Log Management</h3>
                            <p className="text-sm text-gray-600">
                              Collect, analyze, and correlate logs from over 850 sources.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-4 text-black">Run the install command</h2>
                  <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
                    Select API Key
                  </button>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{platform.command}</code>
                    </pre>
                    <button
                      onClick={() => handleCopyCommand(platform.command)}
                      className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded text-white"
                    >
                      {copiedCommand ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        <FiCopy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
      </>
    );
  };

  const renderPlatformSelection = () => (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Install Panopticon Agent
        </h1>
        <p className="text-lg text-gray-600">플랫폼을 선택하고 에이전트를 설치하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Container Platform Column */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-center text-black">Container Platform</h2>
          <button
            onClick={() => handlePlatformSelect('kubernetes')}
            className="p-6 rounded-xl border-2 transition-all duration-200 text-black hover:border-blue-500 hover:shadow-lg"
          >
            <div className="flex flex-col items-center gap-4">
              <SiKubernetes className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Kubernetes</h3>
                <p className="text-sm text-gray-600">
                  K8s 클러스터에서 에이전트를 DaemonSet으로 배포해
                  <br />
                  서비스 데이터를 수집
                </p>
              </div>
            </div>
          </button>
          <button
            onClick={() => handlePlatformSelect('docker')}
            className="p-6 rounded-xl border-2 transition-all duration-200 text-black hover:border-blue-500 hover:shadow-lg"
          >
            <div className="flex flex-col items-center gap-4">
              <SiDocker className="w-12 h-12 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Docker</h3>
                <p className="text-sm text-gray-600">
                  Docker 컨테이너 내에서 에이전트를 실행해
                  <br />
                  서비스 데이터를 수집
                </p>
              </div>
            </div>
          </button>
          <button
            onClick={() => handlePlatformSelect('ecs')}
            className="p-6 rounded-xl border-2 transition-all duration-200 text-black hover:border-blue-500 hover:shadow-lg"
          >
            <div className="flex flex-col items-center gap-4">
              <SiAmazonecs className="w-12 h-12 text-orange-500" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Amazon ECS</h3>
                <p className="text-sm text-gray-600">
                  ECS 태스크에 에이전트를 포함해
                  <br />
                  서비스 데이터를 수집
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Host based Column */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-center text-black">Host based</h2>
          <button
            onClick={() => handlePlatformSelect('macos')}
            className="p-6 rounded-xl border-2 transition-all duration-200 text-black hover:border-blue-500 hover:shadow-lg"
          >
            <div className="flex flex-col items-center gap-4">
              <SiApple className="w-12 h-12 text-gray-800" />
              <div>
                <h3 className="text-lg font-semibold mb-2">macOS</h3>
                <p className="text-sm text-gray-600">
                  macOS 환경에 로컬 에이전트를 설치해
                  <br />
                  서비스 데이터를 수집
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Monitoring Column */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-center text-black">Monitoring</h2>
          <button
            onClick={() => handlePlatformSelect('opentelemetry')}
            className="p-6 rounded-xl border-2 transition-all duration-200 text-black hover:border-blue-500 hover:shadow-lg"
          >
            <div className="flex flex-col items-center gap-4">
              <SiOpentelemetry className="w-12 h-12 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold mb-2">OpenTelemetry</h3>
                <p className="text-sm text-gray-600">
                  OpenTelemetry SDK 또는 Collector로
                  <br />
                  서비스 데이터를 수집
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
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {selectedPlatform ? renderInstallationView() : renderPlatformSelection()}
      </div>
    </div>
  );
}
