import { NextRequest, NextResponse } from 'next/server';
import { kisClient, ProcessedDailyPrice } from '@/services/kis';

// 날짜를 YYYYMMDD 형식으로 변환
function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 더미 히스토리 데이터 생성
function generateDummyHistory(
  startDate: Date,
  endDate: Date,
  periodCode: 'D' | 'W' | 'M'
): ProcessedDailyPrice[] {
  const data: ProcessedDailyPrice[] = [];
  const currentDate = new Date(startDate);
  let basePrice = 100000 + Math.floor(Math.random() * 20000);

  // 기간에 따른 간격 설정
  const interval = periodCode === 'D' ? 1 : periodCode === 'W' ? 7 : 30;

  while (currentDate <= endDate) {
    // 주말 제외 (일별 데이터인 경우)
    const dayOfWeek = currentDate.getDay();
    if (periodCode !== 'D' || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
      // 랜덤 변동 (-3% ~ +3%)
      const change = (Math.random() - 0.5) * 0.06;
      basePrice = Math.max(50000, basePrice * (1 + change));

      const open = basePrice * (1 + (Math.random() - 0.5) * 0.02);
      const high = Math.max(basePrice, open) * (1 + Math.random() * 0.02);
      const low = Math.min(basePrice, open) * (1 - Math.random() * 0.02);

      data.push({
        date: currentDate.toISOString().split('T')[0],
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(basePrice),
        volume: Math.floor(Math.random() * 500000) + 100000,
        changeRate: change * 100,
      });
    }

    currentDate.setDate(currentDate.getDate() + interval);
  }

  return data.reverse(); // 최신순 정렬
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const period = (searchParams.get('period') || 'D') as 'D' | 'W' | 'M';
  const isIndex = searchParams.get('isIndex') === 'true';

  if (!code) {
    return NextResponse.json(
      { error: '종목 코드(code)가 필요합니다.' },
      { status: 400 }
    );
  }

  // 기본 날짜 설정 (오늘부터 3개월 전)
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);

  // API 키 확인
  if (!process.env.KIS_APP_KEY || !process.env.KIS_APP_SECRET) {
    // 개발 환경에서는 더미 데이터 반환
    const dummyData = generateDummyHistory(start, end, period);

    return NextResponse.json({
      success: true,
      data: dummyData,
      isDummy: true,
    });
  }

  try {
    const startDateStr = formatDateToYYYYMMDD(start);
    const endDateStr = formatDateToYYYYMMDD(end);

    const history = await kisClient.getDailyPrices(
      code,
      startDateStr,
      endDateStr,
      period,
      isIndex
    );

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('[API] 기간별 시세 조회 오류:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '기간별 시세 조회 실패',
      },
      { status: 500 }
    );
  }
}
