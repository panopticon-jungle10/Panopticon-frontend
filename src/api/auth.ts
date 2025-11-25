/**
 * 인증 관련 API 호출 함수들
 * panopticon_authserver와 통신하여 토큰 갱신을 관리합니다.
 * 쿠키 기반 인증(httpOnly auth-token, refreshToken 쿠키)을 사용합니다.
 */

// ==================== 타입 정의 ====================

export interface AuthTokenResponse {
  token: string;
  user: {
    id: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

// ==================== API Base URL ====================

const getAuthServerUrl = (): string => {
  return process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || 'http://localhost:8080';
};

// ==================== 토큰 갱신 상태 관리 ====================

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * 토큰 갱신 상태를 재설정합니다.
 */
export function resetRefreshState() {
  isRefreshing = false;
  refreshPromise = null;
}

/**
 * 토큰을 갱신하고 새로운 access token을 반환합니다.
 */
async function performTokenRefresh(): Promise<string | null> {
  try {
    const response = await fetch(`${getAuthServerUrl()}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data = (await response.json()) as AuthTokenResponse;
      return data.token;
    }

    // Refresh 실패: 로그인 페이지로 리다이렉트
    console.warn('Token refresh failed. Redirecting to login...');
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    return null;
  }
}

/**
 * 토큰을 갱신합니다. 동시 요청이 있으면 대기합니다.
 */
export async function refreshToken(): Promise<void> {
  if (isRefreshing) {
    // 이미 갱신 중이면 대기
    if (refreshPromise) {
      await refreshPromise;
    }
    return;
  }

  isRefreshing = true;
  refreshPromise = performTokenRefresh().then(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  await refreshPromise;
}

// ==================== Fetch 헬퍼 (retry 로직 포함) ====================

export async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {},
  retryOnUnauthorized = true,
): Promise<T> {
  const baseUrl = getAuthServerUrl();
  const fullUrl = `${baseUrl}${url}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Could not parse error response as JSON
    }

    // 401 Unauthorized: 토큰 갱신 시도
    if (response.status === 401 && retryOnUnauthorized) {
      console.warn('Access token expired. Attempting to refresh...');
      await refreshToken();

      // 갱신 후 재시도 (무한 루프 방지)
      return fetchWithAuth<T>(url, options, false);
    }

    throw new Error(errorMessage);
  }

  // 응답 본문이 없으면 undefined 반환
  const contentLength = response.headers.get('content-length');
  if (contentLength === '0' || !contentLength) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ==================== API 함수들 ====================

/**
 * POST /auth/logout
 * 로그아웃 (refresh token 무효화)
 */
export const logoutUser = async (): Promise<void> => {
  await fetchWithAuth<void>('/auth/logout', {
    method: 'POST',
  });
};
