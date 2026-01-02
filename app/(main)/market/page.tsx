'use client';

import { Box, Container, Typography, Divider, Paper } from '@mui/material';
import { TickerGridContainer } from '@/components/stocks';
import { TimeRangeSelector, StockChartContainer, ChartLegend } from '@/components/charts';
import { NewsFeed } from '@/components/news';
import { useTickerStore } from '@/stores';

export default function MarketPage() {
  const { mainTicker, selectedTickers, isMultiSelectMode } = useTickerStore();

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          fontWeight={600}
          color="text.primary"
        >
          시장 동향
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          코스맥스 및 화장품 산업 주가/뉴스
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 차트 섹션 */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3,
          mb: 3,
          border: 1,
          borderColor: 'divider',
        }}
      >
        {/* 현재 선택된 종목 표시 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {mainTicker.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {mainTicker.market} · {mainTicker.code}
          </Typography>
        </Box>

        {/* 기간 선택기 */}
        <TimeRangeSelector />

        {/* 주가 차트 */}
        <StockChartContainer />

        {/* 다중 선택 시 레전드 */}
        {isMultiSelectMode && selectedTickers.length > 0 && (
          <ChartLegend
            mainTicker={mainTicker}
            comparisonTickers={selectedTickers}
          />
        )}
      </Paper>

      {/* 종목 그리드 섹션 */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3,
          mb: 3,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <TickerGridContainer />
      </Paper>

      {/* 뉴스 섹션 */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3,
          mb: 3,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <NewsFeed />
      </Paper>
    </Container>
  );
}
