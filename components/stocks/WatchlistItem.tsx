'use client';

import { Box, Typography, ListItemButton, Skeleton } from '@mui/material';
import { SparklineChart } from '@/components/charts/SparklineChart';
import { Ticker, TickerPrice, DailyPrice } from '@/types';

interface WatchlistItemProps {
  ticker: Ticker;
  priceData?: TickerPrice;
  sparklineData?: DailyPrice[];
  isMain?: boolean;
  isLoading?: boolean;
  onClick: () => void;
}

export function WatchlistItem({
  ticker,
  priceData,
  sparklineData = [],
  isMain = false,
  isLoading = false,
  onClick,
}: WatchlistItemProps) {
  const getPriceColor = (changeRate: number) => {
    if (changeRate > 0) return 'stock.up';
    if (changeRate < 0) return 'stock.down';
    return 'stock.unchanged';
  };

  const formatPrice = (price: number) => {
    return '\u20A9' + price.toLocaleString('ko-KR');
  };

  const formatChangeRate = (rate: number) => {
    const prefix = rate > 0 ? '+' : '';
    return prefix + rate.toFixed(2) + '%';
  };

  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: isMain ? 'rgba(0, 200, 5, 0.1)' : 'transparent',
        '&:hover': {
          bgcolor: isMain ? 'rgba(0, 200, 5, 0.15)' : 'rgba(255,255,255,0.05)',
        },
      }}
    >
      {/* Left: Ticker Name */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body1"
          fontWeight={isMain ? 600 : 500}
          sx={{
            color: isMain ? 'primary.main' : 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {ticker.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {ticker.market}
        </Typography>
      </Box>

      {/* Center: Sparkline Chart */}
      <Box sx={{ mx: 2 }}>
        {isLoading ? (
          <Skeleton variant="rectangular" width={60} height={30} />
        ) : (
          <SparklineChart data={sparklineData} />
        )}
      </Box>

      {/* Right: Price and Change */}
      <Box sx={{ textAlign: 'right', minWidth: 90 }}>
        {isLoading ? (
          <>
            <Skeleton variant="text" width={70} height={24} />
            <Skeleton variant="text" width={50} height={18} />
          </>
        ) : priceData ? (
          <>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: getPriceColor(priceData.changeRate) }}
            >
              {formatPrice(priceData.currentPrice)}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: getPriceColor(priceData.changeRate) }}
            >
              {formatChangeRate(priceData.changeRate)}
            </Typography>
          </>
        ) : (
          <Typography variant="caption" color="text.secondary">
            ---
          </Typography>
        )}
      </Box>
    </ListItemButton>
  );
}
