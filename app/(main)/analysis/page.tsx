'use client';

import { Box, Container, Typography } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';

export default function AnalysisPage() {
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
        <InsightsIcon
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
          분석 기능 준비 중
        </Typography>
        <Typography variant="body1" color="text.disabled" sx={{ maxWidth: 400 }}>
          AI 기반 시장 분석 및 리포트 기능이 곧 추가될 예정입니다.
        </Typography>
      </Box>
    </Container>
  );
}
