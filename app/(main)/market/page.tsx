'use client';

import { useMemo } from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { MainPriceDisplay, Watchlist } from '@/components/stocks';
import { NewsList } from '@/components/news';
import { TimeRangeSelector, StockChartContainer } from '@/components/charts';
import { useTickerStore } from '@/stores';
import { useStockPrice, useMultipleStockPrices, useMultipleStockHistory } from '@/hooks/useStockPrice';
import { TICKERS, isIndexOrETF } from '@/lib/constants';
import { TickerPrice, DailyPrice } from '@/types';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// 7일 전 날짜 계산
function getSevenDaysAgo(): string {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

export default function MarketPage() {
  const { mainTicker } = useTickerStore();
  const isIndex = isIndexOrETF(mainTicker);
  const { data: priceResponse, isLoading: isPriceLoading } = useStockPrice(mainTicker.code, isIndex);

  // 모든 종목 데이터 조회
  const tickerConfigs = useMemo(() =>
    TICKERS.map(t => ({ code: t.code, isIndex: isIndexOrETF(t) })),
    []
  );

  const { data: allPricesMap, isLoading: isAllPricesLoading } = useMultipleStockPrices(tickerConfigs);
  const { data: allHistoryMap, isLoading: isHistoryLoading } = useMultipleStockHistory(
    tickerConfigs,
    { startDate: getSevenDaysAgo(), endDate: getToday(), period: 'D' }
  );

  // Map을 Record로 변환
  const watchlistPriceData = useMemo(() => {
    if (!allPricesMap) return undefined;
    const record: Record<string, TickerPrice> = {};
    allPricesMap.forEach((price, code) => {
      record[code] = {
        code: price.code,
        name: price.name,
        currentPrice: price.currentPrice,
        changePrice: price.changePrice,
        changeRate: price.changeRate,
        volume: price.volume,
        high: price.high,
        low: price.low,
        open: price.open,
        prevClose: price.prevClose,
        timestamp: price.timestamp,
      };
    });
    return record;
  }, [allPricesMap]);

  const watchlistSparklineData = useMemo(() => {
    if (!allHistoryMap) return undefined;
    const record: Record<string, DailyPrice[]> = {};
    allHistoryMap.forEach((history, code) => {
      record[code] = history.map(h => ({
        date: h.date,
        open: h.open,
        high: h.high,
        low: h.low,
        close: h.close,
        volume: h.volume,
        changeRate: h.changeRate,
      }));
    });
    return record;
  }, [allHistoryMap]);

  const priceData = priceResponse?.data ? {
    code: priceResponse.data.code,
    name: priceResponse.data.name,
    currentPrice: priceResponse.data.currentPrice,
    changePrice: priceResponse.data.changePrice,
    changeRate: priceResponse.data.changeRate,
    volume: priceResponse.data.volume,
    high: priceResponse.data.high,
    low: priceResponse.data.low,
    open: priceResponse.data.open,
    prevClose: priceResponse.data.prevClose,
    timestamp: priceResponse.data.timestamp,
  } : undefined;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%' }}>
      {/* Main Price Display */}
      <MainPriceDisplay
        tickerName={mainTicker.name}
        priceData={priceData}
        isLoading={isPriceLoading}
      />

      {/* Main Chart */}
      <Box sx={{ px: 1 }}>
        <StockChartContainer />
      </Box>

      {/* Time Range Selector */}
      <TimeRangeSelector />

      <Divider />

      {/* Watchlist Section */}
      <Watchlist
        priceData={watchlistPriceData}
        sparklineData={watchlistSparklineData}
        isLoading={isAllPricesLoading || isHistoryLoading}
      />

      <Divider />

      {/* News Section Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          {'\uB274\uC2A4'}
        </Typography>
        <Button
          size="small"
          endIcon={<ChevronRightIcon />}
          sx={{ color: 'text.secondary' }}
        >
          {'\uB354\uBCF4\uAE30'}
        </Button>
      </Box>

      {/* News List */}
      <NewsList limit={5} />
    </Box>
  );
}
