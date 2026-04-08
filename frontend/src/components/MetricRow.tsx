type MetricRowProps = {
  label: string;
  value: string;
  barPercent: number;
};

export function MetricRow({ label, value, barPercent }: MetricRowProps) {
  const clamped = Math.max(0, Math.min(100, barPercent));
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-36 shrink-0 text-gray-400">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-gray-700/60 overflow-hidden">
        <div
          className="h-full bg-teal-500 rounded-full"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="w-20 shrink-0 text-right tabular-nums text-gray-200">
        {value}
      </span>
    </div>
  );
}
