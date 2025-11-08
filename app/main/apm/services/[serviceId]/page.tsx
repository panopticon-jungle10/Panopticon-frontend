'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

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
  const [isLoading, setIsLoading] = useState(false);

  const [chartData, setChartData] = useState({
    timestamps: generateTimestamps('5m'),
    requests: [],
    errors: [],
    latency: {},
  });

  // 1. API 호출 (시뮬레이션) => 현재 더미 데이터
  const fetchChartData = async (range: string) => {
    setIsLoading(true);

    // 실제 API라면: fetch(`/api/metrics?range=${range}`)
    await new Promise((res) => setTimeout(res, 500)); // 로딩 딜레이 시뮬레이션

    const timestamps = generateTimestamps(range);
    const randomArray = (base: number, amp = 2000) =>
      timestamps.map(() => Math.max(0, base + Math.floor((Math.random() - 0.5) * amp)));

    setChartData({
      timestamps,
      requests: randomArray(25000, 15000),
      errors: randomArray(10, 10),
      latency: {
        p50: randomArray(120, 40),
        p75: randomArray(160, 50),
        p90: randomArray(220, 60),
        p95: randomArray(280, 70),
        p99: randomArray(350, 80),
        p999: randomArray(400, 90),
        max: randomArray(450, 100),
      },
    });

    setIsLoading(false);
  };

  // 2. 기간 변경 시 데이터 다시 불러오기
  useEffect(() => {
    fetchChartData(timeRange);
  }, [timeRange]);

  // 3. 실시간 갱신 (2초)
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        const nextLabel = formatTimestamp(timeRange);
        const nextReq = Math.max(
          5000,
          Math.floor(prev.requests.at(-1)! + (Math.random() - 0.5) * 8000),
        );
        const nextErr = Math.max(0, Math.floor(prev.errors.at(-1)! + (Math.random() - 0.5) * 10));
        const nextLat = Object.fromEntries(
          Object.entries(prev.latency).map(([k, v]) => [
            k,
            [...v.slice(-9), Math.max(100, Math.floor(v.at(-1)! + (Math.random() - 0.5) * 40))],
          ]),
        );

        return {
          timestamps: [...prev.timestamps.slice(-9), nextLabel],
          requests: [...prev.requests.slice(-9), nextReq],
          errors: [...prev.errors.slice(-9), nextErr],
          latency: nextLat,
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [timeRange]);

  /* ---------- 차트 옵션 ---------- */
  const baseGrid = { borderColor: '#e5e7eb' };
  const baseAxis = {
    categories: chartData.timestamps,
    labels: {
      rotate: -45,
      hideOverlappingLabels: true,
      showDuplicates: false,
      style: { fontSize: '10px' },
    },
    tickAmount: Math.min(6, Math.floor(chartData.timestamps.length / 2)), // 자동 간격 조정
  };

  const requestsOptions = {
    chart: { type: 'bar', toolbar: { show: false }, animations: { enabled: true } },
    plotOptions: { bar: { columnWidth: '45%', borderRadius: 6 } },
    colors: ['#60a5fa', '#fca5a5'],
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: baseAxis,
    grid: baseGrid,
    legend: { position: 'bottom' },
  };

  const errorsOptions = {
    chart: { type: 'bar', toolbar: { show: false }, animations: { enabled: true } },
    plotOptions: { bar: { columnWidth: '50%', borderRadius: 6 } },
    colors: ['#f87171'],
    dataLabels: { enabled: false },
    xaxis: baseAxis,
    grid: baseGrid,
  };

  const latencyColors = {
    p50: '#60a5fa',
    p75: '#6366f1',
    p90: '#10b981',
    p95: '#facc15',
    p99: '#f97316',
    p999: '#f59e0b',
    max: '#ef4444',
  };

  const latencyOptions = {
    chart: { type: 'line', toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 2 },
    colors: Object.values(latencyColors),
    markers: { size: 0 },
    xaxis: baseAxis,
    yaxis: { title: { text: 'Milliseconds' }, min: 0 },
    grid: baseGrid,
    tooltip: {
      shared: true,
      y: { formatter: (val: number) => `${val.toFixed(1)} ms` },
    },
    legend: { position: 'bottom', horizontalAlign: 'left', fontSize: '12px' },
  };

  const latencySeries = Object.entries(chartData.latency || {}).map(([key, values]) => ({
    name: key.toUpperCase(),
    data: values,
  }));

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Overview</h1>

        {/* 기간 선택 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center justify-between gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-50 transition"
          >
            <span>{TIME_RANGES.find((t) => t.value === timeRange)?.label}</span>
            <ChevronDown size={16} />
          </button>

          <AnimatePresence>
            {openDropdown && (
              <motion.ul
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden"
              >
                {TIME_RANGES.map((range) => (
                  <li
                    key={range.value}
                    onClick={() => {
                      setTimeRange(range.value);
                      setOpenDropdown(false);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      range.value === timeRange ? 'bg-gray-100 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {range.label}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="text-center text-gray-500 p-10">Loading data...</div>
      ) : (
        <>
          {/* 상단 2개 그래프 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <h2 className="font-semibold mb-4 text-gray-800">Requests & Errors</h2>
              <Chart
                options={requestsOptions}
                series={[
                  { name: 'Requests', data: chartData.requests },
                  { name: 'Errors', data: chartData.errors },
                ]}
                type="bar"
                height={300}
              />
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <h2 className="font-semibold mb-4 text-gray-800">Errors</h2>
              <Chart
                options={errorsOptions}
                series={[{ name: 'Errors', data: chartData.errors }]}
                type="bar"
                height={300}
              />
            </div>
          </div>

          {/* Latency Chart */}
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <h2 className="font-semibold mb-4 text-gray-800">Latency</h2>
            <Chart options={latencyOptions} series={latencySeries} type="line" height={340} />
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------
   헬퍼 함수: 시간 라벨 만드는 함수
--------------------------------*/
function generateTimestamps(range: string): string[] {
  const now = new Date();
  const timestamps: string[] = [];
  const count = 10;

  for (let i = count - 1; i >= 0; i--) {
    const t = new Date(now);
    if (['5m', '30m', '1h'].includes(range)) t.setSeconds(now.getSeconds() - i * 10);
    else if (['1d', '1w'].includes(range)) t.setHours(now.getHours() - i * 3);
    else t.setDate(now.getDate() - i * 4);

    timestamps.push(formatDateLabel(t, range));
  }

  return timestamps;
}

function formatDateLabel(date: Date, range: string): string {
  if (['5m', '30m', '1h'].includes(range)) {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } else if (['1d', '1w'].includes(range)) {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
      .getDate()
      .toString()
      .padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  } else {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }
}

function formatTimestamp(range: string): string {
  return formatDateLabel(new Date(), range);
}
