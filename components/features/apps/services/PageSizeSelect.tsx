interface PageSizeSelectProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
}

export default function PageSizeSelect({
  value,
  onChange,
  options = [10, 30, 50, 100],
}: PageSizeSelectProps) {
  return (
    <div className="flex items-center gap-2 ml-2">
      <select
        id="pageSize"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white shadow-sm transition-colors duration-150 outline-none appearance-none"
        style={{ minHeight: '40px' }}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}개
          </option>
        ))}
      </select>
    </div>
  );
}
