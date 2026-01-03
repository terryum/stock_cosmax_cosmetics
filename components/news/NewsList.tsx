'use client';

import { Box, Typography, Skeleton } from '@mui/material';
import { NewsItem } from './NewsItem';
import { useNews } from '@/hooks/useNews';

interface NewsListProps {
  limit?: number;
}

export function NewsList({ limit = 5 }: NewsListProps) {
  const { data, isLoading, isError } = useNews('cosmax', limit);

  if (isLoading) {
    return (
      <Box sx={{ px: 2, pb: 2 }}>
        {Array.from({ length: limit }).map((_, i) => (
          <Box key={i} sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Skeleton variant="text" width="90%" height={20} />
            <Skeleton variant="text" width="60%" height={20} />
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Skeleton variant="text" width={60} height={16} />
              <Skeleton variant="text" width={40} height={16} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (isError || !data?.success || !data?.data?.items?.length) {
    return (
      <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          뉴스를 불러올 수 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      {data.data.items.slice(0, limit).map((item, index) => (
        <NewsItem key={index} item={item} />
      ))}
    </Box>
  );
}
