import type { Audience } from "../lib/types";

type Props = {
  value: Audience;
  onChange: (audience: Audience) => void;
};

export default function AudienceToggle({ value, onChange }: Props) {
  const baseBtn =
    "flex-1 px-4 py-3 rounded-lg text-sm font-semibold border transition-colors";
  const inactive =
    "border-gray-700 bg-gray-900/60 text-gray-300 hover:border-gray-600 hover:text-white";
  const activeCls =
    "active border-teal-400 bg-teal-500/20 text-teal-200";

  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
        Who are you evaluating for?
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={`${baseBtn} ${value === "parent" ? activeCls : inactive}`}
          onClick={() => onChange("parent")}
        >
          Parent
        </button>
        <button
          type="button"
          className={`${baseBtn} ${value === "educator" ? activeCls : inactive}`}
          onClick={() => onChange("educator")}
        >
          Educator
        </button>
      </div>
    </div>
  );
}
