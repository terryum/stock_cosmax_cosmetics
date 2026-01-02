'use client';

import { Snackbar, Alert } from '@mui/material';
import { useUIStore } from '@/stores';

export function GlobalSnackbar() {
  const { snackbar, hideSnackbar } = useUIStore();

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    hideSnackbar();
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        // BottomNav 위로 표시
        bottom: { xs: 80, sm: 88 },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}
