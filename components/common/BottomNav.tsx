'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';

// 탭 설정
const TABS = [
  {
    label: '시장',
    icon: <ShowChartIcon />,
    path: '/market',
    disabled: false,
  },
  {
    label: '분석',
    icon: <InsightsIcon />,
    path: '/analysis',
    disabled: true, // Coming Soon
  },
  {
    label: '설정',
    icon: <SettingsIcon />,
    path: '/settings',
    disabled: true, // Coming Soon
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // 현재 경로에 해당하는 탭 인덱스 찾기
  const currentTabIndex = TABS.findIndex((tab) =>
    pathname?.startsWith(tab.path)
  );
  const value = currentTabIndex >= 0 ? currentTabIndex : 0;

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    const tab = TABS[newValue];
    if (!tab.disabled) {
      router.push(tab.path);
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        // iOS Safe Area 대응
        pb: 'env(safe-area-inset-bottom)',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 60,
            py: 1,
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            mt: 0.5,
          },
          '& .Mui-selected': {
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
            },
          },
        }}
      >
        {TABS.map((tab) => (
          <BottomNavigationAction
            key={tab.path}
            label={tab.label}
            icon={tab.icon}
            disabled={tab.disabled}
            sx={{
              opacity: tab.disabled ? 0.5 : 1,
              '&.Mui-selected': {
                color: 'primary.main',
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
