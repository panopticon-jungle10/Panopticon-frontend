export type ServiceType = 'ui' | 'api';

export interface CreateServiceFormValues {
  serviceType: ServiceType;
  serviceName: string;
  framework: string;
  environment: string;
  collectLogs: boolean;
  collectTraces: boolean;
}

export type ServiceModalMode = 'create' | 'edit';

export interface CreateServiceModalProps {
  open: boolean;
  mode?: ServiceModalMode;
  onClose: () => void;
  initialValues?: Partial<CreateServiceFormValues>;
  onSubmit?: (values: CreateServiceFormValues) => void;
}

export const SERVICE_TYPE_OPTIONS = [
  { label: 'UI', value: 'ui' },
  { label: 'API', value: 'api' },
] as const;

export const SERVICE_FRAMEWORK_OPTIONS: Record<
  ServiceType,
  { label: string; value: string }[]
> = {
  ui: [
    { label: 'Next.js', value: 'nextjs' },
    { label: 'React', value: 'react' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
  ],
  api: [
    { label: 'NestJS', value: 'nestjs' },
    { label: 'Express', value: 'express' },
    { label: 'FastAPI', value: 'fastapi' },
    { label: 'Spring Boot', value: 'springboot' },
  ],
};

export const SERVICE_ENVIRONMENT_OPTIONS = [
  { label: 'Docker', value: 'docker' },
  { label: 'Kubernetes', value: 'kubernetes' },
  { label: 'Serverless', value: 'serverless' },
  { label: 'VM (EC2 등)', value: 'vm' },
] as const;

export const getDefaultServiceFormValues = (
  overrides?: Partial<CreateServiceFormValues>,
): CreateServiceFormValues => {
  const defaultServiceType: ServiceType = overrides?.serviceType ?? SERVICE_TYPE_OPTIONS[0].value;
  const baseValues: CreateServiceFormValues = {
    serviceType: defaultServiceType,
    serviceName: '',
    framework: SERVICE_FRAMEWORK_OPTIONS[defaultServiceType][0]?.value ?? '',
    environment: SERVICE_ENVIRONMENT_OPTIONS[0].value,
    collectLogs: defaultServiceType === 'api',
    collectTraces: true,
  };

  const mergedValues: CreateServiceFormValues = { ...baseValues, ...overrides };

  if (!mergedValues.framework) {
    mergedValues.framework =
      SERVICE_FRAMEWORK_OPTIONS[mergedValues.serviceType][0]?.value ?? mergedValues.framework;
  }

  if (mergedValues.serviceType === 'ui') {
    mergedValues.collectLogs = false;
  }

  return mergedValues;
};
