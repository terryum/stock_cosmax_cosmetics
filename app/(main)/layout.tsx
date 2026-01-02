'use client';

import { Box } from '@mui/material';
import { TopBar, BottomNav, GlobalSnackbar } from '@/components/common';

interface MainLayoutProps {
  children: React.ReactNode;
}

// TopBar와 BottomNav 높이
const TOP_BAR_HEIGHT = { xs: 56, sm: 64 };
const BOTTOM_NAV_HEIGHT = 64;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* 상단 바 */}
      <TopBar />

      {/* 메인 컨텐츠 영역 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: `${TOP_BAR_HEIGHT.xs}px`, sm: `${TOP_BAR_HEIGHT.sm}px` },
          pb: `${BOTTOM_NAV_HEIGHT}px`,
          // iOS Safe Area 대응
          paddingBottom: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom))`,
          overflow: 'auto',
        }}
      >
        {children}
      </Box>

      {/* 하단 네비게이션 */}
      <BottomNav />

      {/* 글로벌 스낵바 */}
      <GlobalSnackbar />
    </Box>
  );
}
