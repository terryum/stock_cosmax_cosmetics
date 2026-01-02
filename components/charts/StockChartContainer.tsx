'use client';

import { useMemo } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { StockLineChart } from './StockLineChart';
import { useStockHistory, useMultipleStockHistory } from '@/hooks';
import { useTickerStore, useTimeRangeStore } from '@/stores';
import { isIndexOrETF } from '@/lib/constants';
import { DailyPrice, Ticker } from '@/types';

// 날짜를 YYYY-MM-DD 형식으로 변환
function formatDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function StockChartContainer() {
  const { mainTicker, selectedTickers, isMultiSelectMode } = useTickerStore();
  const { getDateRange, getDays } = useTimeRangeStore();

  // 날짜 범위 계산
  const { startDate, endDate } = getDateRange();
  const days = getDays();

  // 기간에 따른 period 결정
  const period: 'D' | 'W' | 'M' = useMemo(() => {
    if (days > 365 * 3) return 'M'; // 3년 이상이면 월봉
    if (days > 365) return 'W'; // 1년 이상이면 주봉
    return 'D'; // 기본 일봉
  }, [days]);

  // 메인 종목 히스토리 조회
  const {
    data: mainHistoryData,
    isLoading: isMainLoading,
    error: mainError,
  } = useStockHistory(mainTicker.code, {
    startDate: formatDateStr(startDate),
    endDate: formatDateStr(endDate),
    period,
    isIndex: isIndexOrETF(mainTicker),
  });

  // 비교 종목 히스토리 조회 (다중 선택 모드)
  const comparisonTickers = useMemo(() => {
    if (!isMultiSelectMode) return [];
    return selectedTickers.map((ticker) => ({
      code: ticker.code,
      isIndex: isIndexOrETF(ticker),
    }));
  }, [isMultiSelectMode, selectedTickers]);

  const {
    data: comparisonHistoryData,
    isLoading: isComparisonLoading,
  } = useMultipleStockHistory(comparisonTickers, {
    startDate: formatDateStr(startDate),
    endDate: formatDateStr(endDate),
    period,
  });

  // 메인 차트 데이터 변환
  const mainChartData: DailyPrice[] = useMemo(() => {
    if (!mainHistoryData?.data) return [];
    return mainHistoryData.data.map((d) => ({
      date: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
      changeRate: d.changeRate,
    }));
  }, [mainHistoryData]);

  // 비교 차트 데이터 변환
  const comparisonChartData = useMemo(() => {
    if (!comparisonHistoryData) return [];
    return selectedTickers.map((ticker) => {
      const history = comparisonHistoryData.get(ticker.code) || [];
      return {
        ticker,
        data: history.map((d) => ({
          date: d.date,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
          changeRate: d.changeRate,
        })),
      };
    });
  }, [comparisonHistoryData, selectedTickers]);

  // 로딩 상태
  const isLoading = isMainLoading || (isMultiSelectMode && isComparisonLoading);

  // 에러 상태
  if (mainError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          주가 데이터를 불러오는데 실패했습니다: {(mainError as Error).message}
        </Alert>
      </Box>
    );
  }

  // 더미 데이터 알림
  const isDummyData = mainHistoryData?.isDummy;

  return (
    <Box>
      {isDummyData && (
        <Alert severity="info" sx={{ mb: 2 }}>
          한투 API 키가 설정되지 않아 더미 데이터를 표시합니다.
        </Alert>
      )}

      <StockLineChart
        data={mainChartData}
        comparisonData={comparisonChartData}
        ticker={mainTicker}
        isLoading={isLoading}
        isRebaseMode={isMultiSelectMode && selectedTickers.length > 0}
      />
    </Box>
  );
}
