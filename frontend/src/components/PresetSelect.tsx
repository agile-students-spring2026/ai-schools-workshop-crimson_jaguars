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
      <label htmlFor="preset" className="field-label">
        Choose a priority preset
      </label>
      <select
        id="preset"
        className="input"
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