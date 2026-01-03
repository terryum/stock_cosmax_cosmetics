'use client';

import { useMemo } from 'react';
import { Box, useTheme } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DailyPrice } from '@/types';

interface SparklineChartProps {
  data: DailyPrice[];
  width?: number;
  height?: number;
}

export function SparklineChart({
  data,
  width = 60,
  height = 30,
}: SparklineChartProps) {
  const theme = useTheme();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((d) => ({ value: d.close }));
  }, [data]);

  const trend = useMemo(() => {
    if (chartData.length < 2) return 'unchanged';
    const first = chartData[0].value;
    const last = chartData[chartData.length - 1].value;
    if (last > first) return 'up';
    if (last < first) return 'down';
    return 'unchanged';
  }, [chartData]);

  const color = useMemo(() => {
    switch (trend) {
      case 'up':
        return theme.palette.stock?.up || '#00C805';
      case 'down':
        return theme.palette.stock?.down || '#FF5000';
      default:
        return theme.palette.stock?.unchanged || '#a3a3a3';
    }
  }, [trend, theme.palette.stock]);

  if (chartData.length === 0) {
    return <Box sx={{ width, height }} />;
  }

  return (
    <Box sx={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={'gradient-' + trend} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={'url(#gradient-' + trend + ')'}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
