'use client';

import { Box, Typography, Chip, Button, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TickerCard } from './TickerCard';
import { useTickerStore } from '@/stores';
import { TICKERS } from '@/lib/constants';
import { TickerPrice } from '@/types';

interface TickerGridProps {
  priceData?: Record<string, TickerPrice>; // 종목코드 -> 가격 정보
  isLoading?: boolean;
}

export function TickerGrid({ priceData, isLoading = false }: TickerGridProps) {
  const {
    mainTicker,
    selectedTickers,
    isMultiSelectMode,
    setMainTicker,
    toggleSelectedTicker,
    clearSelection,
  } = useTickerStore();

  // 종목 탭 핸들러
  const handleTap = (ticker: (typeof TICKERS)[0]) => {
    if (isMultiSelectMode) {
      // 다중 선택 모드에서는 토글
      toggleSelectedTicker(ticker);
    } else {
      // 일반 모드에서는 메인 종목 변경
      setMainTicker(ticker);
    }
  };

  // 롱프레스 핸들러
  const handleLongPress = (ticker: (typeof TICKERS)[0]) => {
    // 롱프레스 시 해당 종목을 선택하며 다중 선택 모드 진입
    if (!isMultiSelectMode) {
      toggleSelectedTicker(ticker);
    }
  };

  return (
    <Box>
      {/* 헤더 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          종목 선택
        </Typography>

        {/* 다중 선택 모드 표시 */}
        {isMultiSelectMode && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${selectedTickers.length}개 선택`}
              size="small"
              color="secondary"
            />
            <Button
              size="small"
              startIcon={<CloseIcon />}
              onClick={clearSelection}
              sx={{ minWidth: 'auto' }}
            >
              취소
            </Button>
          </Box>
        )}
      </Box>

      {/* 안내 메시지 */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 2 }}
      >
        {isMultiSelectMode
          ? '비교할 종목을 선택하세요 (최대 5개)'
          : '탭: 종목 변경 | 길게 누르기: 비교 모드'}
      </Typography>

      {/* 종목 그리드 */}
      <Grid container spacing={1.5}>
        {TICKERS.map((ticker) => (
          <Grid item key={ticker.code} xs={4}>
            <TickerCard
              ticker={ticker}
              isMain={mainTicker.code === ticker.code}
              isSelected={selectedTickers.some((t) => t.code === ticker.code)}
              isMultiSelectMode={isMultiSelectMode}
              priceData={priceData?.[ticker.code]}
              isLoading={isLoading}
              onTap={() => handleTap(ticker)}
              onLongPress={() => handleLongPress(ticker)}
            />
          </Grid>
        ))}
      </Grid>

      {/* 선택된 종목 미리보기 (다중 선택 모드) */}
      {isMultiSelectMode && selectedTickers.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedTickers.map((ticker) => (
            <Chip
              key={ticker.code}
              label={ticker.name}
              size="small"
              variant="outlined"
              color="secondary"
              onDelete={() => toggleSelectedTicker(ticker)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
