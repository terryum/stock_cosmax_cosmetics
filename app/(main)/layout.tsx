'use client';

import { Box } from '@mui/material';
import { TopBar, BottomNav, GlobalSnackbar } from '@/components/common';

interface MainLayoutProps {
  children: React.ReactNode;
}

// TopBar와 BottomNav 높이
const TOP_BAR_HEIGHT = 56;
const BOTTOM_NAV_HEIGHT = 64;
// 모바일 고정 너비 (PC에서도 동일한 모바일 뷰)
const MAX_WIDTH = 480;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
        // PC에서 중앙 정렬 및 모바일 너비 고정
        maxWidth: MAX_WIDTH,
        margin: '0 auto',
        position: 'relative',
        // PC에서 좌우 그림자 효과
        boxShadow: { sm: '0 0 20px rgba(0,0,0,0.15)' },
      }}
    >
      {/* 상단 바 */}
      <TopBar />

      {/* 메인 컨텐츠 영역 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: `${TOP_BAR_HEIGHT}px`,
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
