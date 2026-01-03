// Supabase 데이터베이스 타입 정의

export type Database = {
  public: {
    Tables: {
      tickers: {
        Row: {
          id: string;
          code: string;
          name: string;
          market: 'KOSPI' | 'KOSDAQ' | 'ETF' | 'INDEX';
          category: 'COSMAX' | 'COMPETITOR' | 'RISING' | 'INDEX';
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          market: 'KOSPI' | 'KOSDAQ' | 'ETF' | 'INDEX';
          category: 'COSMAX' | 'COMPETITOR' | 'RISING' | 'INDEX';
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          market?: 'KOSPI' | 'KOSDAQ' | 'ETF' | 'INDEX';
          category?: 'COSMAX' | 'COMPETITOR' | 'RISING' | 'INDEX';
          display_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      market_data: {
        Row: {
          id: string;
          ticker_code: string;
          trade_date: string;
          open_price: number;
          high_price: number;
          low_price: number;
          close_price: number;
          volume: number;
          change_rate: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticker_code: string;
          trade_date: string;
          open_price: number;
          high_price: number;
          low_price: number;
          close_price: number;
          volume: number;
          change_rate?: number | null;
          created_at?: string;
        };
        Update: {
          ticker_code?: string;
          trade_date?: string;
          open_price?: number;
          high_price?: number;
          low_price?: number;
          close_price?: number;
          volume?: number;
          change_rate?: number | null;
        };
      };
      news_articles: {
        Row: {
          id: string;
          title: string;
          link: string;
          original_link: string;
          description: string | null;
          source: string | null;
          category: string;
          published_at: string;
          content_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          link: string;
          original_link: string;
          description?: string | null;
          source?: string | null;
          category: string;
          published_at: string;
          content_hash: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          link?: string;
          original_link?: string;
          description?: string | null;
          source?: string | null;
          category?: string;
          published_at?: string;
          content_hash?: string;
        };
      };
      api_tokens: {
        Row: {
          id: string;
          provider: string;
          access_token: string;
          expires_at: string;
          issued_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider: string;
          access_token: string;
          expires_at: string;
          issued_at: string;
          created_at?: string;
        };
        Update: {
          provider?: string;
          access_token?: string;
          expires_at?: string;
          issued_at?: string;
        };
      };
    };
  };
};

// 편의 타입
export type Ticker = Database['public']['Tables']['tickers']['Row'];
export type TickerInsert = Database['public']['Tables']['tickers']['Insert'];
export type MarketData = Database['public']['Tables']['market_data']['Row'];
export type MarketDataInsert = Database['public']['Tables']['market_data']['Insert'];
export type NewsArticle = Database['public']['Tables']['news_articles']['Row'];
export type NewsArticleInsert = Database['public']['Tables']['news_articles']['Insert'];
export type ApiToken = Database['public']['Tables']['api_tokens']['Row'];
export type ApiTokenInsert = Database['public']['Tables']['api_tokens']['Insert'];
