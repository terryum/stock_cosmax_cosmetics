'use client';

import { Box, Typography, Button, Alert, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import { NewsCard, NewsCardSkeleton } from './NewsCard';
import { useInfiniteNews } from '@/hooks/useNews';
import { NewsCategory } from '@/types';
import { getNewsSectionByCategory } from '@/lib/constants';

interface NewsSectionProps {
  category: NewsCategory;
}

export function NewsSection({ category }: NewsSectionProps) {
  const section = getNewsSectionByCategory(category);
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteNews(category);

  // 모든 페이지의 아이템 합치기
  const allItems = data?.pages.flatMap((page) => page.data?.items || []) || [];

  // API 키 미설정 에러 체크
  const isApiKeyError = data?.pages[0]?.message?.includes('.env.local');

  return (
    <Box sx={{ mb: 3 }}>
      {/* 섹션 헤더 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {section?.title || category}
        </Typography>
        {!isLoading && !isError && (
          <Button
            size="small"
            onClick={() => refetch()}
            startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
            sx={{ minWidth: 'auto', fontSize: '0.75rem' }}
          >
            새로고침
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {/* 로딩 상태 */}
      {isLoading && (
        <>
          {[...Array(5)].map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </>
      )}

      {/* 에러 상태 */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error instanceof Error
            ? error.message
            : '뉴스를 불러오는데 실패했습니다.'}
        </Alert>
      )}

      {/* API 키 미설정 안내 */}
      {isApiKeyError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          네이버 API 키가 설정되지 않았습니다.
          <br />
          <Typography variant="caption" component="span">
            .env.local 파일에 NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET을
            설정해주세요.
          </Typography>
        </Alert>
      )}

      {/* 뉴스 목록 */}
      {!isLoading && !isError && !isApiKeyError && (
        <>
          {allItems.length > 0 ? (
            <>
              {allItems.map((article, index) => (
                <NewsCard key={`${article.link}-${index}`} article={article} />
              ))}

              {/* 더보기 버튼 */}
              {hasNextPage && (
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  endIcon={<ExpandMoreIcon />}
                  sx={{ mt: 1 }}
                >
                  {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
                </Button>
              )}
            </>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              py={3}
            >
              표시할 뉴스가 없습니다.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
