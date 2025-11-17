// 검색, 시간, 페이지 사이즈

'use client';

import SearchInput from '@/components/ui/SearchInput';
import { SelectDate } from '@/components/features/apps/services/SelectDate';
import PageSizeSelect from '@/components/features/apps/services/PageSizeSelect';
import type { ServiceListFiltersProps } from '@/types/servicelist';

export default function ServiceListFilters({
  searchValue,
  onSearchChange,
  pageSize,
  onPageSizeChange,
}: ServiceListFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* 검색 */}
      <SearchInput
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="서비스 검색..."
        className="w-full md:w-80 h-10"
      />
      {/* 오른쪽 필터 묶음 */}
      <div className="flex items-center gap-3 flex-wrap">
        <SelectDate />
        <PageSizeSelect
          value={pageSize}
          onChange={(value) => {
            onPageSizeChange(value);
          }}
        />
      </div>
    </div>
  );
}
