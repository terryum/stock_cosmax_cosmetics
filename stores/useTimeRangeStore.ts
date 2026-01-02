import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TimeRangeValue } from '@/types';
import {
  DEFAULT_TIME_RANGE,
  getTimeRangeByValue,
} from '@/lib/constants';

interface CustomDateRange {
  startDate: Date;
  endDate: Date;
}

interface TimeRangeState {
  // 상태
  selected: TimeRangeValue; // 선택된 기간
  customRange: CustomDateRange | null; // 직접 설정 기간

  // 액션
  setTimeRange: (range: TimeRangeValue) => void;
  setCustomRange: (startDate: Date, endDate: Date) => void;
  resetToDefault: () => void;

  // 계산된 값 (getter)
  getDateRange: () => { startDate: Date; endDate: Date };
  getDays: () => number;
}

export const useTimeRangeStore = create<TimeRangeState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      selected: DEFAULT_TIME_RANGE,
      customRange: null,

      // 기간 선택
      setTimeRange: (range) =>
        set(
          {
            selected: range,
            // custom이 아닌 경우 customRange 초기화
            ...(range !== 'custom' && { customRange: null }),
          },
          false,
          'setTimeRange'
        ),

      // 직접 설정 기간 지정
      setCustomRange: (startDate, endDate) =>
        set(
          {
            selected: 'custom',
            customRange: { startDate, endDate },
          },
          false,
          'setCustomRange'
        ),

      // 기본값으로 초기화
      resetToDefault: () =>
        set(
          {
            selected: DEFAULT_TIME_RANGE,
            customRange: null,
          },
          false,
          'resetToDefault'
        ),

      // 날짜 범위 계산
      getDateRange: () => {
        const { selected, customRange } = get();
        const endDate = new Date();
        const startDate = new Date();

        if (selected === 'custom' && customRange) {
          return {
            startDate: customRange.startDate,
            endDate: customRange.endDate,
          };
        }

        const timeRange = getTimeRangeByValue(selected);
        if (timeRange?.days) {
          startDate.setDate(endDate.getDate() - timeRange.days);
        }

        return { startDate, endDate };
      },

      // 일수 계산
      getDays: () => {
        const { selected, customRange } = get();

        if (selected === 'custom' && customRange) {
          const diff =
            customRange.endDate.getTime() - customRange.startDate.getTime();
          return Math.ceil(diff / (1000 * 60 * 60 * 24));
        }

        const timeRange = getTimeRangeByValue(selected);
        return timeRange?.days ?? 30;
      },
    }),
    { name: 'time-range-store' }
  )
);
