import type { Audience } from "../lib/types";

type Props = {
  value: Audience;
  onChange: (audience: Audience) => void;
};

export default function AudienceToggle({ value, onChange }: Props) {
  return (
    <div>
      <label className="field-label">Who are you evaluating for?</label>
      <div className="segmented-control">
        <button
          type="button"
          className={value === "parent" ? "segment active" : "segment"}
          onClick={() => onChange("parent")}
        >
          Parent
        </button>
        <button
          type="button"
          className={value === "educator" ? "segment active" : "segment"}
          onClick={() => onChange("educator")}
        >
          Educator
        </button>
      </div>
    </div>
  );
}