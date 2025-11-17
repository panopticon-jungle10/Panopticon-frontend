// 검색, 시간, 페이지 사이즈

'use client';

import SearchInput from '@/components/ui/SearchInput';
import PageSizeSelect from '@/components/features/services/PageSizeSelect';
import type { ServiceListFiltersProps } from '@/types/servicelist';

export default function ServiceListFilters({
  searchValue,
  onSearchChange,
  pageSize,
  onPageSizeChange,
  onEditClick,
  onCreateClick,
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
      {/* 오른쪽 필터 & 버튼*/}
      <div className="flex items-center gap-2 flex-wrap">
        <PageSizeSelect
          value={pageSize}
          onChange={(value) => {
            onPageSizeChange(value);
          }}
        />
        <button
          type="button"
          onClick={onEditClick}
          className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          수정
        </button>
        <button
          type="button"
          onClick={onCreateClick}
          className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition shadow-sm"
        >
          생성
        </button>
      </div>
    </div>
  );
}
