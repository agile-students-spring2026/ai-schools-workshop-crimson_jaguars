import { useMemo, useState } from "react";
import type { Audience, PresetKey, ScoredDistrict } from "../lib/types";
import { mockDistricts } from "../data/mockDistricts";
import { DistrictCard } from "../components/DistrictCard";

type ResultsPageProps = {
  state: string;
  audience: Audience;
  preset: PresetKey;
  onBack: () => void;
  onCompare: (districts: [ScoredDistrict, ScoredDistrict]) => void;
};

const PRESET_LABELS: Record<PresetKey, string> = {
  academic: "Academic Excellence",
  balancedFamily: "Balanced Family",
  smallClassrooms: "Small Classrooms",
  classroomConditions: "Classroom Conditions",
  resourceSupport: "Resource & Support",
  balancedTeaching: "Balanced Teaching",
};

const AUDIENCE_LABELS: Record<Audience, string> = {
  parent: "Parent view",
  educator: "Educator view",
};

const STATE_NAMES: Record<string, string> = {
  NY: "New York",
};

export function ResultsPage({
  state,
  audience,
  preset,
  onBack,
  onCompare,
}: ResultsPageProps) {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const districts = useMemo(
    () =>
      mockDistricts
        .filter((d) => d.state === state)
        .sort((a, b) => b.score - a.score),
    [state],
  );

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const handleCompareClick = () => {
    if (compareIds.length !== 2) return;
    const [a, b] = compareIds
      .map((id) => districts.find((d) => d.id === id))
      .filter((d): d is ScoredDistrict => Boolean(d));
    if (a && b) onCompare([a, b]);
  };

  const stateLabel = STATE_NAMES[state] ?? state;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-teal-300 mb-4 inline-flex items-center gap-1"
          >
            <span aria-hidden>←</span> Back
          </button>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif text-white">
                {stateLabel} Districts
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {districts.length} districts ranked
              </p>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-xs uppercase tracking-wider text-gray-500">
                Preset
              </span>
              <span className="text-teal-400 font-medium">
                {PRESET_LABELS[preset]}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {AUDIENCE_LABELS[audience]}
              </span>
            </div>
          </div>
        </div>
      </header>

      {compareIds.length > 0 && (
        <div className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/90 backdrop-blur">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-300">
              <span className="font-semibold text-purple-300">
                {compareIds.length}/2
              </span>{" "}
              selected for comparison
            </span>
            <button
              type="button"
              onClick={handleCompareClick}
              disabled={compareIds.length !== 2}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-teal-500 text-gray-950 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Compare →
            </button>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid gap-4">
          {districts.map((district, idx) => {
            const isSelected = compareIds.includes(district.id);
            const compareDisabled = !isSelected && compareIds.length >= 2;
            return (
              <DistrictCard
                key={district.id}
                district={district}
                rank={idx + 1}
                isSelected={isSelected}
                onToggleCompare={toggleCompare}
                compareDisabled={compareDisabled}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
