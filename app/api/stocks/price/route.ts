import { NextRequest, NextResponse } from 'next/server';
import { kisClient, ProcessedStockPrice } from '@/services/kis';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const isIndex = searchParams.get('isIndex') === 'true';

  if (!code) {
    return NextResponse.json(
      { error: '종목 코드(code)가 필요합니다.' },
      { status: 400 }
    );
  }

  // API 키 확인
  if (!process.env.KIS_APP_KEY || !process.env.KIS_APP_SECRET) {
    // 개발 환경에서는 더미 데이터 반환
    const dummyData: ProcessedStockPrice = {
      code,
      name: code,
      currentPrice: 100000 + Math.floor(Math.random() * 10000),
      changePrice: Math.floor(Math.random() * 2000) - 1000,
      changeRate: Math.random() * 4 - 2,
      changeSign: Math.random() > 0.5 ? 'up' : 'down',
      volume: Math.floor(Math.random() * 1000000),
      tradeAmount: Math.floor(Math.random() * 100000000000),
      open: 99000 + Math.floor(Math.random() * 5000),
      high: 102000 + Math.floor(Math.random() * 5000),
      low: 97000 + Math.floor(Math.random() * 5000),
      prevClose: 100000,
      marketCap: Math.floor(Math.random() * 10000000000000),
      per: 10 + Math.random() * 20,
      pbr: 1 + Math.random() * 3,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: dummyData,
      isDummy: true,
    });
  }

  try {
    const price = await kisClient.getPrice(code, isIndex);

    return NextResponse.json({
      success: true,
      data: price,
    });
  } catch (error) {
    console.error('[API] 주가 조회 오류:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '주가 조회 실패',
      },
      { status: 500 }
    );
  }
}
