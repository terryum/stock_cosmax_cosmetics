'use client';

import { useMemo } from 'react';
import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { DailyPrice, Ticker } from '@/types';
import dayjs from 'dayjs';

interface StockLineChartProps {
  data: DailyPrice[];
  comparisonData?: { ticker: Ticker; data: DailyPrice[] }[];
  ticker: Ticker;
  isLoading?: boolean;
  isRebaseMode?: boolean;
}

export function StockLineChart({
  data,
  comparisonData = [],
  ticker,
  isLoading = false,
  isRebaseMode = false,
}: StockLineChartProps) {
  const theme = useTheme();

  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    if (isRebaseMode && data.length > 0) {
      const basePrice = data[0].close;
      return data.map((d) => ({
        date: d.date,
        value: ((d.close - basePrice) / basePrice) * 100,
      }));
    }

    return data.map((d) => ({
      date: d.date,
      value: d.close,
    }));
  }, [data, isRebaseMode]);

  const trend = useMemo(() => {
    if (chartData.length < 2) return 'unchanged';
    const first = chartData[0].value;
    const last = chartData[chartData.length - 1].value;
    if (last > first) return 'up';
    if (last < first) return 'down';
    return 'unchanged';
  }, [chartData]);

  const chartColor = useMemo(() => {
    const stockPalette = theme.palette.stock as { up: string; down: string; unchanged: string } | undefined;
    switch (trend) {
      case 'up':
        return stockPalette?.up || '#00C805';
      case 'down':
        return stockPalette?.down || '#FF5000';
      default:
        return stockPalette?.unchanged || '#a3a3a3';
    }
  }, [trend, theme.palette.stock]);

  const formatXAxis = (dateStr: string) => {
    return dayjs(dateStr).format('MM/DD');
  };

  const formatYAxis = (value: number) => {
    if (isRebaseMode) {
      return value.toFixed(0) + '%';
    }
    if (value >= 10000) {
      return (value / 10000).toFixed(0) + '\uB9CC';
    }
    return value.toLocaleString();
  };

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
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          {dayjs(label).format('YYYY-MM-DD')}
        </Typography>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: chartColor, mt: 0.5 }}
        >
          {isRebaseMode
            ? payload[0].value.toFixed(2) + '%'
            : '\u20A9' + payload[0].value.toLocaleString()}
        </Typography>
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ height: 250, p: 2 }}>
        <Skeleton variant="rectangular" height={220} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
      </Box>
    );
  }

  if (chartData.length === 0) {
    return (
      <Box
        sx={{
          height: 250,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="text.secondary">{'\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
            tickLine={false}
            axisLine={false}
            width={45}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />

          {isRebaseMode && (
            <ReferenceLine
              y={0}
              stroke={theme.palette.text.disabled}
              strokeDasharray="3 3"
            />
          )}

          <Area
            type="monotone"
            dataKey="value"
            stroke={chartColor}
            strokeWidth={2}
            fill="url(#chartGradient)"
            dot={false}
            activeDot={{ r: 5, fill: chartColor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
