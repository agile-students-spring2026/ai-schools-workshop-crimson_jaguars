type Props = {
  value: string;
  states: string[];
  onChange: (state: string) => void;
};

export default function StateSelect({ value, states, onChange }: Props) {
  return (
    <div>
      <label htmlFor="state" className="field-label">
        Select a state
      </label>
      <select
        id="state"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Choose a state</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>
  );
}