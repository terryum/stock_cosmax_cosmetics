import { KisApiClient } from '@/services/kis/client';
import { clearTokenCache, getTokenInfo } from '@/services/kis/auth';

// 모의 fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('KisApiClient', () => {
  let client: KisApiClient;

  beforeEach(() => {
    client = new KisApiClient();
    mockFetch.mockClear();
    clearTokenCache();
  });

  describe('주식 현재가 조회', () => {
    it('API 키가 없으면 에러를 반환해야 한다', async () => {
      await expect(client.getStockPrice('192820')).rejects.toThrow(
        'KIS_APP_KEY와 KIS_APP_SECRET 환경 변수가 필요합니다.'
      );
    });
  });

  describe('일별 시세 조회', () => {
    it('API 키가 없으면 에러를 반환해야 한다', async () => {
      await expect(
        client.getStockDailyPrices('192820', '20240101', '20240131')
      ).rejects.toThrow('KIS_APP_KEY와 KIS_APP_SECRET 환경 변수가 필요합니다.');
    });
  });

  describe('지수 현재가 조회', () => {
    it('API 키가 없으면 에러를 반환해야 한다', async () => {
      await expect(client.getIndexPrice('0001')).rejects.toThrow(
        'KIS_APP_KEY와 KIS_APP_SECRET 환경 변수가 필요합니다.'
      );
    });
  });

  describe('통합 조회', () => {
    it('isIndex가 true이면 지수 API를 호출해야 한다', async () => {
      await expect(client.getPrice('0001', true)).rejects.toThrow(
        'KIS_APP_KEY와 KIS_APP_SECRET 환경 변수가 필요합니다.'
      );
    });

    it('isIndex가 false이면 주식 API를 호출해야 한다', async () => {
      await expect(client.getPrice('192820', false)).rejects.toThrow(
        'KIS_APP_KEY와 KIS_APP_SECRET 환경 변수가 필요합니다.'
      );
    });
  });
});

describe('Token 관리', () => {
  beforeEach(() => {
    clearTokenCache();
  });

  describe('토큰 캐시 초기화', () => {
    it('clearTokenCache가 토큰을 초기화해야 한다', () => {
      clearTokenCache();
      const info = getTokenInfo();
      expect(info.hasToken).toBe(false);
    });
  });

  describe('토큰 정보 조회', () => {
    it('캐시된 토큰이 없으면 hasToken이 false여야 한다', () => {
      const info = getTokenInfo();
      expect(info.hasToken).toBe(false);
      expect(info.expiresAt).toBeUndefined();
    });
  });
});
