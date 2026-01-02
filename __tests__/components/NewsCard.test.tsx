import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NewsCard } from '@/components/news/NewsCard';
import { ProcessedNewsItem } from '@/services/naver';

const theme = createTheme();

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

const mockArticle: ProcessedNewsItem = {
  title: '코스맥스, 2024년 실적 발표... 영업이익 20% 증가',
  link: 'https://n.news.naver.com/article/123',
  originalLink: 'https://www.mk.co.kr/news/123',
  description: '코스맥스가 2024년 실적을 발표했다.',
  pubDate: 'Mon, 01 Jan 2024 09:00:00 +0900',
  source: '매일경제',
  relativeTime: '3시간 전',
};

describe('NewsCard', () => {
  it('뉴스 카드가 올바르게 렌더링되어야 한다', () => {
    render(
      <TestWrapper>
        <NewsCard article={mockArticle} />
      </TestWrapper>
    );

    // 제목 확인
    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();

    // 언론사 확인
    expect(screen.getByText(mockArticle.source)).toBeInTheDocument();

    // 상대 시간 확인
    expect(screen.getByText(mockArticle.relativeTime)).toBeInTheDocument();
  });

  it('클릭 시 새 탭에서 원문 링크가 열려야 한다', () => {
    // window.open 모킹
    const mockOpen = jest.fn();
    window.open = mockOpen;

    render(
      <TestWrapper>
        <NewsCard article={mockArticle} />
      </TestWrapper>
    );

    // 카드 클릭
    const card = screen.getByText(mockArticle.title).closest('button');
    if (card) {
      fireEvent.click(card);
    }

    expect(mockOpen).toHaveBeenCalledWith(
      mockArticle.originalLink,
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('긴 제목은 말줄임 처리되어야 한다', () => {
    const longTitleArticle = {
      ...mockArticle,
      title:
        '이것은 매우 긴 제목입니다. 코스맥스가 2024년 4분기 실적을 발표했습니다. 영업이익이 전년 대비 20% 증가했으며, 해외 매출도 30% 늘어났습니다.',
    };

    render(
      <TestWrapper>
        <NewsCard article={longTitleArticle} />
      </TestWrapper>
    );

    const titleElement = screen.getByText(longTitleArticle.title);
    // CSS에서 line-clamp가 적용되었는지 확인
    expect(titleElement).toHaveStyle({
      display: '-webkit-box',
    });
  });
});
