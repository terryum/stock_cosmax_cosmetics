'use client';

import { Box, Typography, List } from '@mui/material';
import { WatchlistItem } from './WatchlistItem';
import { useTickerStore } from '@/stores';
import { TICKERS } from '@/lib/constants';
import { TickerPrice, DailyPrice } from '@/types';

interface WatchlistProps {
  priceData?: Record<string, TickerPrice>;
  sparklineData?: Record<string, DailyPrice[]>;
  isLoading?: boolean;
}

export function Watchlist({
  priceData,
  sparklineData,
  isLoading = false,
}: WatchlistProps) {
  const { mainTicker, setMainTicker } = useTickerStore();

  const handleTickerClick = (ticker: typeof TICKERS[0]) => {
    setMainTicker(ticker);
  };

  return (
    <Box>
      {/* Section Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          Watchlist
        </Typography>
      </Box>

      {/* Ticker List */}
      <List disablePadding>
        {TICKERS.map((ticker) => (
          <WatchlistItem
            key={ticker.code}
            ticker={ticker}
            priceData={priceData?.[ticker.code]}
            sparklineData={sparklineData?.[ticker.code]}
            isMain={mainTicker.code === ticker.code}
            isLoading={isLoading}
            onClick={() => handleTickerClick(ticker)}
          />
        ))}
      </List>
    </Box>
  );
}
