import type { ScoredDistrict } from "../lib/types";
import { MetricRow } from "./MetricRow";

type DistrictCardProps = {
  district: ScoredDistrict;
  rank: number;
  isSelected: boolean;
  onToggleCompare: (id: string) => void;
  compareDisabled: boolean;
};

function scoreColor(score: number) {
  if (score >= 80) return "text-teal-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

function formatMoney(n: number) {
  return `$${n.toLocaleString()}`;
}

export function DistrictCard({
  district,
  rank,
  isSelected,
  onToggleCompare,
  compareDisabled,
}: DistrictCardProps) {
  const {
    id,
    name,
    enrollment,
    score,
    graduationRate,
    perPupilSpending,
    studentTeacherRatio,
    povertyIndex,
  } = district;

  // Bar percent normalizations
  const gradPct = graduationRate; // 0-100 already
  const spendPct = Math.min(
    100,
    Math.max(0, ((perPupilSpending - 10000) / (25000 - 10000)) * 100),
  );
  // Lower ratio is better — invert. Range ~10-22.
  const ratioPct = Math.min(
    100,
    Math.max(0, ((22 - studentTeacherRatio) / (22 - 10)) * 100),
  );
  // Lower poverty is better — invert. Range ~0-50.
  const povertyPct = Math.min(
    100,
    Math.max(0, ((50 - povertyIndex) / 50) * 100),
  );

  const borderClass = isSelected
    ? "border-purple-500"
    : "border-gray-700 hover:border-gray-600";

  return (
    <div
      className={`rounded-xl border ${borderClass} bg-gray-800/60 p-5 transition-colors`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="text-2xl font-serif text-gray-500 w-8 shrink-0">
            #{rank}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {name}
            </h3>
            <p className="text-sm text-gray-400">
              {enrollment.toLocaleString()} students
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={`font-serif text-4xl leading-none ${scoreColor(score)}`}>
            {score}
          </div>
          <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">
            score
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <MetricRow
          label="Graduation rate"
          value={`${graduationRate}%`}
          barPercent={gradPct}
        />
        <MetricRow
          label="Per-pupil spending"
          value={formatMoney(perPupilSpending)}
          barPercent={spendPct}
        />
        <MetricRow
          label="Student-teacher ratio"
          value={`${studentTeacherRatio}:1`}
          barPercent={ratioPct}
        />
        <MetricRow
          label="Poverty index"
          value={`${povertyIndex}%`}
          barPercent={povertyPct}
        />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => onToggleCompare(id)}
          disabled={compareDisabled}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            isSelected
              ? "bg-purple-500/20 border-purple-500 text-purple-200"
              : "border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-300"
          } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-600 disabled:hover:text-gray-300`}
        >
          {isSelected ? "Selected" : "Compare"}
        </button>
      </div>
    </div>
  );
}
