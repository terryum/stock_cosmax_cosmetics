// 한국투자증권 API 클라이언트
import { getAccessToken } from './auth';
import {
  KisPriceResponse,
  KisDailyPriceResponse,
  KisIndexPriceResponse,
  KisIndexDailyPriceResponse,
  ProcessedStockPrice,
  ProcessedDailyPrice,
  KisDailyPriceItem,
  KisIndexDailyPriceItem,
} from './types';

// API 설정
function getKisConfig() {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const baseUrl = process.env.KIS_BASE_URL || 'https://openapi.koreainvestment.com:9443';

  return { appKey, appSecret, baseUrl };
}

// 전일 대비 부호 변환
function convertChangeSign(sign: string): 'up' | 'down' | 'unchanged' {
  switch (sign) {
    case '1': // 상한
    case '2': // 상승
      return 'up';
    case '4': // 하한
    case '5': // 하락
      return 'down';
    default: // 3: 보합
      return 'unchanged';
  }
}

// 날짜 형식 변환 (YYYYMMDD -> YYYY-MM-DD)
function formatDate(dateStr: string): string {
  if (dateStr.length !== 8) return dateStr;
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
}

export class KisApiClient {
  // 주식 현재가 조회
  async getStockPrice(stockCode: string): Promise<ProcessedStockPrice> {
    const { appKey, appSecret, baseUrl } = getKisConfig();
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${baseUrl}/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${stockCode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          authorization: `Bearer ${accessToken}`,
          appkey: appKey!,
          appsecret: appSecret!,
          tr_id: 'FHKST01010100',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`주식 현재가 조회 실패: ${response.status} - ${errorText}`);
    }

    const data: KisPriceResponse = await response.json();

    if (data.rt_cd !== '0') {
      throw new Error(`API 오류: ${data.msg_cd} - ${data.msg1}`);
    }

    const output = data.output;

    return {
      code: stockCode,
      name: output.bstp_kor_isnm || stockCode,
      currentPrice: parseInt(output.stck_prpr, 10),
      changePrice: parseInt(output.prdy_vrss, 10),
      changeRate: parseFloat(output.prdy_ctrt),
      changeSign: convertChangeSign(output.prdy_vrss_sign),
      volume: parseInt(output.acml_vol, 10),
      tradeAmount: parseInt(output.acml_tr_pbmn, 10),
      open: parseInt(output.stck_oprc, 10),
      high: parseInt(output.stck_hgpr, 10),
      low: parseInt(output.stck_lwpr, 10),
      prevClose: parseInt(output.stck_sdpr, 10),
      marketCap: output.hts_avls ? parseInt(output.hts_avls, 10) : undefined,
      per: output.per ? parseFloat(output.per) : undefined,
      pbr: output.pbr ? parseFloat(output.pbr) : undefined,
      high52w: output.w52_hgpr ? parseInt(output.w52_hgpr, 10) : undefined,
      low52w: output.w52_lwpr ? parseInt(output.w52_lwpr, 10) : undefined,
      timestamp: new Date().toISOString(),
    };
  }

  // 주식 일별 시세 조회
  async getStockDailyPrices(
    stockCode: string,
    startDate: string,
    endDate: string,
    periodCode: 'D' | 'W' | 'M' = 'D'
  ): Promise<ProcessedDailyPrice[]> {
    const { appKey, appSecret, baseUrl } = getKisConfig();
    const accessToken = await getAccessToken();

    const params = new URLSearchParams({
      FID_COND_MRKT_DIV_CODE: 'J',
      FID_INPUT_ISCD: stockCode,
      FID_INPUT_DATE_1: startDate,
      FID_INPUT_DATE_2: endDate,
      FID_PERIOD_DIV_CODE: periodCode,
      FID_ORG_ADJ_PRC: '0', // 수정주가 적용
    });

    const response = await fetch(
      `${baseUrl}/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          authorization: `Bearer ${accessToken}`,
          appkey: appKey!,
          appsecret: appSecret!,
          tr_id: 'FHKST03010100',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`주식 일별 시세 조회 실패: ${response.status} - ${errorText}`);
    }

    const data: KisDailyPriceResponse = await response.json();

    if (data.rt_cd !== '0') {
      throw new Error(`API 오류: ${data.msg_cd} - ${data.msg1}`);
    }

    return data.output2.map((item: KisDailyPriceItem) => ({
      date: formatDate(item.stck_bsop_date),
      open: parseInt(item.stck_oprc, 10),
      high: parseInt(item.stck_hgpr, 10),
      low: parseInt(item.stck_lwpr, 10),
      close: parseInt(item.stck_clpr, 10),
      volume: parseInt(item.acml_vol, 10),
      changeRate: item.prdy_vrss ? parseFloat(item.prdy_vrss) : undefined,
    }));
  }

  // 지수 현재가 조회
  async getIndexPrice(indexCode: string): Promise<ProcessedStockPrice> {
    const { appKey, appSecret, baseUrl } = getKisConfig();
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${baseUrl}/uapi/domestic-stock/v1/quotations/inquire-index-price?FID_COND_MRKT_DIV_CODE=U&FID_INPUT_ISCD=${indexCode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          authorization: `Bearer ${accessToken}`,
          appkey: appKey!,
          appsecret: appSecret!,
          tr_id: 'FHPUP02100000',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`지수 현재가 조회 실패: ${response.status} - ${errorText}`);
    }

    const data: KisIndexPriceResponse = await response.json();

    if (data.rt_cd !== '0') {
      throw new Error(`API 오류: ${data.msg_cd} - ${data.msg1}`);
    }

    const output = data.output;

    return {
      code: indexCode,
      name: indexCode === '0001' ? '코스피' : indexCode === '1001' ? '코스닥' : indexCode,
      currentPrice: parseFloat(output.bstp_nmix_prpr),
      changePrice: parseFloat(output.bstp_nmix_prdy_vrss),
      changeRate: parseFloat(output.bstp_nmix_prdy_ctrt),
      changeSign: convertChangeSign(output.prdy_vrss_sign),
      volume: parseInt(output.acml_vol, 10),
      tradeAmount: parseInt(output.acml_tr_pbmn, 10),
      open: parseFloat(output.bstp_nmix_oprc),
      high: parseFloat(output.bstp_nmix_hgpr),
      low: parseFloat(output.bstp_nmix_lwpr),
      prevClose: 0, // 지수는 기준가 필드가 다름
      timestamp: new Date().toISOString(),
    };
  }

  // 지수 일별 시세 조회
  async getIndexDailyPrices(
    indexCode: string,
    startDate: string,
    endDate: string,
    periodCode: 'D' | 'W' | 'M' = 'D'
  ): Promise<ProcessedDailyPrice[]> {
    const { appKey, appSecret, baseUrl } = getKisConfig();
    const accessToken = await getAccessToken();

    const params = new URLSearchParams({
      FID_COND_MRKT_DIV_CODE: 'U',
      FID_INPUT_ISCD: indexCode,
      FID_INPUT_DATE_1: startDate,
      FID_INPUT_DATE_2: endDate,
      FID_PERIOD_DIV_CODE: periodCode,
    });

    const response = await fetch(
      `${baseUrl}/uapi/domestic-stock/v1/quotations/inquire-index-daily-price?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          authorization: `Bearer ${accessToken}`,
          appkey: appKey!,
          appsecret: appSecret!,
          tr_id: 'FHPUP02100100',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`지수 일별 시세 조회 실패: ${response.status} - ${errorText}`);
    }

    const data: KisIndexDailyPriceResponse = await response.json();

    if (data.rt_cd !== '0') {
      throw new Error(`API 오류: ${data.msg_cd} - ${data.msg1}`);
    }

    return data.output2.map((item: KisIndexDailyPriceItem) => ({
      date: formatDate(item.stck_bsop_date),
      open: parseFloat(item.bstp_nmix_oprc),
      high: parseFloat(item.bstp_nmix_hgpr),
      low: parseFloat(item.bstp_nmix_lwpr),
      close: parseFloat(item.bstp_nmix_prpr),
      volume: parseInt(item.acml_vol, 10),
    }));
  }

  // 통합 현재가 조회 (주식/지수 자동 판별)
  async getPrice(code: string, isIndex: boolean = false): Promise<ProcessedStockPrice> {
    if (isIndex) {
      return this.getIndexPrice(code);
    }
    return this.getStockPrice(code);
  }

  // 통합 일별 시세 조회 (주식/지수 자동 판별)
  async getDailyPrices(
    code: string,
    startDate: string,
    endDate: string,
    periodCode: 'D' | 'W' | 'M' = 'D',
    isIndex: boolean = false
  ): Promise<ProcessedDailyPrice[]> {
    if (isIndex) {
      return this.getIndexDailyPrices(code, startDate, endDate, periodCode);
    }
    return this.getStockDailyPrices(code, startDate, endDate, periodCode);
  }
}

// 싱글톤 인스턴스
export const kisClient = new KisApiClient();
