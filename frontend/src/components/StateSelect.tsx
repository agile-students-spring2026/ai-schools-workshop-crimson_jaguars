type Props = {
  value: string;
  states: string[];
  onChange: (state: string) => void;
};

export default function StateSelect({ value, states, onChange }: Props) {
  return (
    <div>
      <label
        htmlFor="state"
        className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
      >
        Select a state
      </label>
      <select
        id="state"
        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-900/60 text-white text-base focus:outline-none focus:border-teal-400 transition-colors"
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
