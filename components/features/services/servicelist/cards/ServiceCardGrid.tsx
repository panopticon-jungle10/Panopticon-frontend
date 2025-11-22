// 레이아웃(카드들 그리드 형태로 나열 + ‘서비스 추가’ 카드를 가장 앞에 배치)

'use client';

import type { ServiceSummary } from '@/types/apm';
import ServiceCard from './ServiceCard';
import AddServiceCard from './AddServiceCard';

interface ServiceCardGridProps {
  services: ServiceSummary[];
  onCardClick?: (service: ServiceSummary) => void;
  onCreateClick?: () => void;
}

export default function ServiceCardGrid({
  services,
  onCardClick,
  onCreateClick,
}: ServiceCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {' '}
      {/* 서비스 추가 카드 (항상 제일 앞에 표시) */}
      <AddServiceCard onClick={onCreateClick} />
      {services.map((service) => (
        <ServiceCard
          key={service.service_name}
          service={service}
          onClick={onCardClick ? () => onCardClick(service) : undefined}
        />
      ))}
    </div>
  );
}
