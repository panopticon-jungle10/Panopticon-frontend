'use client';
import LogsSection from '../../../../../components/features/apm/services/[serviceId]/section/Logs';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import TracesSection from '@/components/features/apm/services/[serviceId]/section/Traces';
import ChartsSection from '@/components/features/apm/services/[serviceId]/section/Charts';

const TIME_RANGES = [
  { label: 'Past 5 Minutes', value: '5m' },
  { label: 'Past 30 Minutes', value: '30m' },
  { label: 'Past 1 Hour', value: '1h' },
  { label: 'Past 1 Day', value: '1d' },
  { label: 'Past 1 Week', value: '1w' },
  { label: 'Past 1 Month', value: '1mo' },
];

export default function ServiceOverview() {
  const [timeRange, setTimeRange] = useState('5m');
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div id="overview" className="flex justify-between items-center mb-2 scroll-mt-8">
        <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center justify-between gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-50 transition"
          >
            <span>{TIME_RANGES.find((t) => t.value === timeRange)?.label}</span>
            <FiChevronDown size={16} />
          </button>

          <AnimatePresence>
            {openDropdown && (
              <motion.ul
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-md z-20 overflow-hidden"
              >
                {TIME_RANGES.map((r) => (
                  <li
                    key={r.value}
                    onClick={() => {
                      setTimeRange(r.value);
                      setOpenDropdown(false);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      r.value === timeRange ? 'bg-gray-100 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {r.label}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 차트 영역 */}
      <ChartsSection timeRange={timeRange} />

      {/* Resources section - 준비중 */}
      <div id="resources" className="pt-4 scroll-mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Resources</h2>
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center text-gray-500">
          Coming soon...
        </div>
      </div>

      {/* Dependencies section - 준비중 */}
      <div id="dependencies" className="pt-4 scroll-mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Dependencies</h2>
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center text-gray-500">
          Coming soon...
        </div>
      </div>

      {/* Traces section */}
      <div id="traces" className='pt-4 scroll-mt-8'>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Traces</h2>
        <TracesSection />
      </div>

      {/* Errors section - 준비중 */}
      <div id="errors" className="pt-4 scroll-mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Errors</h2>
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center text-gray-500">
          Coming soon...
        </div>
      </div>

      {/* Logs section */}
      <div id="logs" className="pt-4 scroll-mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Logs</h2>
        <LogsSection />
      </div>
    </div>
  );
}
