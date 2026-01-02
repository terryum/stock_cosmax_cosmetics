import { NewsSection, NewsCategory } from '@/types';

// 뉴스 섹션 정의
export const NEWS_SECTIONS: NewsSection[] = [
  {
    category: 'cosmax',
    title: '코스맥스',
    keywords: [
      '코스맥스',
      '이경수 코스맥스',
      '코스맥스비티아이',
      '코스맥스엔비티',
      'COSMAX',
    ],
  },
  {
    category: 'competitors',
    title: '경쟁사/ODM',
    keywords: [
      '한국콜마',
      '코스메카코리아',
      '화장품 ODM',
      '화장품 OEM',
      '인터코스',
      '콜마',
    ],
  },
  {
    category: 'kbeauty',
    title: 'K-뷰티',
    keywords: [
      'K뷰티',
      'K-뷰티',
      'K뷰티 수출',
      '한국 화장품',
      '올리브영',
      '뷰티 트렌드',
      '화장품 수출',
    ],
  },
];

// 카테고리별 섹션 정보 조회
export const getNewsSectionByCategory = (
  category: NewsCategory
): NewsSection | undefined => {
  return NEWS_SECTIONS.find((section) => section.category === category);
};

// 카테고리별 검색 쿼리 생성
export const buildSearchQuery = (category: NewsCategory): string => {
  const section = getNewsSectionByCategory(category);
  if (!section) return '';

  // 키워드를 OR로 연결 (네이버 검색 API 문법)
  return section.keywords.join(' OR ');
};

// 기본 뉴스 표시 개수
export const DEFAULT_NEWS_COUNT = 5;

// 더보기 시 추가 로드 개수
export const NEWS_PAGE_SIZE = 5;
