/**
 * Agent 설치 흐름에서 사용되는 타입들
 */

export type AgentRuntime = 'nodejs' | 'python' | 'java' | 'go';

export interface Agent {
  id: AgentRuntime;
  label: string;
  description: string;
  icon?: string;
  frameworks: Framework[];
}

export interface Framework {
  id: string;
  label: string;
  runtime: AgentRuntime;
}

export type InstrumentationMethod = 'auto' | 'manual' | 'container';

export interface AgentSetupFormValues {
  // Step 1: Agent 선택
  agentRuntime: AgentRuntime;
  framework: string;

  // Step 2: Instrumentation Method 선택
  instrumentationMethod: InstrumentationMethod;

  // Step 3: License Key & Service Info
  licenseKey: string;
  serviceName: string;
  serviceEnvironment: string;

  // Step 4: Validation - 자동으로 설정됨
  validationStatus?: 'pending' | 'success' | 'failed';
}

export interface AgentSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (values: AgentSetupFormValues) => void;
}

// Agent 목록
export const AGENTS: Agent[] = [
  {
    id: 'nodejs',
    label: 'Node.js',
    description: 'JavaScript/TypeScript 기반 백엔드 서비스',
    frameworks: [
      { id: 'express', label: 'Express', runtime: 'nodejs' },
      { id: 'nestjs', label: 'NestJS', runtime: 'nodejs' },
      { id: 'nextjs', label: 'Next.js', runtime: 'nodejs' },
      { id: 'fastify', label: 'Fastify', runtime: 'nodejs' },
    ],
  },
  {
    id: 'python',
    label: 'Python',
    description: 'Python 기반 백엔드 서비스',
    frameworks: [
      { id: 'fastapi', label: 'FastAPI', runtime: 'python' },
      { id: 'django', label: 'Django', runtime: 'python' },
      { id: 'flask', label: 'Flask', runtime: 'python' },
    ],
  },
  {
    id: 'java',
    label: 'Java',
    description: 'Java 기반 백엔드 서비스',
    frameworks: [
      { id: 'springboot', label: 'Spring Boot', runtime: 'java' },
      { id: 'quarkus', label: 'Quarkus', runtime: 'java' },
    ],
  },
  {
    id: 'go',
    label: 'Go',
    description: 'Go 기반 백엔드 서비스',
    frameworks: [
      { id: 'gin', label: 'Gin', runtime: 'go' },
      { id: 'echo', label: 'Echo', runtime: 'go' },
    ],
  },
];

export const INSTRUMENTATION_METHODS = [
  {
    id: 'auto' as const,
    label: 'Auto Instrumentation',
    description: '자동으로 라이브러리를 감지하여 계측합니다',
  },
  {
    id: 'manual' as const,
    label: 'Manual Instrumentation',
    description: '수동으로 코드를 작성하여 계측합니다',
  },
  {
    id: 'container' as const,
    label: 'Container-based',
    description: 'Docker/Kubernetes 환경에서 기본 설정으로 계측합니다',
  },
];

export const getDefaultAgentSetupValues = (
  overrides?: Partial<AgentSetupFormValues>,
): AgentSetupFormValues => {
  return {
    agentRuntime: overrides?.agentRuntime ?? 'nodejs',
    framework: overrides?.framework ?? AGENTS[0].frameworks[0].id,
    instrumentationMethod: overrides?.instrumentationMethod ?? 'auto',
    licenseKey: overrides?.licenseKey ?? '',
    serviceName: overrides?.serviceName ?? '',
    serviceEnvironment: overrides?.serviceEnvironment ?? 'development',
    validationStatus: 'pending',
    ...overrides,
  };
};
