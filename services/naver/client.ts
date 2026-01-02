import {
  NaverNewsApiResponse,
  NaverSearchOptions,
  ProcessedNewsItem,
} from './types';

const NAVER_API_URL = 'https://openapi.naver.com/v1/search/news.json';

/**
 * 네이버 검색 API 클라이언트
 */
export class NaverApiClient {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.NAVER_CLIENT_ID || '';
    this.clientSecret = process.env.NAVER_CLIENT_SECRET || '';

    if (!this.clientId || !this.clientSecret) {
      console.warn(
        'NAVER_CLIENT_ID 또는 NAVER_CLIENT_SECRET이 설정되지 않았습니다.'
      );
    }
  }

  /**
   * 뉴스 검색 API 호출
   */
  async searchNews(options: NaverSearchOptions): Promise<NaverNewsApiResponse> {
    const { query, display = 10, start = 1, sort = 'date' } = options;

    const params = new URLSearchParams({
      query,
      display: String(display),
      start: String(start),
      sort,
    });

    const response = await fetch(`${NAVER_API_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': this.clientId,
        'X-Naver-Client-Secret': this.clientSecret,
      },
      next: {
        revalidate: 300, // 5분 캐시
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `네이버 API 호출 실패: ${response.status} - ${errorText}`
      );
    }

    return response.json();
  }

  /**
   * HTML 태그 제거
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .trim();
  }

  /**
   * 언론사 추출 (URL에서)
   */
  private extractSource(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      // 주요 언론사 매핑
      const sourceMap: Record<string, string> = {
        'news.naver.com': '네이버뉴스',
        'n.news.naver.com': '네이버뉴스',
        'www.chosun.com': '조선일보',
        'www.donga.com': '동아일보',
        'www.joongang.co.kr': '중앙일보',
        'www.hani.co.kr': '한겨레',
        'www.khan.co.kr': '경향신문',
        'www.mk.co.kr': '매일경제',
        'www.hankyung.com': '한국경제',
        'www.sedaily.com': '서울경제',
        'www.edaily.co.kr': '이데일리',
        'www.etnews.com': '전자신문',
        'www.mt.co.kr': '머니투데이',
        'www.newsis.com': '뉴시스',
        'www.yna.co.kr': '연합뉴스',
        'biz.chosun.com': '조선비즈',
        'news.mt.co.kr': '머니투데이',
      };

      return sourceMap[hostname] || hostname.replace('www.', '').split('.')[0];
    } catch {
      return '뉴스';
    }
  }

  /**
   * 상대 시간 계산
   */
  private getRelativeTime(pubDate: string): string {
    const now = new Date();
    const published = new Date(pubDate);
    const diffMs = now.getTime() - published.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return published.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      });
    }
  }

  /**
   * 뉴스 아이템 가공
   */
  processNewsItem(item: NaverNewsApiResponse['items'][0]): ProcessedNewsItem {
    return {
      title: this.stripHtml(item.title),
      link: item.link,
      originalLink: item.originallink,
      description: this.stripHtml(item.description),
      pubDate: item.pubDate,
      source: this.extractSource(item.originallink),
      relativeTime: this.getRelativeTime(item.pubDate),
    };
  }

  /**
   * 뉴스 검색 및 가공
   */
  async searchAndProcessNews(
    options: NaverSearchOptions
  ): Promise<{
    items: ProcessedNewsItem[];
    total: number;
    start: number;
    display: number;
  }> {
    const response = await this.searchNews(options);

    return {
      items: response.items.map((item) => this.processNewsItem(item)),
      total: response.total,
      start: response.start,
      display: response.display,
    };
  }
}

// 싱글톤 인스턴스
export const naverApiClient = new NaverApiClient();
