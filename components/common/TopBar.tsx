'use client';

import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import { useQueryClient } from '@tanstack/react-query';

interface TopBarProps {
  title?: string;
}

export function TopBar({ title = 'Cosmax Insight' }: TopBarProps) {
  const queryClient = useQueryClient();

  // 모든 쿼리 새로고침
  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        {/* 로고/타이틀 */}
        <Typography
          variant="h6"
          component="h1"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            color: 'primary.main',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}
        >
          {title}
        </Typography>

        {/* 액션 버튼들 */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            color="inherit"
            onClick={handleRefresh}
            aria-label="새로고침"
            sx={{ color: 'text.secondary' }}
          >
            <RefreshIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="설정"
            sx={{ color: 'text.secondary' }}
            disabled // Phase 1에서는 비활성화
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
