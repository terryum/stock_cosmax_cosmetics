'use client';

import { useMemo } from 'react';
import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { DailyPrice, Ticker } from '@/types';
import dayjs from 'dayjs';

interface StockLineChartProps {
  data: DailyPrice[];
  comparisonData?: { ticker: Ticker; data: DailyPrice[] }[];
  ticker: Ticker;
  isLoading?: boolean;
  isRebaseMode?: boolean; // 수익률 비교 모드
}

// 차트 색상 팔레트
const CHART_COLORS = [
  '#1565c0', // Primary
  '#00897b', // Secondary
  '#f57c00', // Orange
  '#7b1fa2', // Purple
  '#c62828', // Red
];

export function StockLineChart({
  data,
  comparisonData = [],
  ticker,
  isLoading = false,
  isRebaseMode = false,
}: StockLineChartProps) {
  const theme = useTheme();

  // 차트 데이터 변환
  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    // Rebase 모드: 시작일 대비 수익률로 변환
    if (isRebaseMode && data.length > 0) {
      const basePrice = data[0].close;
      const mainData = data.map((d) => ({
        date: d.date,
        [ticker.code]: ((d.close - basePrice) / basePrice) * 100,
      }));

      // 비교 종목 데이터 병합
      if (comparisonData.length > 0) {
        return mainData.map((point) => {
          const result: Record<string, number | string> = { ...point };
          comparisonData.forEach(({ ticker: t, data: tData }) => {
            const matchingPoint = tData.find((d) => d.date === point.date);
            if (matchingPoint && tData.length > 0) {
              const tBasePrice = tData[0].close;
              result[t.code] =
                ((matchingPoint.close - tBasePrice) / tBasePrice) * 100;
            }
          });
          return result;
        });
      }

      return mainData;
    }

    // 일반 모드: 종가 그대로 사용
    return data.map((d) => ({
      date: d.date,
      [ticker.code]: d.close,
    }));
  }, [data, comparisonData, ticker.code, isRebaseMode]);

  // X축 날짜 포맷팅
  const formatXAxis = (dateStr: string) => {
    return dayjs(dateStr).format('MM/DD');
  };

  // Y축 값 포맷팅
  const formatYAxis = (value: number) => {
    if (isRebaseMode) {
      return `${value.toFixed(0)}%`;
    }
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만`;
    }
    return value.toLocaleString();
  };

  // 툴팁 포맷팅
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          p: 1.5,
          boxShadow: 2,
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          {dayjs(label).format('YYYY-MM-DD')}
        </Typography>
        {payload.map((entry: any, index: number) => {
          const tickerInfo =
            [ticker, ...comparisonData.map((c) => c.ticker)].find(
              (t) => t.code === entry.dataKey
            ) || ticker;

          return (
            <Box key={index} sx={{ mt: 0.5 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ color: entry.color }}
              >
                {tickerInfo.name}:{' '}
                {isRebaseMode
                  ? `${entry.value.toFixed(2)}%`
                  : `${entry.value.toLocaleString()}원`}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ height: 300, p: 2 }}>
        <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={250} />
      </Box>
    );
  }

  if (chartData.length === 0) {
    return (
      <Box
        sx={{
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="text.secondary">데이터가 없습니다</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
            tickLine={false}
            axisLine={{ stroke: theme.palette.divider }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Rebase 모드에서 0% 기준선 표시 */}
          {isRebaseMode && (
            <ReferenceLine
              y={0}
              stroke={theme.palette.text.disabled}
              strokeDasharray="3 3"
            />
          )}

          {/* 메인 종목 라인 */}
          <Line
            type="monotone"
            dataKey={ticker.code}
            stroke={CHART_COLORS[0]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />

          {/* 비교 종목 라인들 */}
          {comparisonData.map(({ ticker: t }, index) => (
            <Line
              key={t.code}
              type="monotone"
              dataKey={t.code}
              stroke={CHART_COLORS[(index + 1) % CHART_COLORS.length]}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
