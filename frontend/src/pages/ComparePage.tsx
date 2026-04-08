import type { ScoredDistrict } from "../lib/types";

type ComparePageProps = {
  districts: [ScoredDistrict, ScoredDistrict];
  onBack: () => void;
};

export function ComparePage({ districts, onBack }: ComparePageProps) {
  const [district1, district2] = districts;

  const metrics = [
    {
      label: "Graduation Rate",
      value1: `${district1.graduationRate.toFixed(1)}%`,
      value2: `${district2.graduationRate.toFixed(1)}%`,
    },
    {
      label: "Per Pupil Spending",
      value1: `$${district1.perPupilSpending.toLocaleString()}`,
      value2: `$${district2.perPupilSpending.toLocaleString()}`,
    },
    {
      label: "Student-Teacher Ratio",
      value1: `1:${district1.studentTeacherRatio.toFixed(1)}`,
      value2: `1:${district2.studentTeacherRatio.toFixed(1)}`,
    },
    {
      label: "Enrollment",
      value1: district1.enrollment.toLocaleString(),
      value2: district2.enrollment.toLocaleString(),
    },
    {
      label: "Poverty Index",
      value1: `${district1.povertyIndex.toFixed(1)}%`,
      value2: `${district2.povertyIndex.toFixed(1)}%`,
    },
  ];

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
          <h1 className="text-3xl font-serif text-white">
            Comparing {district1.name} & {district2.name}
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">{district1.name}</h2>
            <div className="space-y-2">
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Overall Score
                </span>
                <span className="text-3xl font-bold text-teal-400">
                  {district1.score.toFixed(1)}
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                  State
                </span>
                <span>{district1.state}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">{district2.name}</h2>
            <div className="space-y-2">
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Overall Score
                </span>
                <span className="text-3xl font-bold text-teal-400">
                  {district2.score.toFixed(1)}
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                  State
                </span>
                <span>{district2.state}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="space-y-4 p-6">
            {metrics.map((metric, idx) => (
              <div key={idx} className="pb-4 border-b border-gray-800 last:pb-0 last:border-0">
                <div className="text-sm font-medium text-gray-300 mb-2">
                  {metric.label}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-xs text-gray-500 mb-1">{district1.name}</div>
                    <div className="text-lg font-semibold text-teal-300">
                      {metric.value1}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-xs text-gray-500 mb-1">{district2.name}</div>
                    <div className="text-lg font-semibold text-teal-300">
                      {metric.value2}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
