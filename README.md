# Panopticon Frontend

> 모든 서비스의 로그를 한눈에 관찰하다

Panopticon은 분산 시스템의 트레이싱, 메트릭, 로그를 통합 관리하는 **APM(Application Performance Monitoring) 대시보드**입니다.

![Panopticon Landing](./docs/imgs/사진_랜딩.png)

---

## Demo

| 서비스 개요 데모 |
|:----------------:|
| ![Overview Demo](./docs/gifs/영상_개요.gif) |

---

## Screenshots

### 인증

| 로그인 |
|:------:|
| ![Login](./docs/imgs/사진_로그인.png) |

---

### 서비스 목록

서비스 목록을 카드형과 리스트형 두 가지 뷰로 확인할 수 있습니다.

| 카드 뷰 | 리스트 뷰 |
|:-------:|:---------:|
| ![Service List Card](./docs/imgs/사진_서비스목록_카드.png) | ![Service List](./docs/imgs/사진_서비스목록_리스트.png) |

| 서비스 목록 데모 |
|:----------------:|
| ![Service List Demo](./docs/gifs/영상_서비스목록.gif) |

---

### 서비스 개요 (Overview)

서비스의 전체적인 상태를 한눈에 파악할 수 있습니다.

| 개요 화면 | 메트릭 그래프 |
|:---------:|:-------------:|
| ![Overview](./docs/imgs/사진_개요.png) | ![Overview Graph](./docs/imgs/사진_개요_그래프.png) |

| 에러 로그 그룹 | 에러 로그 상세 |
|:--------------:|:--------------:|
| ![Log Group](./docs/imgs/사진_개요_로그그룹.png) | ![Log Group Detail](./docs/imgs/사진_개요_로그그룹_상세.png) |

| 개요 데모 | 개요 패널 데모 |
|:---------:|:--------------:|
| ![Overview Demo](./docs/gifs/영상_개요.gif) | ![Overview Panel Demo](./docs/gifs/영상_개요_패널.gif) |

---

### 리소스 모니터링

| 리소스 그래프 | 리소스 리스트 |
|:-------------:|:-------------:|
| ![Resource Graph](./docs/imgs/사진_리소스_그래프.png) | ![Resource List](./docs/imgs/사진_리소스_리스트.png) |

| 리소스 모니터링 데모 |
|:--------------------:|
| ![Resource Demo](./docs/gifs/영상_리소스.gif) |

---

### 트레이스 분석

분산 시스템의 요청 흐름을 추적하고 분석합니다.

| 트레이스 리스트 | 트레이스 그래프 |
|:---------------:|:---------------:|
| ![Trace List](./docs/imgs/사진_트레이스_리스트.png) | ![Trace Graph](./docs/imgs/사진_트레이스_그래프.png) |

| 트레이스 분석 데모 |
|:------------------:|
| ![Trace Demo](./docs/gifs/영상_트레이스.gif) |

---

### 로그

서비스의 로그를 실시간으로 확인하고 검색합니다.

| 로그 데모 |
|:---------:|
| ![Log Demo](./docs/gifs/영상_로그.gif) |

---

### SLO 알림 설정

서비스 수준 목표(SLO)를 설정하고 알림을 관리합니다.

| SLO 관리 화면 | SLO 생성 모달 |
|:-------------:|:-------------:|
| ![SLO Main](./docs/imgs/사진_slo_첫화면.png) | ![SLO Create Modal](./docs/imgs/사진_slo_slo생성모달.png) |

| 웹훅 설정 |
|:---------:|
| ![Webhook Config](./docs/imgs/사진_slo_웹훅설정.png) |

| SLO 설정 데모 |
|:-------------:|
| ![SLO Demo](./docs/gifs/영상_SLO.gif) |

---

### SDK 설치 가이드

단계별로 SDK 설치를 안내합니다.

| 1. 설치 시작 | 2. 토큰 발급 |
|:------------:|:------------:|
| ![SDK Install](./docs/imgs/사진_sdk설치.png) | ![SDK Token](./docs/imgs/사진_sdk설치_토큰발급.png) |

| 3. 환경 설정 | 4. 수집 종류 설정 |
|:------------:|:-----------------:|
| ![SDK Env Config](./docs/imgs/사진_sdk설치_환경설정.png) | ![SDK Collection Config](./docs/imgs/사진_sdk설치_수집종류설정.png) |

| 5. 코드 가이드 | 6. 설치 검증 |
|:--------------:|:------------:|
| ![SDK Code Guide](./docs/imgs/사진_sdk설치_코드가이드.png) | ![SDK Verify](./docs/imgs/사진_sdk설치_검증.png) |

| SDK 설치 데모 |
|:-------------:|
| ![SDK Install Demo](./docs/gifs/영상_sdk설치.gif) |

---

## Key Features

| 기능 | 설명 |
|------|------|
| **실시간 메트릭 모니터링** | 요청 수, 에러율, 레이턴시를 실시간으로 시각화 |
| **분산 트레이싱** | Waterfall, Flame Graph, Map View로 트레이스 분석 |
| **SLO 기반 알림** | 서비스 수준 목표 설정 및 위반 시 알림 발송 |
| **다중 알림 채널** | Slack, Discord, Teams, Email 지원 |
| **드래그 앤 드롭 대시보드** | 위젯 커스터마이징 가능 |
| **에이전트 설치 가이드** | 단계별 설치 안내 제공 |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **State Management** | Zustand, TanStack Query |
| **Styling** | Tailwind CSS 4 |
| **Charts** | ECharts |
| **Animation** | Framer Motion |
| **Real-time** | Socket.io |

---

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### Docker로 실행하기

```bash
docker-compose up -d
```

자세한 Docker 설정은 [Docker Guide](./docs/DOCKER_GUIDE.md)를 참조하세요.

---

## Documentation

프로젝트에 대한 자세한 문서는 아래를 참조하세요:

- [PRD (Product Requirements Document)](./docs/PRD.md) - 제품 요구사항 명세
- [Architecture](./docs/ARCHITECTURE.md) - 기술 아키텍처 문서
- [Features](./docs/FEATURES.md) - 기능 상세 설명
- [Organization Rules](./ORGANIZATION_RULES.md) - 브랜치/커밋 컨벤션

---

## Project Structure

```
panopticon_frontend/
├── app/                    # Next.js App Router 페이지
│   ├── (authenticated)/    # 인증된 사용자 라우트
│   │   ├── services/       # 서비스 관련 페이지
│   │   └── page.tsx        # 대시보드 메인
│   └── auth/               # 인증 페이지
├── components/
│   ├── analysis/           # 트레이스 분석 컴포넌트
│   ├── features/           # 기능별 컴포넌트
│   │   ├── dashboard/      # 대시보드 위젯
│   │   ├── install/        # 설치 가이드
│   │   ├── notification/   # 알림 설정
│   │   └── services/       # 서비스 관련
│   └── ui/                 # 공통 UI 컴포넌트
├── src/
│   ├── api/                # API 클라이언트
│   ├── hooks/              # 커스텀 훅
│   ├── store/              # Zustand 스토어
│   └── utils/              # 유틸리티 함수
└── docs/                   # 문서
```

---

## License

This project is licensed under the MIT License.
