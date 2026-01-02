import {
  TICKERS,
  DEFAULT_TICKER,
  getTickerByCode,
  getTickersByCategory,
  isIndexOrETF,
} from '@/lib/constants/tickers';
import {
  TIME_RANGES,
  DEFAULT_TIME_RANGE,
  getTimeRangeByValue,
  calculateDateRange,
  formatDateToYYYYMMDD,
} from '@/lib/constants/timeRanges';
import {
  NEWS_SECTIONS,
  getNewsSectionByCategory,
  buildSearchQuery,
} from '@/lib/constants/newsKeywords';

describe('tickers 상수', () => {
  describe('TICKERS', () => {
    it('12개의 종목이 정의되어 있어야 한다', () => {
      expect(TICKERS).toHaveLength(12);
    });

    it('모든 종목이 필수 필드를 가지고 있어야 한다', () => {
      TICKERS.forEach((ticker) => {
        expect(ticker).toHaveProperty('code');
        expect(ticker).toHaveProperty('name');
        expect(ticker).toHaveProperty('market');
        expect(ticker).toHaveProperty('category');
        expect(ticker.code).toBeTruthy();
        expect(ticker.name).toBeTruthy();
      });
    });

    it('코스맥스 관련 종목이 3개 있어야 한다', () => {
      const cosmaxTickers = TICKERS.filter((t) => t.category === 'COSMAX');
      expect(cosmaxTickers).toHaveLength(3);
    });
  });

  describe('DEFAULT_TICKER', () => {
    it('기본 종목이 코스맥스여야 한다', () => {
      expect(DEFAULT_TICKER.name).toBe('코스맥스');
      expect(DEFAULT_TICKER.code).toBe('192820');
    });
  });

  describe('getTickerByCode', () => {
    it('코드로 종목을 찾을 수 있어야 한다', () => {
      const ticker = getTickerByCode('192820');
      expect(ticker?.name).toBe('코스맥스');
    });

    it('존재하지 않는 코드는 undefined를 반환해야 한다', () => {
      const ticker = getTickerByCode('999999');
      expect(ticker).toBeUndefined();
    });
  });

  describe('getTickersByCategory', () => {
    it('카테고리별로 종목을 필터링할 수 있어야 한다', () => {
      const competitors = getTickersByCategory('COMPETITOR');
      expect(competitors).toHaveLength(3);
      expect(competitors.every((t) => t.category === 'COMPETITOR')).toBe(true);
    });
  });

  describe('isIndexOrETF', () => {
    it('지수와 ETF를 올바르게 판별해야 한다', () => {
      const kospi = TICKERS.find((t) => t.name === '코스피');
      const tigerEtf = TICKERS.find((t) => t.name === 'TIGER 화장품');
      const cosmax = TICKERS.find((t) => t.name === '코스맥스');

      expect(isIndexOrETF(kospi!)).toBe(true);
      expect(isIndexOrETF(tigerEtf!)).toBe(true);
      expect(isIndexOrETF(cosmax!)).toBe(false);
    });
  });
});

describe('timeRanges 상수', () => {
  describe('TIME_RANGES', () => {
    it('7개의 기간 옵션이 있어야 한다', () => {
      expect(TIME_RANGES).toHaveLength(7);
    });

    it('custom 옵션을 제외한 모든 옵션에 days가 있어야 한다', () => {
      TIME_RANGES.forEach((range) => {
        if (range.value !== 'custom') {
          expect(range.days).toBeDefined();
          expect(range.days).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('DEFAULT_TIME_RANGE', () => {
    it('기본 기간이 1개월이어야 한다', () => {
      expect(DEFAULT_TIME_RANGE).toBe('1m');
    });
  });

  describe('getTimeRangeByValue', () => {
    it('값으로 기간 정보를 찾을 수 있어야 한다', () => {
      const range = getTimeRangeByValue('3m');
      expect(range?.label).toBe('3개월');
      expect(range?.days).toBe(90);
    });
  });

  describe('calculateDateRange', () => {
    it('기간에 맞는 날짜 범위를 계산해야 한다', () => {
      const { startDate, endDate } = calculateDateRange('3d');
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      expect(diffDays).toBe(3);
    });

    it('커스텀 날짜 범위를 반환해야 한다', () => {
      const customStart = new Date('2024-01-01');
      const customEnd = new Date('2024-06-30');

      const { startDate, endDate } = calculateDateRange(
        'custom',
        customStart,
        customEnd
      );

      expect(startDate).toEqual(customStart);
      expect(endDate).toEqual(customEnd);
    });
  });

  describe('formatDateToYYYYMMDD', () => {
    it('날짜를 YYYYMMDD 형식으로 변환해야 한다', () => {
      const date = new Date('2024-05-15');
      expect(formatDateToYYYYMMDD(date)).toBe('20240515');
    });

    it('한 자리 월/일에 0을 패딩해야 한다', () => {
      const date = new Date('2024-01-05');
      expect(formatDateToYYYYMMDD(date)).toBe('20240105');
    });
  });
});

describe('newsKeywords 상수', () => {
  describe('NEWS_SECTIONS', () => {
    it('3개의 뉴스 섹션이 있어야 한다', () => {
      expect(NEWS_SECTIONS).toHaveLength(3);
    });

    it('각 섹션에 필수 필드가 있어야 한다', () => {
      NEWS_SECTIONS.forEach((section) => {
        expect(section).toHaveProperty('category');
        expect(section).toHaveProperty('title');
        expect(section).toHaveProperty('keywords');
        expect(section.keywords.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getNewsSectionByCategory', () => {
    it('카테고리로 섹션을 찾을 수 있어야 한다', () => {
      const section = getNewsSectionByCategory('cosmax');
      expect(section?.title).toBe('코스맥스');
    });

    it('존재하지 않는 카테고리는 undefined를 반환해야 한다', () => {
      const section = getNewsSectionByCategory('invalid' as any);
      expect(section).toBeUndefined();
    });
  });

  describe('buildSearchQuery', () => {
    it('키워드를 OR로 연결한 쿼리를 생성해야 한다', () => {
      const query = buildSearchQuery('cosmax');
      expect(query).toContain('코스맥스');
      expect(query).toContain(' OR ');
    });
  });
});
