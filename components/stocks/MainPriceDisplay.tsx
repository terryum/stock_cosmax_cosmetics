'use client';

import { Box, Typography, Skeleton } from '@mui/material';
import { TickerPrice } from '@/types';

interface MainPriceDisplayProps {
  tickerName: string;
  priceData?: TickerPrice;
  isLoading?: boolean;
}

export function MainPriceDisplay({
  tickerName,
  priceData,
  isLoading = false,
}: MainPriceDisplayProps) {
  const getPriceColor = (changeRate: number) => {
    if (changeRate > 0) return 'stock.up';
    if (changeRate < 0) return 'stock.down';
    return 'stock.unchanged';
  };

  const formatPrice = (price: number) => {
    return '\u20A9' + price.toLocaleString('ko-KR');
  };

  const formatChange = (changePrice: number, changeRate: number) => {
    const prefix = changeRate > 0 ? '+' : '';
    const priceStr = prefix + '\u20A9' + Math.abs(changePrice).toLocaleString('ko-KR');
    const rateStr = '(' + prefix + changeRate.toFixed(2) + '%)';
    return priceStr + ' ' + rateStr;
  };

  if (isLoading) {
    return (
      <Box sx={{ px: 2, py: 3 }}>
        <Skeleton variant="text" width={200} height={60} />
        <Skeleton variant="text" width={150} height={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography
        variant="h2"
        component="div"
        sx={{
          fontWeight: 700,
          fontSize: '2.5rem',
          color: priceData
            ? getPriceColor(priceData.changeRate)
            : 'text.primary',
          lineHeight: 1.2,
        }}
      >
        {priceData ? formatPrice(priceData.currentPrice) : '---'}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mt: 0.5,
          color: priceData
            ? getPriceColor(priceData.changeRate)
            : 'text.secondary',
          fontWeight: 500,
        }}
      >
        {priceData
          ? formatChange(priceData.changePrice, priceData.changeRate) + ' \uC624\uB298'
          : '\uB370\uC774\uD130 \uB85C\uB529 \uC911...'}
      </Typography>
    </Box>
  );
}
