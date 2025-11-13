import { notFound } from 'next/navigation';
import { getServiceErrors } from '@/src/api/apm';
import ServiceDetailClient from '@/components/features/apm/services/[serviceId]/ServiceDetailClient';

interface ServicePageProps {
  params: { serviceId: string };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceId } = params;

  try {
    const initialErrors = await getServiceErrors(serviceId, { limit: 1 });

    if (!initialErrors.errors.length) {
      notFound();
    }

    return <ServiceDetailClient serviceId={serviceId} initialErrors={initialErrors} />;
  } catch (error: unknown) {
    if (isHttpError(error) && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

type HttpError = Error & { status?: number };

function isHttpError(error: unknown): error is HttpError {
  return typeof error === 'object' && error !== null && 'status' in error;
}
