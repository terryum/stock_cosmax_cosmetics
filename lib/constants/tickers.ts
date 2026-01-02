import { Ticker } from '@/types';

// 모니터링 대상 종목 목록
export const TICKERS: Ticker[] = [
  // Row 1: Cosmax Group
  {
    code: '192820',
    name: '코스맥스',
    market: 'KOSDAQ',
    category: 'COSMAX',
  },
  {
    code: '044820',
    name: '코스맥스비티아이',
    market: 'KOSDAQ',
    category: 'COSMAX',
  },
  {
    code: '222040',
    name: '코스맥스엔비티',
    market: 'KOSDAQ',
    category: 'COSMAX',
  },
  // Row 2: Competitors
  {
    code: '161890',
    name: '한국콜마',
    market: 'KOSPI',
    category: 'COMPETITOR',
  },
  {
    code: '241710',
    name: '코스메카코리아',
    market: 'KOSDAQ',
    category: 'COMPETITOR',
  },
  {
    code: '090430',
    name: '아모레퍼시픽',
    market: 'KOSPI',
    category: 'COMPETITOR',
  },
  // Row 3: Rising/Brand
  {
    code: '278470',
    name: '에이피알',
    market: 'KOSDAQ',
    category: 'RISING',
  },
  {
    code: '526970',
    name: '달바글로벌',
    market: 'KOSDAQ',
    category: 'RISING',
  },
  {
    code: '018290',
    name: '브이티',
    market: 'KOSDAQ',
    category: 'RISING',
  },
  // Row 4: Indices
  {
    code: '0001',
    name: '코스피',
    market: 'INDEX',
    category: 'INDEX',
  },
  {
    code: '1001',
    name: '코스닥',
    market: 'INDEX',
    category: 'INDEX',
  },
  {
    code: '228790',
    name: 'TIGER 화장품',
    market: 'ETF',
    category: 'INDEX',
  },
];

// 기본 선택 종목 (코스맥스)
export const DEFAULT_TICKER = TICKERS[0];

// 종목 코드로 종목 정보 조회
export const getTickerByCode = (code: string): Ticker | undefined => {
  return TICKERS.find((ticker) => ticker.code === code);
};

// 카테고리별 종목 그룹화
export const getTickersByCategory = (
  category: Ticker['category']
): Ticker[] => {
  return TICKERS.filter((ticker) => ticker.category === category);
};

// 종목 코드 목록 (API 호출용)
export const TICKER_CODES = TICKERS.map((t) => t.code);

// 지수/ETF 여부 확인
export const isIndexOrETF = (ticker: Ticker): boolean => {
  return ticker.market === 'INDEX' || ticker.market === 'ETF';
};
