import { act } from '@testing-library/react';
import { useTickerStore } from '@/stores/useTickerStore';
import { DEFAULT_TICKER, TICKERS } from '@/lib/constants';

describe('useTickerStore', () => {
  // 각 테스트 전에 스토어 초기화
  beforeEach(() => {
    act(() => {
      useTickerStore.setState({
        mainTicker: DEFAULT_TICKER,
        selectedTickers: [],
        isMultiSelectMode: false,
      });
    });
  });

  describe('초기 상태', () => {
    it('기본 종목이 코스맥스로 설정되어야 한다', () => {
      const state = useTickerStore.getState();
      expect(state.mainTicker.name).toBe('코스맥스');
      expect(state.mainTicker.code).toBe('192820');
    });

    it('다중 선택 모드가 비활성화되어 있어야 한다', () => {
      const state = useTickerStore.getState();
      expect(state.isMultiSelectMode).toBe(false);
      expect(state.selectedTickers).toHaveLength(0);
    });
  });

  describe('setMainTicker', () => {
    it('메인 종목을 변경할 수 있어야 한다', () => {
      const newTicker = TICKERS[1]; // 코스맥스비티아이

      act(() => {
        useTickerStore.getState().setMainTicker(newTicker);
      });

      const state = useTickerStore.getState();
      expect(state.mainTicker.code).toBe(newTicker.code);
      expect(state.mainTicker.name).toBe('코스맥스비티아이');
    });

    it('메인 종목 변경 시 다중 선택 모드가 해제되어야 한다', () => {
      // 먼저 다중 선택 모드 활성화
      act(() => {
        useTickerStore.getState().toggleSelectedTicker(TICKERS[1]);
      });
      expect(useTickerStore.getState().isMultiSelectMode).toBe(true);

      // 메인 종목 변경
      act(() => {
        useTickerStore.getState().setMainTicker(TICKERS[2]);
      });

      const state = useTickerStore.getState();
      expect(state.isMultiSelectMode).toBe(false);
      expect(state.selectedTickers).toHaveLength(0);
    });
  });

  describe('toggleSelectedTicker', () => {
    it('종목을 선택 목록에 추가할 수 있어야 한다', () => {
      const ticker = TICKERS[3]; // 한국콜마

      act(() => {
        useTickerStore.getState().toggleSelectedTicker(ticker);
      });

      const state = useTickerStore.getState();
      expect(state.selectedTickers).toHaveLength(1);
      expect(state.selectedTickers[0].code).toBe(ticker.code);
      expect(state.isMultiSelectMode).toBe(true);
    });

    it('이미 선택된 종목을 다시 선택하면 제거되어야 한다', () => {
      const ticker = TICKERS[3];

      act(() => {
        useTickerStore.getState().toggleSelectedTicker(ticker);
      });
      expect(useTickerStore.getState().selectedTickers).toHaveLength(1);

      act(() => {
        useTickerStore.getState().toggleSelectedTicker(ticker);
      });
      expect(useTickerStore.getState().selectedTickers).toHaveLength(0);
    });

    it('최대 5개까지만 선택할 수 있어야 한다', () => {
      // 5개 선택
      act(() => {
        for (let i = 0; i < 6; i++) {
          useTickerStore.getState().toggleSelectedTicker(TICKERS[i]);
        }
      });

      const state = useTickerStore.getState();
      expect(state.selectedTickers).toHaveLength(5);
    });
  });

  describe('clearSelection', () => {
    it('선택을 초기화할 수 있어야 한다', () => {
      // 몇 개 선택
      act(() => {
        useTickerStore.getState().toggleSelectedTicker(TICKERS[1]);
        useTickerStore.getState().toggleSelectedTicker(TICKERS[2]);
      });
      expect(useTickerStore.getState().selectedTickers).toHaveLength(2);

      // 초기화
      act(() => {
        useTickerStore.getState().clearSelection();
      });

      const state = useTickerStore.getState();
      expect(state.selectedTickers).toHaveLength(0);
      expect(state.isMultiSelectMode).toBe(false);
    });
  });
});
