// 한국투자증권 API 토큰 관리
import { KisTokenResponse, CachedToken } from './types';

// 토큰 캐시 (메모리)
let cachedToken: CachedToken | null = null;

// 환경 변수 검증
function getKisConfig() {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const baseUrl = process.env.KIS_BASE_URL || 'https://openapi.koreainvestment.com:9443';

  if (!appKey || !appSecret) {
    throw new Error('KIS_APP_KEY와 KIS_APP_SECRET 환경 변수가 필요합니다.');
  }

  return { appKey, appSecret, baseUrl };
}

// 토큰 발급 요청
async function requestNewToken(): Promise<KisTokenResponse> {
  const { appKey, appSecret, baseUrl } = getKisConfig();

  const response = await fetch(`${baseUrl}/oauth2/tokenP`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      appkey: appKey,
      appsecret: appSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`토큰 발급 실패: ${response.status} - ${errorText}`);
  }

  const data: KisTokenResponse = await response.json();
  return data;
}

// 토큰 만료 여부 확인 (5분 여유 두기)
function isTokenExpired(token: CachedToken): boolean {
  const bufferTime = 5 * 60 * 1000; // 5분
  return Date.now() >= token.expiresAt.getTime() - bufferTime;
}

// 유효한 토큰 가져오기
export async function getAccessToken(): Promise<string> {
  // 캐시된 토큰이 유효한 경우 재사용
  if (cachedToken && !isTokenExpired(cachedToken)) {
    return cachedToken.accessToken;
  }

  // 새 토큰 발급
  const tokenResponse = await requestNewToken();

  // 만료 시간 계산
  const expiresAt = new Date(tokenResponse.access_token_token_expired);

  // 캐시 업데이트
  cachedToken = {
    accessToken: tokenResponse.access_token,
    expiresAt,
  };

  console.log(`[KIS] 새 토큰 발급 완료. 만료: ${expiresAt.toISOString()}`);

  return cachedToken.accessToken;
}

// 토큰 캐시 초기화 (테스트용)
export function clearTokenCache(): void {
  cachedToken = null;
}

// 현재 캐시된 토큰 정보 (디버깅용)
export function getTokenInfo(): { hasToken: boolean; expiresAt?: string } {
  if (!cachedToken) {
    return { hasToken: false };
  }
  return {
    hasToken: true,
    expiresAt: cachedToken.expiresAt.toISOString(),
  };
}
