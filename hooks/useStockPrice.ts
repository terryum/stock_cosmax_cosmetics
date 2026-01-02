'use client';

import { useQuery } from '@tanstack/react-query';
import { ProcessedStockPrice, ProcessedDailyPrice } from '@/services/kis';

interface StockPriceResponse {
  success: boolean;
  data: ProcessedStockPrice;
  isDummy?: boolean;
}

interface StockHistoryResponse {
  success: boolean;
  data: ProcessedDailyPrice[];
  isDummy?: boolean;
}

// 현재가 조회
export function useStockPrice(code: string, isIndex: boolean = false) {
  return useQuery<StockPriceResponse>({
    queryKey: ['stockPrice', code, isIndex],
    queryFn: async () => {
      const params = new URLSearchParams({
        code,
        isIndex: String(isIndex),
      });

      const response = await fetch(`/api/stocks/price?${params}`);

      if (!response.ok) {
        throw new Error('주가 조회 실패');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 1, // 1분
    refetchInterval: 1000 * 60 * 1, // 1분마다 자동 갱신
    enabled: !!code,
  });
}

// 기간별 시세 조회
export function useStockHistory(
  code: string,
  options: {
    startDate?: string;
    endDate?: string;
    period?: 'D' | 'W' | 'M';
    isIndex?: boolean;
  } = {}
) {
  const { startDate, endDate, period = 'D', isIndex = false } = options;

  return useQuery<StockHistoryResponse>({
    queryKey: ['stockHistory', code, startDate, endDate, period, isIndex],
    queryFn: async () => {
      const params = new URLSearchParams({
        code,
        period,
        isIndex: String(isIndex),
      });

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/stocks/historical?${params}`);

      if (!response.ok) {
        throw new Error('기간별 시세 조회 실패');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5분
    enabled: !!code,
  });
}

// 여러 종목 현재가 조회
export function useMultipleStockPrices(
  tickers: Array<{ code: string; isIndex?: boolean }>
) {
  return useQuery<Map<string, ProcessedStockPrice>>({
    queryKey: ['multipleStockPrices', tickers.map(t => t.code).join(',')],
    queryFn: async () => {
      const results = await Promise.all(
        tickers.map(async (ticker) => {
          const params = new URLSearchParams({
            code: ticker.code,
            isIndex: String(ticker.isIndex || false),
          });

          const response = await fetch(`/api/stocks/price?${params}`);

          if (!response.ok) {
            console.error(`종목 ${ticker.code} 조회 실패`);
            return null;
          }

          const data: StockPriceResponse = await response.json();
          return { code: ticker.code, price: data.data };
        })
      );

      const priceMap = new Map<string, ProcessedStockPrice>();
      results.forEach((result) => {
        if (result) {
          priceMap.set(result.code, result.price);
        }
      });

      return priceMap;
    },
    staleTime: 1000 * 60 * 1, // 1분
    refetchInterval: 1000 * 60 * 1, // 1분마다 자동 갱신
    enabled: tickers.length > 0,
  });
}

// Rebase 차트용 다중 히스토리 조회
export function useMultipleStockHistory(
  tickers: Array<{ code: string; isIndex?: boolean }>,
  options: {
    startDate?: string;
    endDate?: string;
    period?: 'D' | 'W' | 'M';
  } = {}
) {
  const { startDate, endDate, period = 'D' } = options;

  return useQuery<Map<string, ProcessedDailyPrice[]>>({
    queryKey: [
      'multipleStockHistory',
      tickers.map(t => t.code).join(','),
      startDate,
      endDate,
      period,
    ],
    queryFn: async () => {
      const results = await Promise.all(
        tickers.map(async (ticker) => {
          const params = new URLSearchParams({
            code: ticker.code,
            period,
            isIndex: String(ticker.isIndex || false),
          });

          if (startDate) params.append('startDate', startDate);
          if (endDate) params.append('endDate', endDate);

          const response = await fetch(`/api/stocks/historical?${params}`);

          if (!response.ok) {
            console.error(`종목 ${ticker.code} 히스토리 조회 실패`);
            return null;
          }

          const data: StockHistoryResponse = await response.json();
          return { code: ticker.code, history: data.data };
        })
      );

      const historyMap = new Map<string, ProcessedDailyPrice[]>();
      results.forEach((result) => {
        if (result) {
          historyMap.set(result.code, result.history);
        }
      });

      return historyMap;
    },
    staleTime: 1000 * 60 * 5, // 5분
    enabled: tickers.length > 0,
  });
}
