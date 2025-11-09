'use client';

import React, { useState } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: `${number}%` | string; // 예: '20%', '50%'
  sortable?: boolean; // 정렬 가능 여부
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  showFavorite?: boolean; // 즐겨찾기 열 표시 여부
  onFavoriteClick?: (row: T, index: number) => void; // 즐겨찾기 클릭 핸들러
  favoriteIcon?: (row: T, index: number) => React.ReactNode; // 즐겨찾기 아이콘 커스텀
}

export default function Table<T>({
  columns,
  data,
  className = 'w-full',
  showFavorite = false,
  onFavoriteClick,
  favoriteIcon,
}: TableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 정렬 함수
  const getComparator = (key: keyof T, direction: 'asc' | 'desc') => {
    return (a: T, b: T) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      // 날짜 비교
      if (aValue instanceof Date && bValue instanceof Date) {
        return direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      // 문자열 비교
      return direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    };
  };

  // 정렬된 데이터 계산
  const sortedData = sortField ? [...data].sort(getComparator(sortField, sortDirection)) : data;

  // 정렬 핸들러
  const handleSort = (column: TableColumn<T>) => {
    if (column.sortable === false) return;

    if (sortField === column.key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(column.key);
      setSortDirection('desc'); // 첫 정렬 시 내림차순(아래 화살표)으로 시작
    }
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full border-collapse table-fixed">
        <thead>
          <tr className="border-b border-gray-200">
            {/* 즐겨찾기 열 */}
            {showFavorite && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50 w-12">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50 select-none ${
                  column.sortable !== false ? 'cursor-pointer' : ''
                }`}
                style={{ width: column.width || 'auto' }}
                onClick={() => handleSort(column)}
              >
                <span className="flex items-center gap-1">
                  {column.header}
                  {column.sortable !== false &&
                    (sortField === column.key ? (
                      sortDirection === 'asc' ? (
                        <FiChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <FiChevronDown className="w-4 h-4 text-gray-400" />
                      )
                    ) : (
                      <FiChevronUp className="w-4 h-4 text-gray-400" />
                    ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (showFavorite ? 1 : 0)}
                className="px-4 py-8 text-center text-sm text-gray-500"
              >
                데이터가 없습니다
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 hover:bg-gray-50 hover:cursor-pointer transition-colors"
              >
                {/* 즐겨찾기 셀 */}
                {showFavorite && (
                  <td
                    className="px-4 py-3 text-sm"
                    onClick={() => onFavoriteClick?.(row, rowIndex)}
                  >
                    {favoriteIcon ? (
                      favoriteIcon(row, rowIndex)
                    ) : (
                      <svg
                        className="w-4 h-4 text-gray-400 hover:text-yellow-500 cursor-pointer"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap truncate"
                    style={{ width: column.width || 'auto' }}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : (row[column.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
