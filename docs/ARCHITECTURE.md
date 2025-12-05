# Panopticon Frontend Architecture

## 1. 시스템 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                        Panopticon Frontend                      │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐    │
│  │   Next.js     │  │   Zustand     │  │  TanStack Query   │    │
│  │  App Router   │  │    Store      │  │  (Server State)   │    │
│  └───────┬───────┘  └───────┬───────┘  └─────────┬─────────┘    │
│          │                  │                    │              │
│          └──────────────────┼────────────────────┘              │
│                             │                                   │
│  ┌──────────────────────────▼──────────────────────────────┐    │
│  │                    API Layer                            │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │    │
│  │  │  REST API   │  │  WebSocket  │  │   Auth (JWT)    │  │    │
│  │  │   Client    │  │   Client    │  │     Handler     │  │    │
│  │  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │    │
│  └─────────┼────────────────┼──────────────────┼───────────┘    │
└────────────┼────────────────┼──────────────────┼────────────────┘
             │                │                  │
             ▼                ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   APM API    │  │  WebSocket   │  │    Auth Service      │   │
│  │   Server     │  │   Server     │  │                      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 디렉토리 구조

```
panopticon_frontend/
├── app/                          # Next.js App Router
│   ├── (authenticated)/          # 인증 필요 라우트 그룹
│   │   ├── layout.tsx            # 인증 레이아웃 (Sidebar, Header)
│   │   ├── page.tsx              # 대시보드 메인
│   │   └── services/
│   │       ├── page.tsx          # 서비스 목록
│   │       ├── install/          # 에이전트 설치 가이드
│   │       ├── notification/     # 알림 설정
│   │       └── [serviceName]/    # 서비스 상세 (동적 라우트)
│   ├── auth/                     # 인증 페이지
│   ├── layout.tsx                # 루트 레이아웃
│   ├── error.tsx                 # 에러 바운더리
│   └── not-found.tsx             # 404 페이지
│
├── components/
│   ├── analysis/                 # 트레이스 분석 컴포넌트
│   │   ├── view/                 # 분석 뷰 (Waterfall, FlameGraph, Map)
│   │   ├── TraceAnalysis.tsx
│   │   └── TraceAnalysisPullUpPanel.tsx
│   │
│   ├── features/                 # 기능별 컴포넌트
│   │   ├── dashboard/            # 대시보드
│   │   │   └── widgets/          # 드래그 가능 위젯
│   │   ├── install/              # 설치 가이드
│   │   ├── notification/         # 알림 설정
│   │   │   ├── modals/           # 설정 모달
│   │   │   └── slo/              # SLO 카드
│   │   └── services/             # 서비스 관련
│   │       ├── servicelist/      # 서비스 목록
│   │       └── [serviceName]/    # 서비스 상세
│   │
│   └── ui/                       # 공통 UI 컴포넌트
│       ├── Button.tsx
│       ├── Table.tsx
│       ├── Dropdown.tsx
│       ├── Breadcrumb.tsx
│       ├── StateHandler.tsx      # 로딩/에러/빈 상태 처리
│       ├── SlideOverLayout.tsx   # 슬라이드 오버 패널
│       └── PullUpPanelLayout.tsx # 풀업 패널
│
├── src/
│   ├── api/                      # API 클라이언트
│   │   ├── apm.ts                # APM 데이터 API
│   │   ├── auth.ts               # 인증 API
│   │   ├── slo.ts                # SLO API
│   │   └── webhook.ts            # 웹훅 API
│   │
│   ├── hooks/                    # 커스텀 훅
│   │   ├── useAuth.ts            # 인증 상태 관리
│   │   ├── useErrorLogsWebSocket.ts  # 에러 로그 WebSocket
│   │   └── useSloMetricsMonitoring.ts # SLO 메트릭 모니터링
│   │
│   ├── store/                    # Zustand 스토어
│   │   └── timeRangeStore.ts     # 시간 범위 상태
│   │
│   ├── providers/                # React Context Providers
│   ├── constants/                # 상수 정의
│   ├── types/                    # TypeScript 타입
│   └── utils/                    # 유틸리티 함수
│
├── types/                        # 전역 타입 정의
├── lib/                          # 라이브러리 설정
├── public/                       # 정적 파일
└── docs/                         # 문서
```

---

## 3. 핵심 설계 패턴

### 3.1 라우팅 구조 (App Router)

Next.js 16의 App Router를 활용하여 파일 기반 라우팅을 구현합니다.

```
app/
├── (authenticated)/          # Route Group - URL에 영향 없음
│   ├── layout.tsx            # 인증된 페이지 공통 레이아웃
│   ├── page.tsx              # /
│   └── services/
│       ├── page.tsx          # /services
│       ├── install/
│       │   └── page.tsx      # /services/install
│       └── [serviceName]/
│           └── page.tsx      # /services/{serviceName}
└── auth/
    └── page.tsx              # /auth
```

**Route Group `(authenticated)`의 역할:**

- 인증이 필요한 페이지들을 그룹화
- 공통 레이아웃 (사이드바, 헤더) 적용
- 인증 미들웨어 적용

### 3.2 상태 관리 전략

```
┌─────────────────────────────────────────────────────────────┐
│                        State Management                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │    Zustand Store    │    │      TanStack Query         │ │
│  │   (Client State)    │    │     (Server State)          │ │
│  ├─────────────────────┤    ├─────────────────────────────┤ │
│  │ • Time Range        │    │ • Services List             │ │
│  │ • UI State          │    │ • Metrics Data              │ │
│  │ • User Preferences  │    │ • Traces                    │ │
│  │ • Panel Open/Close  │    │ • SLO Configurations        │ │
│  └─────────────────────┘    │ • Webhooks                  │ │
│                              │                            │ │
│                              │ Features:                  │ │
│                              │ • Auto Caching             │ │
│                              │ • Background Refetch       │ │
│                              │ • Stale-While-Revalidate   │ │
│                              └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Zustand**: UI 상태, 사용자 설정 등 클라이언트 전용 상태
**TanStack Query**: API 데이터, 캐싱, 자동 갱신이 필요한 서버 상태

### 3.3 컴포넌트 계층 구조

```
┌─────────────────────────────────────────────────────────────┐
│                      Component Hierarchy                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Pages (app/)                                               │
│  └── Feature Components (components/features/)              │
│      └── UI Components (components/ui/)                     │
│          └── Base Elements (HTML + Tailwind)                │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Page: services/[serviceName]/page.tsx                  │ │
│  │  │                                                     │ │
│  │  ├── OverviewCharts (Feature)                          │ │
│  │  │    ├── StateHandler (UI)                            │ │
│  │  │    └── ReactECharts (Library)                       │ │
│  │  │                                                     │ │
│  │  ├── EndpointTable (Feature)                           │ │
│  │  │    └── Table (UI)                                   │ │
│  │  │                                                     │ │
│  │  └── TraceAnalysisPullUpPanel (Feature)                │ │
│  │       ├── PullUpPanelLayout (UI)                       │ │
│  │       └── TraceAnalysis (Feature)                      │ │
│  │            ├── WaterfallView (Feature)                 │ │
│  │            ├── FlameGraphView (Feature)                │ │
│  │            └── MapView (Feature)                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 데이터 흐름

### 4.1 메트릭 데이터 흐름

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User    │────▶│  TimeRange   │────▶│  API Call    │────▶│   Backend    │
│  Action  │     │  Store       │     │  (Query)     │     │   Server     │
└──────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                  │
┌──────────┐     ┌──────────────┐     ┌──────────────┐            │
│  Chart   │◀────│  Chart       │◀────│  Query       │◀───────────┘
│  Render  │     │  Options     │     │  Cache       │
└──────────┘     └──────────────┘     └──────────────┘
```

### 4.2 실시간 로그 데이터 흐름

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Backend    │────▶│  WebSocket   │────▶│   Custom     │
│   Server     │     │   Client     │     │   Hook       │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
┌──────────────┐     ┌──────────────┐            │
│   Log List   │◀────│   Component  │◀───────────┘
│   Render     │     │   State      │
└──────────────┘     └──────────────┘
```

---

## 5. API 계층 설계

### 5.1 API 클라이언트 구조

```typescript
// src/api/apm.ts
export const apmApi = {
  // 서비스 목록
  getServices: async () => fetch('/api/services'),

  // 서비스 메트릭
  getServiceMetrics: async (name: string, timeRange: string) =>
    fetch(`/api/services/${name}/metrics?range=${timeRange}`),

  // 엔드포인트 목록
  getEndpoints: async (name: string) => fetch(`/api/services/${name}/endpoints`),

  // 트레이스 상세
  getTrace: async (traceId: string) => fetch(`/api/traces/${traceId}`),
};
```

### 5.2 TanStack Query 패턴

```typescript
// 서비스 메트릭 쿼리
const useServiceMetrics = (serviceName: string) => {
  const { timeRange } = useTimeRangeStore();

  return useQuery({
    queryKey: ['metrics', serviceName, timeRange],
    queryFn: () => apmApi.getServiceMetrics(serviceName, timeRange),
    refetchInterval: 10000, // 10초마다 자동 갱신
    staleTime: 5000, // 5초간 캐시 유효
  });
};
```

---

## 6. UI 컴포넌트 설계

### 6.1 StateHandler 패턴

모든 데이터 의존 컴포넌트에서 일관된 로딩/에러/빈 상태 처리:

```typescript
<StateHandler
  isLoading={isLoading}
  isError={isError}
  isEmpty={isEmpty}
  type="chart"
  height={300}
  loadingMessage="메트릭을 불러오는 중..."
  emptyMessage="데이터가 없습니다"
>
  <ActualContent />
</StateHandler>
```

### 6.2 패널 레이아웃 시스템

```
┌─────────────────────────────────────────────────────────────┐
│                      Panel Types                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SlideOverLayout          PullUpPanelLayout                 │
│  ┌─────────────────┐     ┌─────────────────────────────────┐│
│  │ Main    │ Side  │     │         Main Content            ││
│  │ Content │ Panel │     ├─────────────────────────────────┤│
│  │         │       │     │       Pull-Up Panel             ││
│  │         │◀─────▶│     │           ▲                     ││
│  │         │       │     │           │                     ││
│  └─────────────────┘     └─────────────────────────────────┘│
│                                                             │
│  Usage:                  Usage:                             │
│  • Detail views          • Trace analysis                   │
│  • Configuration         • Extended information             │
│  • Side information      • Action panels                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. 인증 흐름

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  User    │────▶│  Auth Page   │────▶│  Backend     │
│  Login   │     │  (OAuth)     │     │  Auth        │
└──────────┘     └──────────────┘     └──────┬───────┘
                                             │
                                             ▼
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Access  │◀────│  JWT Token   │◀────│  Token       │
│  Granted │     │  Storage     │     │  Response    │
└──────────┘     └──────────────┘     └──────────────┘
                       │
                       ▼
               ┌──────────────┐
               │  useAuth     │
               │  Hook        │
               │  (Validate)  │
               └──────────────┘
```

---

## 8. 성능 최적화 전략

### 8.1 코드 스플리팅

- `next/dynamic`을 사용한 차트 라이브러리 동적 로딩
- 라우트 기반 자동 코드 스플리팅 (App Router)

### 8.2 데이터 캐싱

- TanStack Query의 `staleTime`과 `cacheTime` 활용
- 시간 범위 변경 시에만 새 데이터 요청

### 8.3 렌더링 최적화

- `useMemo`로 차트 옵션 메모이제이션
- `React.memo`로 불필요한 리렌더링 방지

---

## 9. 테스트 전략

| 레벨        | 대상              | 도구                        |
| ----------- | ----------------- | --------------------------- |
| Unit        | 유틸리티 함수, 훅 | Jest, React Testing Library |
| Integration | 컴포넌트 통합     | React Testing Library       |
| E2E         | 사용자 시나리오   | Playwright                  |

---

## 10. 배포 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐ │
│  │    Docker    │────▶│   Next.js    │────▶│   Backend    │ │
│  │   Compose    │     │   Server     │     │   Services   │ │
│  └──────────────┘     └──────────────┘     └──────────────┘ │
│                                                             │
│  Build Process:                                             │
│  1. npm run build (Next.js 프로덕션 빌드)                      │
│  2. Docker image 생성                                        │
│  3. Container 실행                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
