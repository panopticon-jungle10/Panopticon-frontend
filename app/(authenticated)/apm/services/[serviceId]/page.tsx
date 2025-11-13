import { notFound } from 'next/navigation';
import { getServiceErrors } from '@/src/api/apm';
import ServiceDetailClient from '@/components/features/apm/services/[serviceId]/ServiceDetailClient';
import type { GetServiceErrorsResponse } from '@/types/apm';

interface ServicePageProps {
  params: { serviceId: string };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceId } = params;
  const initialErrors = await fetchInitialErrors(serviceId);

  return <ServiceDetailClient serviceId={serviceId} initialErrors={initialErrors} />;
}

type HttpError = Error & { status?: number };

function isHttpError(error: unknown): error is HttpError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

async function fetchInitialErrors(serviceId: string): Promise<GetServiceErrorsResponse> {
  try {
    const response = await getServiceErrors(serviceId, { limit: 1 });

    if (!response.errors.length) {
      notFound();
    }

    return response;
  } catch (error: unknown) {
    if (isHttpError(error) && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
