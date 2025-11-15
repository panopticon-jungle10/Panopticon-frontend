// 대시보드 리스트 UI

'use client';

import { Dashboard } from '../../../../src/types/dashboard';
import { DashboardTag } from './DashboardTag';
import { HiHeart, HiOutlineStar, HiStar } from 'react-icons/hi2';

export function DashboardListItem({
  dashboard,
  onSelect,
  onToggleFavorite,
}: {
  dashboard: Dashboard;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}) {
  const fill = Math.min((dashboard.popularity / 15) * 100, 100);

  return (
    <tr
      className="group cursor-pointer hover:bg-gray-50 transition"
      onClick={() => onSelect(dashboard.id)}
    >
      {/* ⭐ 즐겨찾기 토글 버튼 */}
      <td className="px-6 py-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(dashboard.id);
          }}
        >
          {dashboard.isFavorite ? (
            <HiStar className="text-yellow-500 w-5 h-5" />
          ) : (
            <HiOutlineStar className="text-gray-300 w-5 h-5" />
          )}
        </button>
      </td>

      {/* 대시보드 이름 + 설명 영역 */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            {dashboard.name[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{dashboard.name}</p>
            <p className="text-xs text-gray-500">{dashboard.description}</p>
          </div>
        </div>
      </td>

      {/* 작성자 정보 (프로필 아이콘 + 이름) */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center">
            {dashboard.author.name[0].toUpperCase()}
          </div>
          <span className="text-sm text-gray-700">{dashboard.author.name}</span>
        </div>
      </td>

      {/* 팀 태그 리스트 */}
      <td className="px-6 py-4">
        <div className="flex gap-1 flex-wrap">
          {dashboard.teams.slice(0, 2).map((t) => (
            <DashboardTag key={t} name={t} />
          ))}
          {dashboard.teams.length > 2 && (
            <span className="text-xs text-gray-500">+{dashboard.teams.length - 2}</span>
          )}
        </div>
      </td>

      {/* ❤️ 인기(popularity)  */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="relative w-5 h-5">
            <HiHeart className="absolute text-gray-200 w-5 h-5" />
            {/* popularity 비율만큼 빨간 하트가 채워짐 */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(${100 - fill}% 0 0 0)` }}
            >
              <HiHeart className="text-red-500 w-5 h-5 absolute" />
            </div>
          </div>
          <span className="text-sm text-gray-600">{dashboard.popularity}</span>
        </div>
      </td>
    </tr>
  );
}
