import { supabase, supabaseAdmin } from '../client';
import { MarketData, MarketDataInsert } from '../types';

export const marketDataRepository = {
  // 특정 종목의 기간별 시세 조회
  async findByTickerAndDateRange(
    tickerCode: string,
    startDate: string,
    endDate: string
  ): Promise<MarketData[]> {
    const { data, error } = await supabase
      .from('market_data')
      .select('*')
      .eq('ticker_code', tickerCode)
      .gte('trade_date', startDate)
      .lte('trade_date', endDate)
      .order('trade_date', { ascending: true });

    if (error) {
      console.error('시세 조회 오류:', error);
      return [];
    }

    return data || [];
  },

  // 특정 종목의 최신 시세 조회
  async findLatestByTicker(tickerCode: string): Promise<MarketData | null> {
    const { data, error } = await supabase
      .from('market_data')
      .select('*')
      .eq('ticker_code', tickerCode)
      .order('trade_date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('최신 시세 조회 오류:', error);
      }
      return null;
    }

    return data;
  },

  // 특정 날짜의 시세 존재 여부 확인
  async exists(tickerCode: string, tradeDate: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('market_data')
      .select('id')
      .eq('ticker_code', tickerCode)
      .eq('trade_date', tradeDate)
      .limit(1);

    if (error) {
      console.error('시세 존재 확인 오류:', error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  },

  // 시세 데이터 저장 (upsert)
  async upsert(marketData: MarketDataInsert): Promise<MarketData | null> {
    const { data, error } = await supabaseAdmin
      .from('market_data')
      .upsert(marketData as any, {
        onConflict: 'ticker_code,trade_date',
      })
      .select()
      .single();

    if (error) {
      console.error('시세 저장 오류:', error);
      return null;
    }

    return data as MarketData;
  },

  // 여러 시세 데이터 일괄 저장
  async bulkUpsert(marketDataList: MarketDataInsert[]): Promise<number> {
    if (marketDataList.length === 0) return 0;

    const { data, error } = await supabaseAdmin
      .from('market_data')
      .upsert(marketDataList as any, {
        onConflict: 'ticker_code,trade_date',
      })
      .select();

    if (error) {
      console.error('시세 일괄 저장 오류:', error);
      return 0;
    }

    return data?.length ?? 0;
  },

  // 오래된 데이터 삭제 (기본 1년 이상)
  async deleteOldData(daysToKeep: number = 365): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

    const { data, error } = await supabaseAdmin
      .from('market_data')
      .delete()
      .lt('trade_date', cutoffDateStr)
      .select();

    if (error) {
      console.error('오래된 시세 삭제 오류:', error);
      return 0;
    }

    return data?.length ?? 0;
  },

  // 캐시된 데이터 날짜 범위 확인
  async getCachedDateRange(tickerCode: string): Promise<{ minDate: string; maxDate: string } | null> {
    const { data, error } = await supabase
      .from('market_data')
      .select('trade_date')
      .eq('ticker_code', tickerCode)
      .order('trade_date', { ascending: true });

    if (error || !data || data.length === 0) {
      return null;
    }

    const typedData = data as Array<{ trade_date: string }>;

    return {
      minDate: typedData[0].trade_date,
      maxDate: typedData[typedData.length - 1].trade_date,
    };
  },
};
