'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { NewsCategory } from '@/types';
import { ProcessedNewsItem } from '@/services/naver';
import { DEFAULT_NEWS_COUNT } from '@/lib/constants';

interface NewsApiResponse {
  success: boolean;
  data?: {
    category: NewsCategory;
    title: string;
    items: ProcessedNewsItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  };
  error?: string;
  message?: string;
}

/**
 * 카테고리별 뉴스 가져오기 (단일 페이지)
 */
export function useNews(category: NewsCategory, limit = DEFAULT_NEWS_COUNT) {
  return useQuery<NewsApiResponse>({
    queryKey: ['news', category, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/news/${category}?limit=${limit}`
      );
      if (!response.ok) {
        throw new Error('뉴스를 불러오는데 실패했습니다.');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 2,
  });
}

/**
 * 카테고리별 뉴스 가져오기 (무한 스크롤)
 */
export function useInfiniteNews(category: NewsCategory) {
  return useInfiniteQuery<NewsApiResponse>({
    queryKey: ['news', 'infinite', category],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `/api/news/${category}?page=${pageParam}&limit=${DEFAULT_NEWS_COUNT}`
      );
      if (!response.ok) {
        throw new Error('뉴스를 불러오는데 실패했습니다.');
      }
      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data?.pagination.hasMore) {
        return undefined;
      }
      return lastPage.data.pagination.page + 1;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 모든 카테고리 뉴스 가져오기
 */
export function useAllNews() {
  const cosmaxQuery = useNews('cosmax');
  const competitorsQuery = useNews('competitors');
  const kbeautyQuery = useNews('kbeauty');

  return {
    cosmax: cosmaxQuery,
    competitors: competitorsQuery,
    kbeauty: kbeautyQuery,
    isLoading:
      cosmaxQuery.isLoading ||
      competitorsQuery.isLoading ||
      kbeautyQuery.isLoading,
    isError:
      cosmaxQuery.isError ||
      competitorsQuery.isError ||
      kbeautyQuery.isError,
  };
}
