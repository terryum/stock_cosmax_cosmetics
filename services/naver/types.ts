// 네이버 뉴스 검색 API 응답 타입
export interface NaverNewsApiResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverNewsItem[];
}

export interface NaverNewsItem {
  title: string; // HTML 태그 포함 가능
  originallink: string;
  link: string;
  description: string; // HTML 태그 포함 가능
  pubDate: string; // RFC 2822 형식
}

// 가공된 뉴스 아이템
export interface ProcessedNewsItem {
  title: string;
  link: string;
  originalLink: string;
  description: string;
  pubDate: string;
  source: string;
  relativeTime: string;
}

// 네이버 API 검색 옵션
export interface NaverSearchOptions {
  query: string;
  display?: number; // 검색 결과 출력 건수 (기본: 10, 최대: 100)
  start?: number; // 검색 시작 위치 (기본: 1, 최대: 1000)
  sort?: 'sim' | 'date'; // sim: 정확도순, date: 날짜순
}
