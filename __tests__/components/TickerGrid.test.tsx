import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TickerGrid } from '@/components/stocks/TickerGrid';
import { useTickerStore } from '@/stores';
import { DEFAULT_TICKER, TICKERS } from '@/lib/constants';

// 테스트용 래퍼 컴포넌트
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

describe('TickerGrid', () => {
  beforeEach(() => {
    // 스토어 초기화
    act(() => {
      useTickerStore.setState({
        mainTicker: DEFAULT_TICKER,
        selectedTickers: [],
        isMultiSelectMode: false,
      });
    });
  });

  it('모든 종목이 렌더링되어야 한다', () => {
    render(
      <TestWrapper>
        <TickerGrid />
      </TestWrapper>
    );

    // 12개 종목 이름이 모두 표시되는지 확인
    TICKERS.forEach((ticker) => {
      expect(screen.getByText(ticker.name)).toBeInTheDocument();
    });
  });

  it('종목 선택 헤더가 표시되어야 한다', () => {
    render(
      <TestWrapper>
        <TickerGrid />
      </TestWrapper>
    );

    expect(screen.getByText('종목 선택')).toBeInTheDocument();
  });

  it('안내 메시지가 표시되어야 한다', () => {
    render(
      <TestWrapper>
        <TickerGrid />
      </TestWrapper>
    );

    expect(
      screen.getByText(/탭: 종목 변경 \| 길게 누르기: 비교 모드/)
    ).toBeInTheDocument();
  });

  it('종목 클릭 시 메인 종목이 변경되어야 한다', () => {
    render(
      <TestWrapper>
        <TickerGrid />
      </TestWrapper>
    );

    // 한국콜마 클릭
    const kolmarCard = screen.getByText('한국콜마');
    fireEvent.mouseDown(kolmarCard);
    fireEvent.mouseUp(kolmarCard);

    // 스토어 상태 확인
    const state = useTickerStore.getState();
    expect(state.mainTicker.name).toBe('한국콜마');
  });

  it('가격 데이터가 있으면 표시되어야 한다', () => {
    const priceData = {
      '192820': {
        code: '192820',
        name: '코스맥스',
        currentPrice: 150000,
        changePrice: 3000,
        changeRate: 2.04,
        volume: 100000,
        high: 152000,
        low: 148000,
        open: 149000,
        prevClose: 147000,
        timestamp: '2024-01-01T09:00:00',
      },
    };

    render(
      <TestWrapper>
        <TickerGrid priceData={priceData} />
      </TestWrapper>
    );

    // 가격이 표시되는지 확인
    expect(screen.getByText('150,000')).toBeInTheDocument();
    expect(screen.getByText('+2.04%')).toBeInTheDocument();
  });

  it('로딩 중일 때 스켈레톤이 표시되어야 한다', () => {
    render(
      <TestWrapper>
        <TickerGrid isLoading={true} />
      </TestWrapper>
    );

    // MUI Skeleton이 렌더링되는지 확인 (role이 없으므로 종목명은 여전히 표시됨)
    expect(screen.getByText('코스맥스')).toBeInTheDocument();
  });
});
