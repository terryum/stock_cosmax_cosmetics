'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SettingsIcon from '@mui/icons-material/Settings';

const TABS = [
  {
    label: '\uC2DC\uC7A5',
    icon: <ShowChartIcon />,
    path: '/market',
    disabled: false,
  },
  {
    label: '\uB274\uC2A4',
    icon: <NewspaperIcon />,
    path: '/news',
    disabled: true,
  },
  {
    label: '\uC124\uC815',
    icon: <SettingsIcon />,
    path: '/settings',
    disabled: true,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

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
        maxWidth: 480,
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto',
        width: '100%',
        zIndex: 1100,
        pb: 'env(safe-area-inset-bottom)',
        bgcolor: 'background.default',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
      elevation={0}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          height: 64,
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 60,
            py: 1,
            color: 'text.secondary',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            mt: 0.5,
          },
          '& .Mui-selected': {
            color: 'primary.main',
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
              opacity: tab.disabled ? 0.4 : 1,
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
