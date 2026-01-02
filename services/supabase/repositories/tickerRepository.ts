import { supabase, supabaseAdmin } from '../client';
import { Ticker, TickerInsert } from '../types';

export const tickerRepository = {
  // 모든 종목 조회
  async findAll(): Promise<Ticker[]> {
    const { data, error } = await supabase
      .from('tickers')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('종목 조회 오류:', error);
      return [];
    }

    return (data as Ticker[]) || [];
  },

  // 종목 코드로 조회
  async findByCode(code: string): Promise<Ticker | null> {
    const { data, error } = await supabase
      .from('tickers')
      .select('*')
      .eq('code', code)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('종목 조회 오류:', error);
      }
      return null;
    }

    return data as Ticker;
  },

  // 카테고리별 종목 조회
  async findByCategory(category: Ticker['category']): Promise<Ticker[]> {
    const { data, error } = await supabase
      .from('tickers')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('카테고리별 종목 조회 오류:', error);
      return [];
    }

    return (data as Ticker[]) || [];
  },

  // 종목 추가 (서버 전용)
  async create(ticker: TickerInsert): Promise<Ticker | null> {
    const { data, error } = await supabaseAdmin
      .from('tickers')
      .insert(ticker as any)
      .select()
      .single();

    if (error) {
      console.error('종목 추가 오류:', error);
      return null;
    }

    return data as Ticker;
  },

  // 종목 업데이트 (서버 전용)
  async update(code: string, updates: Record<string, unknown>): Promise<Ticker | null> {
    const { data, error } = await supabaseAdmin
      .from('tickers')
      .update(updates)
      .eq('code', code)
      .select()
      .single();

    if (error) {
      console.error('종목 업데이트 오류:', error);
      return null;
    }

    return data as Ticker;
  },

  // 종목 비활성화 (서버 전용)
  async deactivate(code: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('tickers')
      .update({ is_active: false })
      .eq('code', code);

    if (error) {
      console.error('종목 비활성화 오류:', error);
      return false;
    }

    return true;
  },
};
