import { NextRequest, NextResponse } from 'next/server';
import { naverApiClient } from '@/services/naver';
import {
  NEWS_SECTIONS,
  getNewsSectionByCategory,
  DEFAULT_NEWS_COUNT,
  NEWS_PAGE_SIZE,
} from '@/lib/constants';
import { NewsCategory } from '@/types';

// 유효한 카테고리 목록
const VALID_CATEGORIES = NEWS_SECTIONS.map((s) => s.category);

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category as NewsCategory;

    // 카테고리 유효성 검사
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          error: `유효하지 않은 카테고리입니다. 가능한 값: ${VALID_CATEGORIES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // 쿼리 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(
      searchParams.get('limit') || String(DEFAULT_NEWS_COUNT),
      10
    );

    // 섹션 정보 가져오기
    const section = getNewsSectionByCategory(category);
    if (!section) {
      return NextResponse.json(
        { success: false, error: '섹션 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 키워드 OR 쿼리 생성
    const query = section.keywords.slice(0, 3).join(' OR '); // 최대 3개 키워드

    // 네이버 API 호출
    const start = (page - 1) * limit + 1;
    const result = await naverApiClient.searchAndProcessNews({
      query,
      display: limit,
      start,
      sort: 'date',
    });

    // 중복 제거 (제목 기준)
    const seenTitles = new Set<string>();
    const uniqueItems = result.items.filter((item) => {
      // 제목의 처음 30자로 중복 체크
      const titleKey = item.title.slice(0, 30).toLowerCase();
      if (seenTitles.has(titleKey)) {
        return false;
      }
      seenTitles.add(titleKey);
      return true;
    });

    return NextResponse.json({
      success: true,
      data: {
        category,
        title: section.title,
        items: uniqueItems,
        pagination: {
          page,
          limit,
          total: result.total,
          hasMore: start + result.display < result.total,
        },
      },
    });
  } catch (error) {
    console.error('뉴스 API 에러:', error);

    // API 키 미설정 시
    if (
      error instanceof Error &&
      error.message.includes('NAVER_CLIENT')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: '네이버 API 키가 설정되지 않았습니다.',
          message: '.env.local 파일에 NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET을 설정해주세요.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '뉴스를 불러오는데 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
