import { act } from '@testing-library/react';
import { useTimeRangeStore } from '@/stores/useTimeRangeStore';
import { DEFAULT_TIME_RANGE } from '@/lib/constants';

describe('useTimeRangeStore', () => {
  beforeEach(() => {
    act(() => {
      useTimeRangeStore.setState({
        selected: DEFAULT_TIME_RANGE,
        customRange: null,
      });
    });
  });

  describe('초기 상태', () => {
    it('기본 기간이 1개월로 설정되어야 한다', () => {
      const state = useTimeRangeStore.getState();
      expect(state.selected).toBe('1m');
    });

    it('커스텀 범위가 null이어야 한다', () => {
      const state = useTimeRangeStore.getState();
      expect(state.customRange).toBeNull();
    });
  });

  describe('setTimeRange', () => {
    it('기간을 변경할 수 있어야 한다', () => {
      act(() => {
        useTimeRangeStore.getState().setTimeRange('3m');
      });

      expect(useTimeRangeStore.getState().selected).toBe('3m');
    });

    it('모든 기간 옵션을 설정할 수 있어야 한다', () => {
      const ranges = ['3d', '1m', '3m', '1y', '3y', '10y'] as const;

      ranges.forEach((range) => {
        act(() => {
          useTimeRangeStore.getState().setTimeRange(range);
        });
        expect(useTimeRangeStore.getState().selected).toBe(range);
      });
    });
  });

  describe('setCustomRange', () => {
    it('커스텀 날짜 범위를 설정할 수 있어야 한다', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-06-30');

      act(() => {
        useTimeRangeStore.getState().setCustomRange(startDate, endDate);
      });

      const state = useTimeRangeStore.getState();
      expect(state.selected).toBe('custom');
      expect(state.customRange?.startDate).toEqual(startDate);
      expect(state.customRange?.endDate).toEqual(endDate);
    });
  });

  describe('getDateRange', () => {
    it('선택된 기간에 맞는 날짜 범위를 반환해야 한다', () => {
      act(() => {
        useTimeRangeStore.getState().setTimeRange('3d');
      });

      const { startDate, endDate } = useTimeRangeStore.getState().getDateRange();
      const diffDays = Math.round(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(diffDays).toBe(3);
    });

    it('커스텀 범위가 설정되면 해당 범위를 반환해야 한다', () => {
      const customStart = new Date('2024-01-01');
      const customEnd = new Date('2024-03-15');

      act(() => {
        useTimeRangeStore.getState().setCustomRange(customStart, customEnd);
      });

      const { startDate, endDate } = useTimeRangeStore.getState().getDateRange();
      expect(startDate).toEqual(customStart);
      expect(endDate).toEqual(customEnd);
    });
  });

  describe('getDays', () => {
    it('선택된 기간의 일수를 반환해야 한다', () => {
      act(() => {
        useTimeRangeStore.getState().setTimeRange('1m');
      });

      expect(useTimeRangeStore.getState().getDays()).toBe(30);

      act(() => {
        useTimeRangeStore.getState().setTimeRange('1y');
      });

      expect(useTimeRangeStore.getState().getDays()).toBe(365);
    });
  });

  describe('resetToDefault', () => {
    it('기본값으로 초기화할 수 있어야 한다', () => {
      act(() => {
        useTimeRangeStore.getState().setTimeRange('10y');
      });
      expect(useTimeRangeStore.getState().selected).toBe('10y');

      act(() => {
        useTimeRangeStore.getState().resetToDefault();
      });

      const state = useTimeRangeStore.getState();
      expect(state.selected).toBe(DEFAULT_TIME_RANGE);
      expect(state.customRange).toBeNull();
    });
  });
});
