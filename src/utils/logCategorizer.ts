/**
 * 로그 메시지를 분석하여 카테고리를 결정합니다.
 * 패턴 매칭을 통해 로그의 특성을 자동으로 분류합니다.
 *
 * ⚠️ 새로운 카테고리를 추가할 때:
 * 1. LogCategory 타입에 새 카테고리 추가
 * 2. categoryPriority에 우선순위 추가
 * 3. categoryDescriptions에 설명 추가
 * 4. patterns 배열에 패턴 규칙 추가 (상단에 있을수록 높은 우선순위)
 */

export type LogCategory =
  | 'EXTERNAL_SERVICE'  // Bedrock, 외부 API 등
  | 'REQUEST_PAYLOAD'   // 요청 데이터 전체
  | 'POST_CREATION'     // 게시물 생성 (wantsToPost, postData)
  | 'CONVERSATION'      // 대화/질문 처리
  | 'AI_RECOMMEND'      // AI 추천 조회
  | 'USER_ACTION'       // 사용자 액션 추적
  | 'GENERAL';          // 일반 로그

export interface LogCategoryInfo {
  category: LogCategory;
  priority: number;
  description: string;
}

/**
 * 카테고리별 우선순위 (숫자가 작을수록 높은 우선순위)
 * 로그 레벨과 별도로, 메시지 카테고리 자체도 우선순위를 가집니다.
 */
const categoryPriority: Record<LogCategory, number> = {
  EXTERNAL_SERVICE: 0,  // 외부 서비스 호출 (Bedrock 등)
  REQUEST_PAYLOAD: 1,   // 요청 데이터
  POST_CREATION: 2,     // 게시물 생성
  CONVERSATION: 3,      // 대화 처리
  AI_RECOMMEND: 4,      // AI 추천
  USER_ACTION: 5,       // 사용자 액션
  GENERAL: 99,          // 일반
};

/**
 * 카테고리별 설명
 */
const categoryDescriptions: Record<LogCategory, string> = {
  EXTERNAL_SERVICE: '외부 서비스',
  REQUEST_PAYLOAD: '요청 데이터',
  POST_CREATION: '게시물 생성',
  CONVERSATION: '대화 처리',
  AI_RECOMMEND: 'AI 추천',
  USER_ACTION: '사용자 액션',
  GENERAL: '일반',
};

/**
 * 패턴 매칭 규칙
 *
 * ⚠️ 규칙 추가 시 주의:
 * - 패턴 순서가 중요합니다 (위에서부터 순서대로 매칭됨)
 * - 더 구체적인 패턴을 먼저 배치하세요
 * - 예: "bedrock" 패턴이 "error" 패턴보다 위에 있어야 "Bedrock failed" 에러가 EXTERNAL_SERVICE로 분류됨
 */
const patterns: Array<{
  regex: RegExp;
  category: LogCategory;
  description?: string; // 패턴 설명 (참고용)
}> = [
  // 외부 서비스 (최상위 우선순위)
  {
    regex: /bedrock|external|third.?party|api.?call.?to/i,
    category: 'EXTERNAL_SERVICE',
    description: 'Bedrock, 외부 API 호출',
  },

  // 요청 데이터
  {
    regex: /full\s+request\s+data|request\s+data:|요청\s+데이터/i,
    category: 'REQUEST_PAYLOAD',
    description: '요청 데이터 로깅',
  },

  // 게시물 생성 (wantsToPost, postData 포함)
  {
    regex: /wantstopost|postdata|post\s+creation|게시물\s+생성|post\s+.*title|post\s+.*password/i,
    category: 'POST_CREATION',
    description: '게시물 생성/업로드 관련',
  },

  // 대화/질문 처리
  {
    regex: /conversation|originalquestion|질문|답변|chat|message|dialogue/i,
    category: 'CONVERSATION',
    description: '대화/질문 처리',
  },

  // AI 추천
  {
    regex: /ai\s+추천|추천\s+결과|추천\s+조회|recommendation|suggest/i,
    category: 'AI_RECOMMEND',
    description: 'AI 추천 기능',
  },

  // 사용자 행동 추적
  {
    regex: /사용자\s+행동|user\s+action|tracking|session|behavior|page_view|action=|user_id/i,
    category: 'USER_ACTION',
    description: '사용자 행동 추적',
  },
];

/**
 * 로그 메시지에서 카테고리를 추출합니다.
 *
 * @param message - 로그 메시지
 * @returns 결정된 카테고리
 */
export function categorizeLog(message: string): LogCategory {
  if (!message) return 'GENERAL';

  // 패턴 순서대로 매칭 시도 (첫 번째 매칭되는 패턴 사용)
  for (const { regex, category } of patterns) {
    if (regex.test(message)) {
      return category;
    }
  }

  return 'GENERAL';
}

/**
 * 카테고리의 우선순위를 반환합니다.
 *
 * @param category - 로그 카테고리
 * @returns 우선순위 (숫자가 작을수록 높음)
 */
export function getCategoryPriority(category: LogCategory): number {
  return categoryPriority[category] ?? 99;
}

/**
 * 카테고리의 설명을 반환합니다.
 *
 * @param category - 로그 카테고리
 * @returns 카테고리 설명
 */
export function getCategoryDescription(category: LogCategory): string {
  return categoryDescriptions[category] || '알 수 없음';
}

/**
 * 카테고리 정보를 반환합니다.
 *
 * @param category - 로그 카테고리
 * @returns 카테고리 정보 (카테고리, 우선순위, 설명)
 */
export function getCategoryInfo(category: LogCategory): LogCategoryInfo {
  return {
    category,
    priority: getCategoryPriority(category),
    description: getCategoryDescription(category),
  };
}

/**
 * 모든 카테고리의 정보를 반환합니다.
 * UI에서 카테고리별 필터링이나 범례 표시 시 사용
 *
 * @returns 카테고리별 정보 배열 (우선순위 순서)
 */
export function getAllCategories(): LogCategoryInfo[] {
  const categories: LogCategory[] = [
    'EXTERNAL_SERVICE',
    'REQUEST_PAYLOAD',
    'POST_CREATION',
    'CONVERSATION',
    'AI_RECOMMEND',
    'USER_ACTION',
    'GENERAL',
  ];

  return categories
    .map(getCategoryInfo)
    .sort((a, b) => a.priority - b.priority);
}
