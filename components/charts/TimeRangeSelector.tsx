'use client';

import { Box, ButtonBase, Typography } from '@mui/material';
import { useTimeRangeStore } from '@/stores';
import { TIME_RANGES } from '@/lib/constants';
import { TimeRangeValue } from '@/types';

export function TimeRangeSelector() {
  const { selected, setTimeRange } = useTimeRangeStore();

  const handleSelect = (value: TimeRangeValue) => {
    if (value === 'custom') {
      return;
    }
    setTimeRange(value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 0,
        py: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      {TIME_RANGES.filter(r => r.value !== 'custom').map((range) => {
        const isSelected = selected === range.value;
        return (
          <ButtonBase
            key={range.value}
            onClick={() => handleSelect(range.value)}
            sx={{
              px: 2,
              py: 1,
              position: 'relative',
              '&::after': isSelected ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: 2,
                bgcolor: 'primary.main',
                borderRadius: 1,
              } : {},
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? 'primary.main' : 'text.secondary',
                transition: 'color 0.2s',
              }}
            >
              {range.label}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
