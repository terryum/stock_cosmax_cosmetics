'use client';

import { createTheme } from '@mui/material/styles';

// Robinhood 스타일 다크 테마 팔레트
const palette = {
  primary: {
    main: '#00C805', // Robinhood 녹색
    light: '#33d337',
    dark: '#009603',
    contrastText: '#000000',
  },
  secondary: {
    main: '#5ac53b', // 연한 녹색
    light: '#7bd362',
    dark: '#3e8929',
    contrastText: '#000000',
  },
  error: {
    main: '#FF5000', // Robinhood 빨강 (하락)
    light: '#ff7333',
    dark: '#cc4000',
  },
  warning: {
    main: '#FFB800',
    light: '#ffc633',
    dark: '#cc9300',
  },
  info: {
    main: '#00BFFF',
    light: '#33ccff',
    dark: '#0099cc',
  },
  success: {
    main: '#00C805',
    light: '#33d337',
    dark: '#009603',
  },
  background: {
    default: '#000000', // 완전 검정 배경
    paper: '#1a1a1a',   // 카드 배경
  },
  text: {
    primary: '#ffffff',
    secondary: '#a3a3a3',
  },
  divider: '#2a2a2a',
  // 주식 등락 컬러 (Robinhood 스타일: 상승 녹색, 하락 빨강)
  stock: {
    up: '#00C805',      // 상승 (녹색)
    down: '#FF5000',    // 하락 (빨강)
    unchanged: '#a3a3a3', // 보합 (회색)
  },
};

// MUI 테마 생성
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: palette.primary,
    secondary: palette.secondary,
    error: palette.error,
    warning: palette.warning,
    info: palette.info,
    success: palette.success,
    background: palette.background,
    text: palette.text,
    divider: palette.divider,
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
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
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
          scrollbarColor: '#333 #1a1a1a',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 4,
            backgroundColor: '#333',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#444',
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: '#1a1a1a',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          backgroundColor: palette.background.paper,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
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
          backgroundColor: palette.background.default,
          borderTop: '1px solid #2a2a2a',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 60,
          padding: '8px 12px',
          color: palette.text.secondary,
          '&.Mui-selected': {
            paddingTop: 8,
            color: palette.primary.main,
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
          boxShadow: 'none',
          backgroundColor: palette.background.default,
          borderBottom: '1px solid #2a2a2a',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #2a2a2a',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#2a2a2a',
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
