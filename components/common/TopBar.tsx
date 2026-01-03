'use client';

import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useTickerStore } from '@/stores';

export function TopBar() {
  const { mainTicker } = useTickerStore();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.default',
        maxWidth: 480,
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto',
      }}
    >
      <Toolbar sx={{ minHeight: 56 }}>
        {/* Back Button */}
        <IconButton
          edge="start"
          sx={{ color: 'text.primary', mr: 1 }}
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Ticker Name */}
        <Typography
          variant="h6"
          component="h1"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '1.1rem',
          }}
        >
          {mainTicker.name}
        </Typography>

        {/* Notification Button */}
        <IconButton
          sx={{ color: 'text.primary' }}
          aria-label="notifications"
        >
          <NotificationsNoneIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
