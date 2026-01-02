// 종목 정보 타입
export interface Ticker {
  code: string; // 종목코드 (예: 192820)
  name: string; // 종목명 (예: 코스맥스)
  market: 'KOSPI' | 'KOSDAQ' | 'ETF' | 'INDEX'; // 시장 구분
  category: 'COSMAX' | 'COMPETITOR' | 'RISING' | 'INDEX'; // 카테고리
}

// 실시간 가격 정보
export interface TickerPrice {
  code: string;
  name: string;
  currentPrice: number; // 현재가
  changePrice: number; // 전일 대비
  changeRate: number; // 등락률 (%)
  volume: number; // 거래량
  high: number; // 고가
  low: number; // 저가
  open: number; // 시가
  prevClose: number; // 전일 종가
  marketCap?: number; // 시가총액
  timestamp: string; // 조회 시간
}

// 일별 시세 데이터
export interface DailyPrice {
  date: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  changeRate?: number; // 등락률
}

// 차트용 데이터 포인트
export interface ChartDataPoint {
  date: string;
  value: number;
  // Rebase 차트용 수익률
  returnRate?: number;
}

// 비교 차트용 데이터
export interface ComparisonChartData {
  date: string;
  [tickerCode: string]: string | number; // 각 종목별 값
}

// 기간 선택 옵션
export type TimeRangeValue = '3d' | '1m' | '3m' | '1y' | '3y' | '10y' | 'custom';

export interface TimeRange {
  label: string;
  value: TimeRangeValue;
  days?: number;
}

// API 응답 타입
export interface StockPriceResponse {
  success: boolean;
  data?: TickerPrice;
  error?: string;
}

export interface StockHistoryResponse {
  success: boolean;
  data?: DailyPrice[];
  error?: string;
}
