// 뉴스 기사 타입
export interface NewsArticle {
  title: string; // 기사 제목
  link: string; // 원문 링크
  originalLink?: string; // 네이버 링크가 아닌 원본 링크
  description: string; // 기사 요약
  pubDate: string; // 발행일시
  source?: string; // 언론사 (추출 가능한 경우)
}

// 뉴스 카테고리
export type NewsCategory = 'cosmax' | 'competitors' | 'kbeauty';

// 뉴스 섹션 정보
export interface NewsSection {
  category: NewsCategory;
  title: string;
  keywords: string[];
}

// 네이버 뉴스 API 응답
export interface NaverNewsResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverNewsItem[];
}

export interface NaverNewsItem {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

// API 응답 타입
export interface NewsResponse {
  success: boolean;
  data?: NewsArticle[];
  total?: number;
  page?: number;
  error?: string;
}
