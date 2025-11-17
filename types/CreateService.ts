export interface CreateServiceFormValues {
  serviceName: string;
  language: string;
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

export const SERVICE_LANGUAGE_OPTIONS = [
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Go', value: 'go' },
  { label: '.NET', value: 'dotnet' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'PHP', value: 'php' },
] as const;

export const SERVICE_ENVIRONMENT_OPTIONS = [
  { label: 'Production', value: 'production' },
  { label: 'Staging', value: 'staging' },
  { label: 'Development', value: 'development' },
  { label: 'QA', value: 'qa' },
] as const;

export const getDefaultServiceFormValues = (
  overrides?: Partial<CreateServiceFormValues>,
): CreateServiceFormValues => ({
  serviceName: '',
  language: SERVICE_LANGUAGE_OPTIONS[0].value,
  environment: SERVICE_ENVIRONMENT_OPTIONS[0].value,
  collectLogs: true,
  collectTraces: true,
  ...overrides,
});
