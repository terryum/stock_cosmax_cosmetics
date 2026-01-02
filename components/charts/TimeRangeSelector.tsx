'use client';

import { Box, Chip } from '@mui/material';
import { useTimeRangeStore } from '@/stores';
import { TIME_RANGES } from '@/lib/constants';
import { TimeRangeValue } from '@/types';

export function TimeRangeSelector() {
  const { selected, setTimeRange } = useTimeRangeStore();

  const handleSelect = (value: TimeRangeValue) => {
    if (value === 'custom') {
      // TODO: 날짜 선택 모달 열기
      // 현재는 기본 동작만 구현
      return;
    }
    setTimeRange(value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.75,
        flexWrap: 'wrap',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      {TIME_RANGES.map((range) => (
        <Chip
          key={range.value}
          label={range.label}
          size="small"
          variant={selected === range.value ? 'filled' : 'outlined'}
          color={selected === range.value ? 'primary' : 'default'}
          onClick={() => handleSelect(range.value)}
          sx={{
            fontWeight: selected === range.value ? 600 : 400,
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: selected === range.value ? 'primary.main' : 'action.hover',
            },
          }}
        />
      ))}
    </Box>
  );
}
