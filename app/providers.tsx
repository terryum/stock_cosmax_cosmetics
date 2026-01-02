'use client';

import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import theme from '@/theme';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // QueryClient를 useState로 관리하여 SSR에서 클라이언트 간 공유 방지
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 1분간 fresh 상태 유지
            staleTime: 60 * 1000,
            // 5분간 캐시 유지
            gcTime: 5 * 60 * 1000,
            // 윈도우 포커스 시 자동 refetch 비활성화
            refetchOnWindowFocus: false,
            // 에러 시 재시도 횟수
            retry: 1,
            // 재시도 지연시간
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // 뮤테이션 에러 시 재시도 안함
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
