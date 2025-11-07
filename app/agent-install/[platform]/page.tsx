'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Logo from '@/components/icons/Logo';
import { platformsData, PlatformType } from '../platforms';
import { IoArrowBack } from 'react-icons/io5';
import { FiCopy, FiCheck } from 'react-icons/fi';

export default function PlatformInstallPage() {
  const router = useRouter();
  const params = useParams();
  const [copiedCommand, setCopiedCommand] = useState(false);

  const platformKey = params.platform as PlatformType;
  const platform = platformsData[platformKey];

  if (!platform) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Platform not found</h1>
          <button
            onClick={() => router.push('/agent-install')}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Go back to platform selection
          </button>
        </div>
      </div>
    );
  }

  const handleCopyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      console.log('Command copied successfully');
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
      alert('Failed to copy command. Please try again or copy manually.');
    }
  };

  const handleBack = () => {
    router.push('/agent-install');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <IoArrowBack className="w-5 h-5" />
          <span>Select a different Platform</span>
        </button>

        <div className="bg-white test-black rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            {platform.iconLarge}
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
                <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-4 text-black">Run the install command</h2>
                  <button className="mb-4 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-700 text-sm font-medium">
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
            onClick={() => router.push('/main')}
            className="text-gray-600 hover:text-gray-900 underline text-sm"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
