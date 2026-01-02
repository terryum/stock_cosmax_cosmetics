'use client';

import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Chip,
  Skeleton,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ProcessedNewsItem } from '@/services/naver';

interface NewsCardProps {
  article: ProcessedNewsItem;
}

export function NewsCard({ article }: NewsCardProps) {
  const handleClick = () => {
    // 새 탭에서 원문 링크 열기
    window.open(article.originalLink || article.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <CardActionArea onClick={handleClick}>
        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
          {/* 제목 */}
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.5,
              mb: 1,
            }}
          >
            {article.title}
          </Typography>

          {/* 메타 정보 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={article.source}
                size="small"
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  '& .MuiChip-label': { px: 1 },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {article.relativeTime}
              </Typography>
            </Box>
            <OpenInNewIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// 스켈레톤 컴포넌트
export function NewsCardSkeleton() {
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ py: 1.5, px: 2 }}>
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rounded" width={60} height={20} />
          <Skeleton variant="text" width={50} height={20} />
        </Box>
      </CardContent>
    </Card>
  );
}
