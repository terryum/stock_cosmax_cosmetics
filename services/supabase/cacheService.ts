import { marketDataRepository } from './repositories';
import { newsRepository } from './repositories';
import { kisClient, ProcessedDailyPrice } from '../kis';
import { MarketDataInsert, NewsArticleInsert } from './types';

/**
 * 주가 데이터 캐싱 서비스
 * - DB에 캐시된 데이터가 있으면 반환
 * - 없으면 API에서 가져와서 캐시 후 반환
 */
export const cacheService = {
  /**
   * 주가 히스토리 조회 (캐시 우선)
   */
  async getStockHistory(
    tickerCode: string,
    startDate: string,
    endDate: string,
    isIndex: boolean = false
  ): Promise<ProcessedDailyPrice[]> {
    // 1. DB에서 캐시된 데이터 조회
    const cachedData = await marketDataRepository.findByTickerAndDateRange(
      tickerCode,
      startDate,
      endDate
    );

    // 캐시된 데이터가 있으면 변환 후 반환
    if (cachedData.length > 0) {
      console.log(`[Cache] ${tickerCode}: ${cachedData.length}개 캐시 데이터 반환`);
      return cachedData.map((d) => ({
        date: d.trade_date,
        open: d.open_price,
        high: d.high_price,
        low: d.low_price,
        close: d.close_price,
        volume: Number(d.volume),
        changeRate: d.change_rate ?? undefined,
      }));
    }

    // 2. API에서 데이터 가져오기
    console.log(`[Cache] ${tickerCode}: API에서 데이터 조회 중...`);
    const apiData = await kisClient.getDailyPrices(
      tickerCode,
      startDate.replace(/-/g, ''),
      endDate.replace(/-/g, ''),
      'D',
      isIndex
    );

    if (apiData.length === 0) {
      return [];
    }

    // 3. DB에 캐싱
    const cacheData: MarketDataInsert[] = apiData.map((d) => ({
      ticker_code: tickerCode,
      trade_date: d.date,
      open_price: d.open,
      high_price: d.high,
      low_price: d.low,
      close_price: d.close,
      volume: d.volume,
      change_rate: d.changeRate ?? null,
    }));

    const savedCount = await marketDataRepository.bulkUpsert(cacheData);
    console.log(`[Cache] ${tickerCode}: ${savedCount}개 데이터 캐싱 완료`);

    return apiData;
  },

  /**
   * 캐시 갱신 (특정 종목의 최신 데이터만)
   */
  async refreshCache(tickerCode: string, isIndex: boolean = false): Promise<number> {
    // 최근 30일 데이터 갱신
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const apiData = await kisClient.getDailyPrices(
      tickerCode,
      startDateStr.replace(/-/g, ''),
      endDateStr.replace(/-/g, ''),
      'D',
      isIndex
    );

    if (apiData.length === 0) {
      return 0;
    }

    const cacheData: MarketDataInsert[] = apiData.map((d) => ({
      ticker_code: tickerCode,
      trade_date: d.date,
      open_price: d.open,
      high_price: d.high,
      low_price: d.low,
      close_price: d.close,
      volume: d.volume,
      change_rate: d.changeRate ?? null,
    }));

    return await marketDataRepository.bulkUpsert(cacheData);
  },

  /**
   * 뉴스 저장
   */
  async saveNews(
    articles: Array<{
      title: string;
      link: string;
      originalLink: string;
      description: string;
      source: string;
      pubDate: string;
    }>,
    category: string
  ): Promise<number> {
    const newsData: Omit<NewsArticleInsert, 'content_hash'>[] = articles.map((a) => ({
      title: a.title,
      link: a.link,
      original_link: a.originalLink,
      description: a.description,
      source: a.source,
      category,
      published_at: new Date(a.pubDate).toISOString(),
    }));

    return await newsRepository.bulkCreate(newsData);
  },

  /**
   * 캐시된 뉴스 조회
   */
  async getCachedNews(category: string, limit: number = 20, offset: number = 0) {
    return await newsRepository.findByCategory(category, limit, offset);
  },

  /**
   * 오래된 캐시 정리
   */
  async cleanupOldCache(marketDataDays: number = 365, newsDays: number = 30) {
    const deletedMarketData = await marketDataRepository.deleteOldData(marketDataDays);
    const deletedNews = await newsRepository.deleteOldNews(newsDays);

    console.log(`[Cache Cleanup] 시세: ${deletedMarketData}개, 뉴스: ${deletedNews}개 삭제`);

    return { deletedMarketData, deletedNews };
  },
};
