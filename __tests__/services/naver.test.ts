import { NaverApiClient } from '@/services/naver/client';

describe('NaverApiClient', () => {
  let client: NaverApiClient;

  beforeEach(() => {
    client = new NaverApiClient();
  });

  describe('HTML 태그 제거', () => {
    it('HTML 태그를 올바르게 제거해야 한다', () => {
      const item = {
        title: '<b>코스맥스</b> 실적 발표',
        originallink: 'https://news.example.com/article',
        link: 'https://n.news.naver.com/article',
        description: '코스맥스가 &quot;좋은&quot; 실적을 &amp; 발표했다.',
        pubDate: 'Mon, 01 Jan 2024 09:00:00 +0900',
      };

      const processed = client.processNewsItem(item);

      expect(processed.title).toBe('코스맥스 실적 발표');
      expect(processed.description).toBe('코스맥스가 "좋은" 실적을 & 발표했다.');
    });
  });

  describe('언론사 추출', () => {
    it('주요 언론사를 올바르게 추출해야 한다', () => {
      const testCases = [
        { url: 'https://www.chosun.com/article/123', expected: '조선일보' },
        { url: 'https://www.mk.co.kr/news/123', expected: '매일경제' },
        { url: 'https://www.yna.co.kr/view/123', expected: '연합뉴스' },
        { url: 'https://n.news.naver.com/article', expected: '네이버뉴스' },
      ];

      testCases.forEach(({ url, expected }) => {
        const item = {
          title: '테스트',
          originallink: url,
          link: 'https://n.news.naver.com',
          description: '테스트',
          pubDate: 'Mon, 01 Jan 2024 09:00:00 +0900',
        };

        const processed = client.processNewsItem(item);
        expect(processed.source).toBe(expected);
      });
    });
  });

  describe('상대 시간 계산', () => {
    it('방금 전 시간을 올바르게 표시해야 한다', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      const item = {
        title: '테스트',
        originallink: 'https://example.com',
        link: 'https://n.news.naver.com',
        description: '테스트',
        pubDate: fiveMinutesAgo.toUTCString(),
      };

      const processed = client.processNewsItem(item);
      expect(processed.relativeTime).toMatch(/\d+분 전/);
    });

    it('몇 시간 전 시간을 올바르게 표시해야 한다', () => {
      const now = new Date();
      const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

      const item = {
        title: '테스트',
        originallink: 'https://example.com',
        link: 'https://n.news.naver.com',
        description: '테스트',
        pubDate: threeHoursAgo.toUTCString(),
      };

      const processed = client.processNewsItem(item);
      expect(processed.relativeTime).toMatch(/\d+시간 전/);
    });

    it('며칠 전 시간을 올바르게 표시해야 한다', () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      const item = {
        title: '테스트',
        originallink: 'https://example.com',
        link: 'https://n.news.naver.com',
        description: '테스트',
        pubDate: twoDaysAgo.toUTCString(),
      };

      const processed = client.processNewsItem(item);
      expect(processed.relativeTime).toMatch(/\d+일 전/);
    });
  });

  describe('뉴스 아이템 가공', () => {
    it('모든 필드를 올바르게 가공해야 한다', () => {
      const item = {
        title: '<b>코스맥스</b> 신제품 출시',
        originallink: 'https://www.mk.co.kr/news/economy/123',
        link: 'https://n.news.naver.com/article/123',
        description: '코스맥스가 새로운 &lt;제품&gt;을 출시했다.',
        pubDate: 'Mon, 01 Jan 2024 09:00:00 +0900',
      };

      const processed = client.processNewsItem(item);

      expect(processed.title).toBe('코스맥스 신제품 출시');
      expect(processed.link).toBe('https://n.news.naver.com/article/123');
      expect(processed.originalLink).toBe('https://www.mk.co.kr/news/economy/123');
      expect(processed.description).toBe('코스맥스가 새로운 <제품>을 출시했다.');
      expect(processed.source).toBe('매일경제');
      expect(processed.relativeTime).toBeTruthy();
    });
  });
});
