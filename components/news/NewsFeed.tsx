'use client';

import { Box, Typography, Tabs, Tab, Divider } from '@mui/material';
import { useState, SyntheticEvent } from 'react';
import { NewsSection } from './NewsSection';
import { NEWS_SECTIONS } from '@/lib/constants';
import { NewsCategory } from '@/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`news-tabpanel-${index}`}
      aria-labelledby={`news-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export function NewsFeed() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box>
      {/* 헤더 */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        뉴스
      </Typography>

      {/* 탭 네비게이션 */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            minHeight: 44,
            fontSize: '0.875rem',
            fontWeight: 500,
          },
        }}
      >
        {NEWS_SECTIONS.map((section, index) => (
          <Tab
            key={section.category}
            label={section.title}
            id={`news-tab-${index}`}
            aria-controls={`news-tabpanel-${index}`}
          />
        ))}
      </Tabs>

      {/* 탭 패널 */}
      {NEWS_SECTIONS.map((section, index) => (
        <TabPanel key={section.category} value={tabIndex} index={index}>
          <NewsSection category={section.category as NewsCategory} />
        </TabPanel>
      ))}
    </Box>
  );
}

/**
 * 모든 섹션을 한 번에 표시하는 뉴스 피드
 */
export function NewsFeedAll() {
  return (
    <Box>
      {/* 헤더 */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        뉴스
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* 모든 섹션 표시 */}
      {NEWS_SECTIONS.map((section) => (
        <NewsSection
          key={section.category}
          category={section.category as NewsCategory}
        />
      ))}
    </Box>
  );
}
