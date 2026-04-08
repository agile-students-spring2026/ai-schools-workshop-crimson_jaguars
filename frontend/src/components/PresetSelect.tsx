import type { PresetOption } from "../lib/presets";
import type { PresetKey } from "../lib/types";

type Props = {
  value: PresetKey;
  options: PresetOption[];
  onChange: (preset: PresetKey) => void;
};

export default function PresetSelect({ value, options, onChange }: Props) {
  return (
    <div>
      <label
        htmlFor="preset"
        className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
      >
        Choose a priority preset
      </label>
      <select
        id="preset"
        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-900/60 text-white text-base focus:outline-none focus:border-teal-400 transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value as PresetKey)}
      >
        {options.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
}
