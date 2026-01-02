import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TimeRangeSelector } from '@/components/charts/TimeRangeSelector';
import { useTimeRangeStore } from '@/stores';
import { TIME_RANGES, DEFAULT_TIME_RANGE } from '@/lib/constants';

const theme = createTheme();

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

describe('TimeRangeSelector', () => {
  beforeEach(() => {
    act(() => {
      useTimeRangeStore.setState({
        selected: DEFAULT_TIME_RANGE,
        customRange: null,
      });
    });
  });

  it('모든 기간 옵션이 렌더링되어야 한다', () => {
    render(
      <TestWrapper>
        <TimeRangeSelector />
      </TestWrapper>
    );

    TIME_RANGES.forEach((range) => {
      expect(screen.getByText(range.label)).toBeInTheDocument();
    });
  });

  it('기본 선택 기간(1개월)이 활성화되어 있어야 한다', () => {
    render(
      <TestWrapper>
        <TimeRangeSelector />
      </TestWrapper>
    );

    const defaultChip = screen.getByText('1개월');
    // MUI Chip이 filled variant일 때의 클래스 확인
    expect(defaultChip.closest('.MuiChip-filled')).toBeInTheDocument();
  });

  it('기간 옵션 클릭 시 선택이 변경되어야 한다', () => {
    render(
      <TestWrapper>
        <TimeRangeSelector />
      </TestWrapper>
    );

    // 3개월 클릭
    const threeMonthChip = screen.getByText('3개월');
    fireEvent.click(threeMonthChip);

    // 스토어 상태 확인
    const state = useTimeRangeStore.getState();
    expect(state.selected).toBe('3m');
  });

  it('여러 기간을 순차적으로 선택할 수 있어야 한다', () => {
    render(
      <TestWrapper>
        <TimeRangeSelector />
      </TestWrapper>
    );

    // 3일 클릭
    fireEvent.click(screen.getByText('3일'));
    expect(useTimeRangeStore.getState().selected).toBe('3d');

    // 1년 클릭
    fireEvent.click(screen.getByText('1년'));
    expect(useTimeRangeStore.getState().selected).toBe('1y');

    // 10년 클릭
    fireEvent.click(screen.getByText('10년'));
    expect(useTimeRangeStore.getState().selected).toBe('10y');
  });
});
