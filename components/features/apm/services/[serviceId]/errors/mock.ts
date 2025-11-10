// 더미 데이터

import { ErrorResponse } from './types';

export const mockErrors: ErrorResponse = {
  errors: [
    {
      error_id: 'err_001',
      service_name: 'user-service',
      error_message: 'Failed to connect to database',
      resource: 'GET /api/users/:id',
      count: 234,
      first_seen: '2025-11-07T09:00:00Z',
      last_seen: '2025-11-07T10:45:00Z',
      stack_trace: 'ConnectionTimeout: PostgreSQL connection failed...',
      sample_trace_ids: ['trace_123', 'trace_456'],
    },
    {
      error_id: 'err_002',
      service_name: 'payment-service',
      error_message: 'Stripe API returned 401 Unauthorized',
      resource: 'POST /api/payments/charge',
      count: 132,
      first_seen: '2025-11-07T09:30:00Z',
      last_seen: '2025-11-07T10:40:00Z',
      stack_trace: 'Unauthorized: Invalid Stripe API key...',
      sample_trace_ids: ['trace_789', 'trace_987'],
    },
    {
      error_id: 'err_003',
      service_name: 'order-service',
      error_message: 'Timeout while communicating with inventory system',
      resource: 'POST /api/orders',
      count: 88,
      first_seen: '2025-11-07T09:45:00Z',
      last_seen: '2025-11-07T10:50:00Z',
      stack_trace: 'RequestTimeout: Inventory service did not respond...',
      sample_trace_ids: ['trace_654', 'trace_321'],
    },
  ],
  total: 45,
  page: 1,
  limit: 20,
};
