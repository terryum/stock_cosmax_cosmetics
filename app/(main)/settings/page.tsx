'use client';

import { Box, Container, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

export default function SettingsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <SettingsIcon
          sx={{
            fontSize: 80,
            color: 'text.disabled',
            mb: 3,
          }}
        />
        <Typography
          variant="h5"
          color="text.secondary"
          fontWeight={600}
          gutterBottom
        >
          설정 기능 준비 중
        </Typography>
        <Typography variant="body1" color="text.disabled" sx={{ maxWidth: 400 }}>
          종목 관리, 알림 설정 등의 기능이 곧 추가될 예정입니다.
        </Typography>
      </Box>
    </Container>
  );
}
