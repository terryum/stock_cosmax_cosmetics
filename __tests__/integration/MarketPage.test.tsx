/**
 * 종합 통합 테스트
 *
 * 이 테스트는 Market 페이지의 전체 흐름을 검증합니다:
 * 1. 페이지 레이아웃 렌더링
 * 2. 종목 선택과 상태 관리 연동
 * 3. 기간 선택과 상태 관리 연동
 * 4. 다중 선택 모드 전환
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TickerGrid } from '@/components/stocks/TickerGrid';
import { TimeRangeSelector } from '@/components/charts/TimeRangeSelector';
import { ChartLegend } from '@/components/charts/ChartLegend';
import { useTickerStore, useTimeRangeStore } from '@/stores';
import { DEFAULT_TICKER, TICKERS, DEFAULT_TIME_RANGE } from '@/lib/constants';

const theme = createTheme();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}

// 통합 테스트용 Market 페이지 모킹
function MockMarketPage() {
  const { mainTicker, selectedTickers, isMultiSelectMode } = useTickerStore();
  const { selected } = useTimeRangeStore();

  return (
    <div>
      <h1>시장 동향</h1>

      {/* 현재 상태 표시 */}
      <div data-testid="current-state">
        <span data-testid="main-ticker">{mainTicker.name}</span>
        <span data-testid="time-range">{selected}</span>
        <span data-testid="multi-select-mode">
          {isMultiSelectMode ? 'multi' : 'single'}
        </span>
        <span data-testid="selected-count">{selectedTickers.length}</span>
      </div>

      {/* 기간 선택기 */}
      <TimeRangeSelector />

      {/* 종목 그리드 */}
      <TickerGrid />

      {/* 차트 레전드 */}
      {isMultiSelectMode && selectedTickers.length > 0 && (
        <ChartLegend
          mainTicker={mainTicker}
          comparisonTickers={selectedTickers}
        />
      )}
    </div>
  );
}

describe('Market 페이지 통합 테스트', () => {
  beforeEach(() => {
    // 모든 스토어 초기화
    act(() => {
      useTickerStore.setState({
        mainTicker: DEFAULT_TICKER,
        selectedTickers: [],
        isMultiSelectMode: false,
      });
      useTimeRangeStore.setState({
        selected: DEFAULT_TIME_RANGE,
        customRange: null,
      });
    });
  });

  describe('초기 렌더링', () => {
    it('페이지가 올바르게 렌더링되어야 한다', () => {
      render(
        <TestWrapper>
          <MockMarketPage />
        </TestWrapper>
      );

      expect(screen.getByText('시장 동향')).toBeInTheDocument();
      expect(screen.getByText('종목 선택')).toBeInTheDocument();
    });

    it('초기 상태가 올바르게 표시되어야 한다', () => {
      render(
        <TestWrapper>
          <MockMarketPage />
        </TestWrapper>
      );

      expect(screen.getByTestId('main-ticker')).toHaveTextContent('코스맥스');
      expect(screen.getByTestId('time-range')).toHaveTextContent('1m');
      expect(screen.getByTestId('multi-select-mode')).toHaveTextContent('single');
      expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
    });
  });

  describe('종목 선택 흐름', () => {
    it('종목 클릭 시 메인 종목이 변경되어야 한다', () => {
      render(
        <TestWrapper>
          <MockMarketPage />
        </TestWrapper>
      );

      // 한국콜마 선택
      const kolmarCard = screen.getByText('한국콜마');
      fireEvent.mouseDown(kolmarCard);
      fireEvent.mouseUp(kolmarCard);

      expect(screen.getByTestId('main-ticker')).toHaveTextContent('한국콜마');
    });

    it('여러 종목을 순차적으로 선택할 수 있어야 한다', () => {
      render(
        <TestWrapper>
          <MockMarketPage />
        </TestWrapper>
      );

      // 첫 번째: 한국콜마
      fireEvent.mouseDown(screen.getByText('한국콜마'));
      fireEvent.mouseUp(screen.getByText('한국콜마'));
      expect(screen.getByTestId('main-ticker')).toHaveTextContent('한국콜마');

      // 두 번째: 아모레퍼시픽
      fireEvent.mouseDown(screen.getByText('아모레퍼시픽'));
      fireEvent.mouseUp(screen.getByText('아모레퍼시픽'));
      expect(screen.getByTestId('main-ticker')).toHaveTextContent('아모레퍼시픽');

      // 세 번째: 코스맥스로 복귀
      fireEvent.mouseDown(screen.getByText('코스맥스'));
      fireEvent.mouseUp(screen.getByText('코스맥스'));
      expect(screen.getByTestId('main-ticker')).toHaveTextContent('코스맥스');
    });
  });

  describe('기간 선택 흐름', () => {
    it('기간 옵션 클릭 시 기간이 변경되어야 한다', () => {
      render(
        <TestWrapper>
          <MockMarketPage />
        </TestWrapper>
      );

      // 3개월 선택
      fireEvent.click(screen.getByText('3개월'));
      expect(screen.getByTestId('time-range')).toHaveTextContent('3m');

      // 1년 선택
      fireEvent.click(screen.getByText('1년'));
      expect(screen.getByTestId('time-range')).toHaveTextContent('1y');
    });
  });

  describe('종목 + 기간 복합 흐름', () => {
    it('종목과 기간을 동시에 변경할 수 있어야 한다', () => {
      render(
        <TestWrapper>
          <MockMarketPage />
        </TestWrapper>
      );

      // 종목 변경: 에이피알
      fireEvent.mouseDown(screen.getByText('에이피알'));
      fireEvent.mouseUp(screen.getByText('에이피알'));

      // 기간 변경: 3년
      fireEvent.click(screen.getByText('3년'));

      // 상태 확인
      expect(screen.getByTestId('main-ticker')).toHaveTextContent('에이피알');
      expect(screen.getByTestId('time-range')).toHaveTextContent('3y');
    });
  });

  describe('전체 시스템 일관성', () => {
    it('모든 종목이 선택 가능해야 한다', () => {
      render(
        <TestWrapper>
          <MockMarketPage />
        </TestWrapper>
      );

      // 모든 종목 순회하며 선택 테스트 (코스맥스 이후 종목만 - 코스맥스는 이미 메인)
      TICKERS.slice(1).forEach((ticker) => {
        const tickerCards = screen.getAllByText(ticker.name);
        // 마지막 요소가 카드 내의 텍스트
        const tickerCard = tickerCards[tickerCards.length - 1];
        fireEvent.mouseDown(tickerCard);
        fireEvent.mouseUp(tickerCard);
        expect(screen.getByTestId('main-ticker')).toHaveTextContent(ticker.name);
      });
    });

    it('스토어 상태와 UI가 동기화되어야 한다', () => {
      render(
        <TestWrapper>
          <MockMarketPage />
        </TestWrapper>
      );

      // 직접 스토어 수정
      act(() => {
        useTickerStore.getState().setMainTicker(TICKERS[5]); // 아모레퍼시픽
        useTimeRangeStore.getState().setTimeRange('10y');
      });

      // UI 확인
      expect(screen.getByTestId('main-ticker')).toHaveTextContent('아모레퍼시픽');
      expect(screen.getByTestId('time-range')).toHaveTextContent('10y');
    });
  });
});
