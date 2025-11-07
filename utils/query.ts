import { TimeRange } from '@/types/time';

type QueryParams = Pick<TimeRange, 'hours' | 'startDate' | 'endDate'>;

// 유틸리티: 쿼리 파라미터 생성 헬퍼
export const getQueryParamsFromTimeRange = (range: QueryParams): URLSearchParams => {
  const params = new URLSearchParams();
  const end = new Date();

  if (range.hours) {
    const start = new Date(end.getTime() - range.hours * 60 * 60 * 1000);
    params.set('start', start.toISOString());
    params.set('end', end.toISOString());
  } else if (range.startDate && range.endDate) {
    params.set('start', range.startDate.toISOString());
    params.set('end', range.endDate.toISOString());
  }

  return params;
};
