// 서비스 목록 화면에서 공통으로 쓰는 필터 묶음(검색/시간/페이지 사이즈 필터)

'use client';

import SearchInput from '@/components/ui/SearchInput';
import { SelectDate } from '@/components/features/apps/services/SelectDate';
import PageSizeSelect from '@/components/features/apps/services/PageSizeSelect';

interface ServiceListFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
}

export default function ServiceListFilters({
  searchValue,
  onSearchChange,
  pageSize,
  onPageSizeChange,
}: ServiceListFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <SearchInput
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="서비스 검색..."
        className="w-full md:w-80 h-10"
      />
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
