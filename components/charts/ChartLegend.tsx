'use client';

import { Box, Chip } from '@mui/material';
import { Ticker } from '@/types';

interface ChartLegendProps {
  mainTicker: Ticker;
  comparisonTickers?: Ticker[];
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#1565c0', // Primary
  '#00897b', // Secondary
  '#f57c00', // Orange
  '#7b1fa2', // Purple
  '#c62828', // Red
];

export function ChartLegend({
  mainTicker,
  comparisonTickers = [],
  colors = DEFAULT_COLORS,
}: ChartLegendProps) {
  const allTickers = [mainTicker, ...comparisonTickers];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 1,
        mt: 2,
      }}
    >
      {allTickers.map((ticker, index) => (
        <Chip
          key={ticker.code}
          label={ticker.name}
          size="small"
          sx={{
            bgcolor: colors[index % colors.length],
            color: 'white',
            fontWeight: 500,
            fontSize: '0.75rem',
          }}
        />
      ))}
    </Box>
  );
}
