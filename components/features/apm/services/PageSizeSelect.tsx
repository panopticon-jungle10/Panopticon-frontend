interface PageSizeSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export default function PageSizeSelect({ value, onChange }: PageSizeSelectProps) {
  return (
    <div className="flex items-center gap-2 ml-2">
      <label htmlFor="pageSize" className="text-sm text-gray-600">
        페이지당 표시 개수 :
      </label>
      <select
        id="pageSize"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white shadow-sm transition-colors duration-150 outline-none appearance-none"
        style={{ minHeight: '40px' }}
      >
        <option value={10}>10개</option>
        <option value={50}>50개</option>
        <option value={100}>100개</option>
      </select>
    </div>
  );
}
