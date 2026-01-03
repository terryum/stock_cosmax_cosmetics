'use client';

import { Box, Typography, Link } from '@mui/material';
import { ProcessedNewsItem } from '@/services/naver';

interface NewsItemProps {
  item: ProcessedNewsItem;
}

export function NewsItem({ item }: NewsItemProps) {
  return (
    <Link
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      sx={{
        display: 'block',
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.03)',
        },
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: 'text.primary',
          fontWeight: 500,
          mb: 0.5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.4,
        }}
      >
        {item.title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {item.source}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          {item.relativeTime}
        </Typography>
      </Box>
    </Link>
  );
}
