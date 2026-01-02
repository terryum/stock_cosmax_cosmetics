import { createClient } from '@supabase/supabase-js';

// 환경 변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.warn('NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.');
}

// 클라이언트용 Supabase 클라이언트 (브라우저에서 사용)
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// 서버용 Supabase 클라이언트 (API 라우트에서 사용, RLS 우회)
export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// 연결 테스트
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('tickers').select('count').limit(1);
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = 테이블이 없음 (아직 생성 안됨)
      console.error('Supabase 연결 오류:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase 연결 실패:', err);
    return false;
  }
}
