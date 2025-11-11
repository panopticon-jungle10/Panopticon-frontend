'use client';

import React from 'react';
import Table from '@/components/ui/Table';
import { mockErrorResponse } from './mock';
import { ErrorItem } from './types';

// COLUMNS 타입 명시적으로 지정 (JSX 파서 충돌 방지)
const COLUMNS: {
  key: keyof ErrorItem;
  header: string;
  width?: string;
  render?: (value: any, row: ErrorItem) => React.ReactNode;
}[] = [
  {
    key: 'error_message',
    header: 'Error Message',
    width: '40%',
  },
  {
    key: 'service_name',
    header: 'Service',
    width: '20%',
  },
  {
    key: 'resource',
    header: 'Resource',
    width: '25%',
  },
  {
    key: 'count',
    header: 'Count',
    width: '10%',
    render: (v: number) => <span className="text-red-600 font-semibold">{v}</span>,
  },
  {
    key: 'last_seen',
    header: 'Last Seen',
    width: '10%',
    render: (v: string) => new Date(v).toLocaleTimeString('en-US', { hour12: false }),
  },
];

// 🔹 실제 테이블 컴포넌트
export default function ErrorTable() {
  const { errors } = mockErrorResponse;

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Error List</h2>

      {/* Table 컴포넌트 호출 */}
      <Table<ErrorItem> columns={COLUMNS} data={errors} />
    </div>
  );
}
