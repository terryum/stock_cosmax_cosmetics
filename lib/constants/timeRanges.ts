import { TimeRange, TimeRangeValue } from '@/types';

// 기간 선택 옵션
export const TIME_RANGES: TimeRange[] = [
  {
    label: '3일',
    value: '3d',
    days: 3,
  },
  {
    label: '1개월',
    value: '1m',
    days: 30,
  },
  {
    label: '3개월',
    value: '3m',
    days: 90,
  },
  {
    label: '1년',
    value: '1y',
    days: 365,
  },
  {
    label: '3년',
    value: '3y',
    days: 365 * 3,
  },
  {
    label: '10년',
    value: '10y',
    days: 365 * 10,
  },
  {
    label: '직접설정',
    value: 'custom',
  },
];

// 기본 선택 기간 (1개월)
export const DEFAULT_TIME_RANGE: TimeRangeValue = '1m';

// 기간 값으로 TimeRange 정보 조회
export const getTimeRangeByValue = (value: TimeRangeValue): TimeRange | undefined => {
  return TIME_RANGES.find((tr) => tr.value === value);
};

// 기간 값에 따른 날짜 범위 계산
export const calculateDateRange = (
  value: TimeRangeValue,
  customStartDate?: Date,
  customEndDate?: Date
): { startDate: Date; endDate: Date } => {
  const endDate = new Date();
  let startDate = new Date();

  if (value === 'custom' && customStartDate && customEndDate) {
    return { startDate: customStartDate, endDate: customEndDate };
  }

  const timeRange = getTimeRangeByValue(value);
  if (timeRange?.days) {
    startDate.setDate(endDate.getDate() - timeRange.days);
  }

  return { startDate, endDate };
};

// 날짜를 YYYYMMDD 형식 문자열로 변환
export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};
