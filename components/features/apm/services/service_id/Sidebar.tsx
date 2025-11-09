'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  IoChevronDown,
  IoChevronForward,
  IoEyeSharp,
  IoCubeSharp,
  IoPersonCircle,
  IoSettingsSharp,
} from 'react-icons/io5';
import { SiGoogleanalytics, SiRelay } from 'react-icons/si';
import { GrHostMaintenance } from 'react-icons/gr';
import { PiGraph } from 'react-icons/pi';
import { BiBug } from 'react-icons/bi';
import { HiOutlineDocumentText } from 'react-icons/hi';

export default function Sidebar() {
  const [selectedMenu, setSelectedMenu] = useState<'integration' | 'apm'>('apm');
  const [apmExpanded, setApmExpanded] = useState(true);

  const pathname = usePathname();
  const { serviceId } = useParams<{ serviceId: string }>();
  const base = `/main/apm/services/${serviceId}`;

  const apmItems = [
    { key: 'overview', label: 'Overview', icon: IoEyeSharp, href: base },
    { key: 'resources', label: 'Resources', icon: IoCubeSharp, href: `${base}/resources` },
    { key: 'dependencies', label: 'Dependencies', icon: PiGraph, href: `${base}/dependencies` },
    { key: 'traces', label: 'Traces', icon: SiRelay, href: `${base}/traces` },
    { key: 'errors', label: 'Errors', icon: BiBug, href: `${base}/errors` },
    { key: 'logs', label: 'Logs', icon: HiOutlineDocumentText, href: `${base}/logs` },
  ] as const;

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] flex flex-col border-r border-gray-200 bg-white">
      <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
        {/* Integration */}
        <button
          onClick={() => setSelectedMenu('integration')}
          className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium transition ${
            selectedMenu === 'integration'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <GrHostMaintenance className="w-5 h-5" />
          <span>Integration</span>
        </button>

        {/* APM */}
        <div>
          <button
            onClick={() => {
              setSelectedMenu('apm');
              setApmExpanded((v) => !v);
            }}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium transition ${
              selectedMenu === 'apm'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SiGoogleanalytics className="w-5 h-5" />
            <span className="flex-1 text-left">APM</span>
            {apmExpanded ? (
              <IoChevronDown className="w-4 h-4" />
            ) : (
              <IoChevronForward className="w-4 h-4" />
            )}
          </button>

          {apmExpanded && selectedMenu === 'apm' && (
            <div className="mt-1 ml-6 flex flex-col gap-1">
              {apmItems.map(({ key, label, icon: Icon, href }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={key}
                    href={href}
                    className={`w-full px-3 py-2 rounded-md flex items-center gap-2 text-sm transition ${
                      active
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <IoPersonCircle className="w-6 h-6 text-gray-500" />
          <div>
            <div className="text-sm text-gray-700">Admin User</div>
            <div className="text-xs text-gray-400">admin@example.com</div>
          </div>
        </div>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
          <IoSettingsSharp className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </aside>
  );
}
