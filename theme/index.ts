'use client';

import { createTheme } from '@mui/material/styles';

// 코스맥스 브랜드 컬러 기반 팔레트
const palette = {
  primary: {
    main: '#1565c0', // 진한 파랑 (네이비 블루)
    light: '#5e92f3',
    dark: '#003c8f',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#00897b', // 틸 (화장품 산업 연상 컬러)
    light: '#4ebaaa',
    dark: '#005b4f',
    contrastText: '#ffffff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
  },
  background: {
    default: '#fafafa',
    paper: '#ffffff',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
  },
  // 주식 등락 컬러 (한국 시장 기준: 상승 빨강, 하락 파랑)
  stock: {
    up: '#d32f2f', // 상승 (빨강)
    down: '#1565c0', // 하락 (파랑)
    unchanged: '#757575', // 보합 (회색)
  },
};

// MUI 테마 생성
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: palette.primary,
    secondary: palette.secondary,
    error: palette.error,
    warning: palette.warning,
    info: palette.info,
    success: palette.success,
    background: palette.background,
    text: palette.text,
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#c1c1c1 #f1f1f1',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 4,
            backgroundColor: '#c1c1c1',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a1a1a1',
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // 버튼 대문자 변환 비활성화
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 64,
          borderTop: '1px solid #e0e0e0',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 60,
          padding: '8px 12px',
          '&.Mui-selected': {
            paddingTop: 8,
          },
        },
        label: {
          fontSize: '0.75rem',
          '&.Mui-selected': {
            fontSize: '0.75rem',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// 커스텀 팔레트 타입 확장
declare module '@mui/material/styles' {
  interface Palette {
    stock: {
      up: string;
      down: string;
      unchanged: string;
    };
  }
  interface PaletteOptions {
    stock?: {
      up: string;
      down: string;
      unchanged: string;
    };
  }
}

// stock 팔레트 추가
const themeWithStock = createTheme(theme, {
  palette: {
    stock: palette.stock,
  },
});

export default themeWithStock;
