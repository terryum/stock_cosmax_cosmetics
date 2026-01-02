-- 코스맥스 마켓 인사이트 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- 1. 종목 정보 테이블
CREATE TABLE IF NOT EXISTS tickers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  market VARCHAR(10) NOT NULL CHECK (market IN ('KOSPI', 'KOSDAQ', 'ETF', 'INDEX')),
  category VARCHAR(20) NOT NULL CHECK (category IN ('COSMAX', 'COMPETITOR', 'RISING', 'INDEX')),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 주가 데이터 테이블 (캐싱용)
CREATE TABLE IF NOT EXISTS market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker_code VARCHAR(10) NOT NULL REFERENCES tickers(code) ON DELETE CASCADE,
  trade_date DATE NOT NULL,
  open_price DECIMAL(12, 2) NOT NULL,
  high_price DECIMAL(12, 2) NOT NULL,
  low_price DECIMAL(12, 2) NOT NULL,
  close_price DECIMAL(12, 2) NOT NULL,
  volume BIGINT NOT NULL DEFAULT 0,
  change_rate DECIMAL(8, 4),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ticker_code, trade_date)
);

-- 3. 뉴스 기사 테이블
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  link VARCHAR(1000) NOT NULL,
  original_link VARCHAR(1000) NOT NULL,
  description TEXT,
  source VARCHAR(50),
  category VARCHAR(20) NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  content_hash VARCHAR(64) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_market_data_ticker_date ON market_data(ticker_code, trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_market_data_trade_date ON market_data(trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_content_hash ON news_articles(content_hash);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tickers_updated_at ON tickers;
CREATE TRIGGER tickers_updated_at
  BEFORE UPDATE ON tickers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 초기 종목 데이터 삽입
INSERT INTO tickers (code, name, market, category, display_order) VALUES
  ('192820', '코스맥스', 'KOSDAQ', 'COSMAX', 1),
  ('044820', '코스맥스비티아이', 'KOSDAQ', 'COSMAX', 2),
  ('222040', '코스맥스엔비티', 'KOSDAQ', 'COSMAX', 3),
  ('161890', '한국콜마', 'KOSPI', 'COMPETITOR', 4),
  ('241710', '코스메카코리아', 'KOSDAQ', 'COMPETITOR', 5),
  ('090430', '아모레퍼시픽', 'KOSPI', 'COMPETITOR', 6),
  ('278470', '에이피알', 'KOSDAQ', 'RISING', 7),
  ('526970', '달바글로벌', 'KOSDAQ', 'RISING', 8),
  ('018290', '브이티', 'KOSDAQ', 'RISING', 9),
  ('0001', '코스피', 'INDEX', 'INDEX', 10),
  ('1001', '코스닥', 'INDEX', 'INDEX', 11),
  ('228790', 'TIGER 화장품', 'ETF', 'INDEX', 12)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  market = EXCLUDED.market,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order;

-- RLS (Row Level Security) 정책
ALTER TABLE tickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 읽기 허용
CREATE POLICY "tickers_read_all" ON tickers FOR SELECT USING (true);
CREATE POLICY "market_data_read_all" ON market_data FOR SELECT USING (true);
CREATE POLICY "news_read_all" ON news_articles FOR SELECT USING (true);

-- 서비스 역할만 쓰기 허용 (API 라우트에서 service_role 키 사용)
CREATE POLICY "market_data_insert_service" ON market_data FOR INSERT WITH CHECK (true);
CREATE POLICY "market_data_update_service" ON market_data FOR UPDATE USING (true);
CREATE POLICY "news_insert_service" ON news_articles FOR INSERT WITH CHECK (true);
