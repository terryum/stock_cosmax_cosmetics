-- API 토큰 저장 테이블 (한투 API 등)
CREATE TABLE IF NOT EXISTS api_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider VARCHAR(50) NOT NULL UNIQUE,  -- 'kis' 등 프로바이더 식별자
  access_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- provider 인덱스
CREATE INDEX IF NOT EXISTS idx_api_tokens_provider ON api_tokens(provider);

-- RLS 비활성화 (서버 전용 테이블)
ALTER TABLE api_tokens ENABLE ROW LEVEL SECURITY;

-- 서비스 역할만 접근 가능
CREATE POLICY "Service role only" ON api_tokens
  FOR ALL USING (auth.role() = 'service_role');
