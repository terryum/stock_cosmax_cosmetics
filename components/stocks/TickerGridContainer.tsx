'use client';

import { useMemo } from 'react';
import { TickerGrid } from './TickerGrid';
import { useMultipleStockPrices } from '@/hooks';
import { TICKERS, isIndexOrETF } from '@/lib/constants';
import { TickerPrice } from '@/types';

export function TickerGridContainer() {
  // 모든 종목의 가격 데이터 조회
  const tickerQueries = useMemo(
    () =>
      TICKERS.map((ticker) => ({
        code: ticker.code,
        isIndex: isIndexOrETF(ticker),
      })),
    []
  );

  const { data: priceMap, isLoading } = useMultipleStockPrices(tickerQueries);

  // 가격 데이터를 Record<string, TickerPrice>로 변환
  const priceData = useMemo(() => {
    if (!priceMap) return undefined;

    const result: Record<string, TickerPrice> = {};

    priceMap.forEach((price, code) => {
      result[code] = {
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
        marketCap: price.marketCap,
        timestamp: price.timestamp,
      };
    });

    return result;
  }, [priceMap]);

  return <TickerGrid priceData={priceData} isLoading={isLoading} />;
}
