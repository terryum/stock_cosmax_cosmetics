# Cosmax Market Insight - 현재 상태

> 최종 업데이트: 2026-01-03

## 프로젝트 개요

코스맥스 및 화장품 관련 종목의 시장 데이터를 모니터링하는 대시보드 애플리케이션.
Robinhood 스타일의 모바일 퍼스트 UI로 디자인됨.

### 기술 스택
- **Framework**: Next.js 14 (App Router)
- **UI**: Material UI (MUI) + 다크 테마
- **차트**: Recharts (AreaChart, SparklineChart)
- **상태관리**: Zustand
- **데이터 페칭**: TanStack Query (React Query)
- **DB**: Supabase
- **API**: 한국투자증권 Open API, 네이버 뉴스 API

---

## 완료된 작업

### Phase 1: 기본 기능 구현 ✅
- [x] Next.js 14 프로젝트 구조 설정
- [x] 한투 API 연동 (현재가, 일별 시세)
- [x] 네이버 뉴스 API 연동
- [x] Supabase 연동 (tickers, market_data, news_articles 테이블)
- [x] 12개 종목 모니터링 (코스맥스 그룹 3, 경쟁사 3, 라이징 3, 지수 3)

### Phase 2: Robinhood 스타일 UI ✅
- [x] 모바일 퍼스트 레이아웃 (maxWidth: 480px, PC에서도 동일)
- [x] 다크 테마 적용 (배경: #000000, 상승: #00C805, 하락: #FF5000)
- [x] MainPriceDisplay 컴포넌트 (대형 가격 표시)
- [x] AreaChart 스타일 메인 차트
- [x] TimeRangeSelector (텍스트 버튼 스타일)
- [x] Watchlist + SparklineChart (미니 차트)
- [x] TopBar/BottomNav 다크 모드

### Phase 3: API 최적화 및 데이터 연결 ✅
- [x] **한투 API 토큰 1일 1회 발급** (Supabase 저장, 매일 새벽 4시 KST 갱신)
- [x] **Watchlist 가격 데이터 연결** (useMultipleStockPrices, useMultipleStockHistory)
- [x] **뉴스 섹션 구현** (NewsItem, NewsList 컴포넌트)

---

## 주요 파일 구조

```
cosmax-market-insight/
├── app/
│   ├── (main)/
│   │   ├── layout.tsx          # 모바일 레이아웃 (480px)
│   │   ├── market/page.tsx     # 메인 시장 페이지
│   │   ├── analysis/page.tsx   # 분석 페이지
│   │   └── settings/page.tsx   # 설정 페이지
│   └── api/
│       ├── stocks/
│       │   ├── price/route.ts      # 현재가 API
│       │   └── historical/route.ts # 일별 시세 API
│       └── news/[category]/route.ts # 뉴스 API
├── components/
│   ├── charts/
│   │   ├── StockChartContainer.tsx # 메인 차트 컨테이너
│   │   ├── StockLineChart.tsx      # AreaChart (Recharts)
│   │   ├── SparklineChart.tsx      # 미니 스파크라인
│   │   └── TimeRangeSelector.tsx   # 기간 선택
│   ├── stocks/
│   │   ├── MainPriceDisplay.tsx    # 대형 가격 표시
│   │   ├── Watchlist.tsx           # 종목 리스트
│   │   └── WatchlistItem.tsx       # 종목 아이템
│   ├── news/
│   │   ├── NewsItem.tsx            # 뉴스 아이템
│   │   └── NewsList.tsx            # 뉴스 리스트
│   └── common/
│       ├── TopBar.tsx              # 상단바
│       └── BottomNav.tsx           # 하단 네비게이션
├── services/
│   ├── kis/
│   │   ├── auth.ts         # 토큰 관리 (1일 1회, Supabase 저장)
│   │   ├── client.ts       # API 클라이언트
│   │   └── types.ts        # 타입 정의
│   ├── naver/
│   │   └── client.ts       # 네이버 뉴스 API
│   └── supabase/
│       ├── client.ts       # Supabase 클라이언트
│       └── repositories/
│           ├── tokenRepository.ts    # API 토큰 저장소
│           ├── tickerRepository.ts   # 종목 저장소
│           └── marketDataRepository.ts
├── hooks/
│   ├── useStockPrice.ts    # 주가 조회 훅
│   └── useNews.ts          # 뉴스 조회 훅
├── stores/
│   ├── useTickerStore.ts   # 선택 종목 상태
│   └── useTimeRangeStore.ts # 기간 선택 상태
├── theme/
│   └── index.ts            # MUI 다크 테마
└── supabase/migrations/
    ├── 001_create_tickers.sql
    ├── 002_create_market_data.sql
    └── 003_create_api_tokens.sql   # 토큰 저장 테이블
```

---

## 환경 변수 (.env.local)

```env
# 한국투자증권 API
KIS_APP_KEY=your_app_key
KIS_APP_SECRET=your_app_secret
KIS_BASE_URL=https://openapi.koreainvestment.com:9443

# 네이버 API
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Supabase 테이블

### api_tokens (토큰 저장)
```sql
CREATE TABLE api_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider VARCHAR(50) NOT NULL UNIQUE,  -- 'kis'
  access_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

> **중요**: `003_create_api_tokens.sql` 마이그레이션을 Supabase에서 실행해야 함

---

## 모니터링 종목 (12개)

| 카테고리 | 종목코드 | 종목명 | 시장 |
|---------|---------|--------|------|
| COSMAX | 192820 | 코스맥스 | KOSDAQ |
| COSMAX | 044820 | 코스맥스비티아이 | KOSDAQ |
| COSMAX | 222040 | 코스맥스엔비티 | KOSDAQ |
| COMPETITOR | 161890 | 한국콜마 | KOSPI |
| COMPETITOR | 241710 | 코스메카코리아 | KOSDAQ |
| COMPETITOR | 090430 | 아모레퍼시픽 | KOSPI |
| RISING | 278470 | 에이피알 | KOSDAQ |
| RISING | 526970 | 달바글로벌 | KOSDAQ |
| RISING | 018290 | 브이티 | KOSDAQ |
| INDEX | 0001 | 코스피 | INDEX |
| INDEX | 1001 | 코스닥 | INDEX |
| INDEX | 228790 | TIGER 화장품 | ETF |

---

## 다음에 할 일 (TODO)

### 우선순위 높음
- [ ] Supabase `api_tokens` 테이블 마이그레이션 실행
- [ ] 실제 환경에서 토큰 캐싱 동작 테스트
- [ ] 뉴스 "더보기" 버튼 기능 연결 (별도 뉴스 페이지)

### 우선순위 중간
- [ ] 분석(Analysis) 페이지 구현
- [ ] 종목별 상세 페이지 추가
- [ ] 차트 터치/드래그 인터랙션 개선
- [ ] 푸시 알림 기능 (가격 알림)

### 우선순위 낮음
- [ ] PWA 지원 (오프라인 캐싱)
- [ ] 사용자 설정 저장 (로컬 스토리지 → Supabase)
- [ ] 다크/라이트 테마 토글
- [ ] 종목 즐겨찾기 기능

---

## 알려진 이슈

1. **한투 API 토큰 제한**: 1일 1회 발급만 가능. 토큰 발급 실패 시 Supabase에 저장된 기존 토큰 사용.
2. **지수 API 차이**: 코스피/코스닥 지수는 별도 API 엔드포인트 사용 (`isIndex: true`).
3. **주말/공휴일**: 시장 휴장 시 최근 거래일 데이터 표시.

---

## 실행 방법

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 프로덕션 서버
npm start
```

기본 포트: 3000 (또는 3002 사용 중일 때)

---

## 참고 링크

- [한국투자증권 Open API](https://apiportal.koreainvestment.com/)
- [네이버 개발자 센터](https://developers.naver.com/)
- [Supabase 대시보드](https://supabase.com/dashboard)
