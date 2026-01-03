// 한국투자증권 API 토큰 관리 (1일 1회 발급, Supabase 저장)
import { KisTokenResponse, CachedToken } from './types';
import { tokenRepository } from '../supabase/repositories';

const PROVIDER = 'kis';
const TOKEN_REFRESH_HOUR = 4; // 매일 새벽 4시에 갱신

// 메모리 캐시 (serverless 환경에서 cold start 최소화)
let memoryCache: CachedToken | null = null;

function getKisConfig() {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const baseUrl = process.env.KIS_BASE_URL || 'https://openapi.koreainvestment.com:9443';

  if (!appKey || !appSecret) {
    throw new Error('KIS_APP_KEY, KIS_APP_SECRET 환경 변수가 필요합니다.');
  }

  return { appKey, appSecret, baseUrl };
}

// 한국 시간 기준 오늘 새벽 4시 Date 객체 반환
function getTodayRefreshTime(): Date {
  const now = new Date();
  // KST = UTC+9
  const kstOffset = 9 * 60 * 60 * 1000;
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const kstNow = new Date(utcNow + kstOffset);

  // 오늘 새벽 4시
  const refreshTime = new Date(kstNow);
  refreshTime.setHours(TOKEN_REFRESH_HOUR, 0, 0, 0);

  // 현재 시간이 4시 이전이면 어제의 4시를 기준으로
  if (kstNow.getHours() < TOKEN_REFRESH_HOUR) {
    refreshTime.setDate(refreshTime.getDate() - 1);
  }

  // UTC로 변환해서 반환
  return new Date(refreshTime.getTime() - kstOffset + now.getTimezoneOffset() * 60 * 1000);
}

// 토큰이 오늘(새벽 4시 기준) 발급된 것인지 확인
function isTokenValidForToday(issuedAt: Date): boolean {
  const todayRefreshTime = getTodayRefreshTime();
  return issuedAt >= todayRefreshTime;
}

async function requestNewToken(): Promise<KisTokenResponse> {
  const { appKey, appSecret, baseUrl } = getKisConfig();

  console.log('[KIS] 새 토큰 발급 요청...');

  const response = await fetch(baseUrl + '/oauth2/tokenP', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      appkey: appKey,
      appsecret: appSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('토큰 발급 실패: ' + response.status + ' - ' + errorText);
  }

  const data: KisTokenResponse = await response.json();

  // 에러 메시지 체크
  if (data.msg_cd && data.msg_cd !== '0000' && data.msg1) {
    throw new Error('토큰 발급 실패: ' + data.msg1);
  }

  return data;
}

export async function getAccessToken(): Promise<string> {
  // 1. 메모리 캐시 확인
  if (memoryCache && isTokenValidForToday(memoryCache.issuedAt)) {
    console.log('[KIS] 메모리 캐시에서 토큰 사용');
    return memoryCache.accessToken;
  }

  // 2. Supabase에서 토큰 조회
  try {
    const savedToken = await tokenRepository.findByProvider(PROVIDER);

    if (savedToken) {
      const issuedAt = new Date(savedToken.issued_at);

      if (isTokenValidForToday(issuedAt)) {
        console.log('[KIS] Supabase에서 저장된 토큰 사용 (발급: ' + issuedAt.toISOString() + ')');

        // 메모리 캐시에 저장
        memoryCache = {
          accessToken: savedToken.access_token,
          expiresAt: new Date(savedToken.expires_at),
          issuedAt,
        };

        return savedToken.access_token;
      } else {
        console.log('[KIS] 저장된 토큰이 오래됨. 새벽 4시 이전 발급. 새 토큰 필요.');
      }
    }
  } catch (error) {
    console.error('[KIS] Supabase 토큰 조회 실패:', error);
    // Supabase 연결 실패 시에도 새 토큰 발급 시도
  }

  // 3. 새 토큰 발급
  console.log('[KIS] 새 토큰 발급 중...');
  const tokenResponse = await requestNewToken();
  const expiresAt = new Date(tokenResponse.access_token_token_expired);
  const issuedAt = new Date();

  // 메모리 캐시 업데이트
  memoryCache = {
    accessToken: tokenResponse.access_token,
    expiresAt,
    issuedAt,
  };

  // Supabase에 저장
  try {
    await tokenRepository.save({
      provider: PROVIDER,
      access_token: tokenResponse.access_token,
      expires_at: expiresAt.toISOString(),
      issued_at: issuedAt.toISOString(),
    });
    console.log('[KIS] 토큰 Supabase에 저장 완료');
  } catch (error) {
    console.error('[KIS] Supabase 토큰 저장 실패:', error);
    // 저장 실패해도 메모리 캐시는 있으므로 진행
  }

  console.log('[KIS] 토큰 발급 완료. 만료: ' + expiresAt.toISOString());
  return tokenResponse.access_token;
}

export function clearTokenCache(): void {
  memoryCache = null;
  tokenRepository.delete(PROVIDER).catch(console.error);
}

export function getTokenInfo(): { hasToken: boolean; expiresAt?: string; issuedAt?: string } {
  if (!memoryCache) {
    return { hasToken: false };
  }
  return {
    hasToken: true,
    expiresAt: memoryCache.expiresAt.toISOString(),
    issuedAt: memoryCache.issuedAt?.toISOString(),
  };
}
