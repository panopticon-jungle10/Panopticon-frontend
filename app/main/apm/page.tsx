'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import SearchInput from '@/components/ui/SearchInput';

export default function ApmPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [issuesSortField, setIssuesSortField] = useState<string | null>(null);
  const [issuesSortDirection, setIssuesSortDirection] = useState<'asc' | 'desc'>('asc');

  /* 정렬 핸들러 */
  //   서비스T
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 에러T
  const handleIssuesSort = (field: string) => {
    if (issuesSortField === field) {
      setIssuesSortDirection(issuesSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setIssuesSortField(field);
      setIssuesSortDirection('asc');
    }
  };

  /* 정렬 아이콘 컴포넌트 */
  const SortIcon = ({
    field,
    currentField,
    direction,
  }: {
    field: string;
    currentField: string | null;
    direction: 'asc' | 'desc';
  }) => {
    if (currentField !== field) {
      return (
        <div className="flex flex-col ml-1">
          <ChevronUp className="w-3 h-3 -mb-1 text-gray-300" />
          <ChevronDown className="w-3 h-3 text-gray-300" />
        </div>
      );
    }

    return direction === 'asc' ? (
      <ChevronUp className="w-3 h-3 ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 ml-1" />
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-6">
      {/* APM Services */}
      <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-4 h-4 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
            </svg>
            <h3 className="text-gray-900 text-sm">APM Services</h3>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">1h</span>
            <span className="text-gray-500 text-xs">Past 1 Hour</span>
          </div>

          {/* 검색창 + 필터 드롭다운 */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services"
              />
            </div>
            <select className="text-xs border border-gray-300 rounded px-3 py-2 text-gray-600">
              <option>env:sre-in-practice</option>
            </select>
          </div>
        </div>

        {/* Table Header */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-11 gap-2 text-xs text-gray-600 uppercase">
            <div className="col-span-1 flex items-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <button
              onClick={() => handleSort('type')}
              className="col-span-2 flex items-center hover:text-gray-900 transition cursor-pointer"
            >
              Type
              <SortIcon field="type" currentField={sortField} direction={sortDirection} />
            </button>
            <button
              onClick={() => handleSort('service')}
              className="col-span-2 flex items-center hover:text-gray-900 transition cursor-pointer"
            >
              Service
              <SortIcon field="service" currentField={sortField} direction={sortDirection} />
            </button>
            <button
              onClick={() => handleSort('requests')}
              className="col-span-2 flex items-center hover:text-gray-900 transition cursor-pointer"
            >
              Requests
              <SortIcon field="requests" currentField={sortField} direction={sortDirection} />
            </button>
            <button
              onClick={() => handleSort('latency')}
              className="col-span-3 flex items-center hover:text-gray-900 transition cursor-pointer"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              P99 Latency
              <SortIcon field="latency" currentField={sortField} direction={sortDirection} />
            </button>
            <button
              onClick={() => handleSort('errorRate')}
              className="col-span-1 flex items-center hover:text-gray-900 transition cursor-pointer"
            >
              Error Rate
              <SortIcon field="errorRate" currentField={sortField} direction={sortDirection} />
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 mb-3">
            <svg
              className="w-full h-full text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-sm">No services match the filter</p>
          <p className="text-xs text-gray-400 mt-1">Please widen your filter</p>
        </div>
      </div>

      {/* Issues Section */}
      <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-gray-900 text-sm">Issues</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </div>

        {/* Table Header */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 uppercase">
            <button
              onClick={() => handleIssuesSort('details')}
              className="flex items-center hover:text-gray-900 transition cursor-pointer"
            >
              Issue Details
              <SortIcon
                field="details"
                currentField={issuesSortField}
                direction={issuesSortDirection}
              />
            </button>
            <button
              onClick={() => handleIssuesSort('errorCount')}
              className="flex items-center hover:text-gray-900 transition cursor-pointer"
            >
              Error Count
              <SortIcon
                field="errorCount"
                currentField={issuesSortField}
                direction={issuesSortDirection}
              />
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 mb-3">
            <svg
              className="w-full h-full text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-sm">No matching results found</p>
        </div>
      </div>
    </div>
  );
}
