// 더미 데이터

import { ErrorItem, ErrorResponse, ErrorTrendSeries } from './types';

export const mockErrorResponse: ErrorResponse = {
  errors: [
    {
      error_id: 'err_001',
      service_name: 'user-service',
      error_message: 'Timeout while connecting to DB',
      resource: 'GET /api/users/:id',
      count: 234,
      first_seen: '2025-11-11T08:00:00Z',
      last_seen: '2025-11-11T10:45:00Z',
    },
    {
      error_id: 'err_002',
      service_name: 'payment-service',
      error_message: 'Stripe API 401 Unauthorized',
      resource: 'POST /api/payments/charge',
      count: 132,
      first_seen: '2025-11-11T08:15:00Z',
      last_seen: '2025-11-11T10:30:00Z',
    },
    {
      error_id: 'err_003',
      service_name: 'order-service',
      error_message: 'Syntax error in SQL query',
      resource: 'GET /api/orders',
      count: 17,
      first_seen: '2025-11-11T07:40:00Z',
      last_seen: '2025-11-11T09:15:00Z',
    },
  ],
  total: 3,
  page: 1,
  limit: 20,
};

/* 시간별 Error Trend 더미 */
export const mockErrorTrendData: ErrorTrendSeries[] = [
  {
    service: 'user-service',
    color: '#3b82f6',
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: `2025-11-11T${String(i).padStart(2, '0')}:00:00Z`,
      count: Math.floor(Math.random() * 400 + 150),
    })),
  },
  {
    service: 'payment-service',
    color: '#10b981',
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: `2025-11-11T${String(i).padStart(2, '0')}:00:00Z`,
      count: Math.floor(Math.random() * 250 + 50),
    })),
  },
  {
    service: 'order-service',
    color: '#ef4444',
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: `2025-11-11T${String(i).padStart(2, '0')}:00:00Z`,
      count: Math.floor(Math.random() * 150 + 30),
    })),
  },
];
