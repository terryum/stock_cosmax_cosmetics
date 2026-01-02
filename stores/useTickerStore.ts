import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Ticker } from '@/types';
import { DEFAULT_TICKER } from '@/lib/constants';

interface TickerState {
  // 상태
  mainTicker: Ticker; // 메인 차트에 표시되는 종목
  selectedTickers: Ticker[]; // 비교용 다중 선택 종목
  isMultiSelectMode: boolean; // 다중 선택 모드 활성화 여부

  // 액션
  setMainTicker: (ticker: Ticker) => void;
  toggleSelectedTicker: (ticker: Ticker) => void;
  setMultiSelectMode: (mode: boolean) => void;
  clearSelection: () => void;
  exitMultiSelectMode: () => void;
}

export const useTickerStore = create<TickerState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      mainTicker: DEFAULT_TICKER,
      selectedTickers: [],
      isMultiSelectMode: false,

      // 메인 종목 변경 (단일 선택)
      setMainTicker: (ticker) =>
        set(
          {
            mainTicker: ticker,
            isMultiSelectMode: false,
            selectedTickers: [],
          },
          false,
          'setMainTicker'
        ),

      // 비교 종목 토글 (다중 선택)
      toggleSelectedTicker: (ticker) =>
        set(
          (state) => {
            const exists = state.selectedTickers.find(
              (t) => t.code === ticker.code
            );

            if (exists) {
              // 이미 선택된 종목이면 제거
              const newSelected = state.selectedTickers.filter(
                (t) => t.code !== ticker.code
              );
              // 선택된 종목이 없으면 다중 선택 모드 해제
              return {
                selectedTickers: newSelected,
                isMultiSelectMode: newSelected.length > 0,
              };
            }

            // 새 종목 추가 (최대 5개 제한)
            if (state.selectedTickers.length >= 5) {
              return state; // 변경 없음
            }

            return {
              selectedTickers: [...state.selectedTickers, ticker],
              isMultiSelectMode: true,
            };
          },
          false,
          'toggleSelectedTicker'
        ),

      // 다중 선택 모드 설정
      setMultiSelectMode: (mode) =>
        set(
          {
            isMultiSelectMode: mode,
            // 모드 해제 시 선택 초기화
            ...(mode === false && { selectedTickers: [] }),
          },
          false,
          'setMultiSelectMode'
        ),

      // 선택 초기화
      clearSelection: () =>
        set(
          {
            selectedTickers: [],
            isMultiSelectMode: false,
          },
          false,
          'clearSelection'
        ),

      // 다중 선택 모드 종료 (메인 종목 유지)
      exitMultiSelectMode: () => {
        const { selectedTickers } = get();
        // 선택된 종목 중 첫 번째를 메인으로 설정 (선택된 것이 있다면)
        const newMain =
          selectedTickers.length > 0 ? selectedTickers[0] : get().mainTicker;

        set(
          {
            mainTicker: newMain,
            selectedTickers: [],
            isMultiSelectMode: false,
          },
          false,
          'exitMultiSelectMode'
        );
      },
    }),
    { name: 'ticker-store' }
  )
);
