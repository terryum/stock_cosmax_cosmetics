'use client';

import { Box, Card, CardActionArea, Typography, Skeleton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Ticker, TickerPrice } from '@/types';
import { useLongPress } from '@/hooks/useLongPress';

interface TickerCardProps {
  ticker: Ticker;
  isMain: boolean; // 메인 종목 여부
  isSelected: boolean; // 다중 선택 여부
  isMultiSelectMode: boolean;
  priceData?: TickerPrice;
  isLoading?: boolean;
  onTap: () => void;
  onLongPress: () => void;
}

export function TickerCard({
  ticker,
  isMain,
  isSelected,
  isMultiSelectMode,
  priceData,
  isLoading = false,
  onTap,
  onLongPress,
}: TickerCardProps) {
  const longPressHandlers = useLongPress({
    onLongPress,
    onClick: onTap,
    threshold: 500,
  });

  // 등락률에 따른 색상 결정
  const getPriceColor = (changeRate: number) => {
    if (changeRate > 0) return 'error.main'; // 상승 - 빨강
    if (changeRate < 0) return 'primary.main'; // 하락 - 파랑
    return 'text.secondary'; // 보합 - 회색
  };

  // 등락률 포맷팅
  const formatChangeRate = (rate: number) => {
    const prefix = rate > 0 ? '+' : '';
    return `${prefix}${rate.toFixed(2)}%`;
  };

  // 가격 포맷팅 (천 단위 구분)
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        border: 2,
        borderColor: isMain
          ? 'primary.main'
          : isSelected
          ? 'secondary.main'
          : 'transparent',
        bgcolor: isMain
          ? 'primary.50'
          : isSelected
          ? 'secondary.50'
          : 'background.paper',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      }}
      elevation={isMain || isSelected ? 2 : 1}
    >
      <CardActionArea
        {...longPressHandlers}
        sx={{
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          minHeight: 80,
        }}
      >
        {/* 선택 표시 아이콘 */}
        {isMultiSelectMode && isSelected && (
          <CheckCircleIcon
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              fontSize: 18,
              color: 'secondary.main',
            }}
          />
        )}

        {/* 종목명 */}
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            mb: 0.5,
            color: isMain ? 'primary.main' : 'text.primary',
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            lineHeight: 1.3,
          }}
          noWrap
        >
          {ticker.name}
        </Typography>

        {/* 가격 정보 */}
        {isLoading ? (
          <>
            <Skeleton width={60} height={20} />
            <Skeleton width={40} height={16} />
          </>
        ) : priceData ? (
          <>
            <Typography
              variant="body1"
              fontWeight={700}
              sx={{
                color: getPriceColor(priceData.changeRate),
                fontSize: { xs: '0.9rem', sm: '1rem' },
              }}
            >
              {formatPrice(priceData.currentPrice)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: getPriceColor(priceData.changeRate),
                fontWeight: 500,
              }}
            >
              {formatChangeRate(priceData.changeRate)}
            </Typography>
          </>
        ) : (
          <Box sx={{ mt: 0.5 }}>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontSize: '0.7rem' }}
            >
              {ticker.market}
            </Typography>
          </Box>
        )}
      </CardActionArea>
    </Card>
  );
}
