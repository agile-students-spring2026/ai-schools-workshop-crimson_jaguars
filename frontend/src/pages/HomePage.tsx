import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AudienceToggle from "../components/AudienceToggle";
import StateSelect from "../components/StateSelect";
import PresetSelect from "../components/PresetSelect";
import { PRESETS, STATES } from "../lib/presets";
import type { Audience, PresetKey } from "../lib/types";

export default function HomePage() {
  const navigate = useNavigate();

  const [audience, setAudience] = useState<Audience>("parent");
  const [state, setState] = useState("");
  const [preset, setPreset] = useState<PresetKey>("academic");

  const presetOptions = useMemo(() => PRESETS[audience], [audience]);

  function handleAudienceChange(nextAudience: Audience) {
    setAudience(nextAudience);
    setPreset(PRESETS[nextAudience][0].value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state) return;

    const params = new URLSearchParams({
      audience,
      state,
      preset,
    });

    navigate(`/results?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white grid place-items-center px-6 py-12">
      <section className="w-full max-w-xl">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-teal-400 font-semibold mb-3">
            SchoolScout
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Compare school districts by your priorities
          </h1>
          <p className="text-gray-400 mt-4 text-base leading-relaxed">
            Pick whether you're evaluating for a parent or educator, choose a
            state, and view districts ranked by what matters most.
          </p>
        </div>

        <form
          className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-5 shadow-xl"
          onSubmit={handleSubmit}
        >
          <AudienceToggle value={audience} onChange={handleAudienceChange} />
          <StateSelect value={state} states={STATES} onChange={setState} />
          <PresetSelect
            value={preset}
            options={presetOptions}
            onChange={setPreset}
          />
          <button
            type="submit"
            disabled={!state}
            className="w-full py-3 rounded-lg bg-teal-500 text-gray-950 font-semibold text-base hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            View Districts
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          Built with public NCES data · No accounts, no tracking
        </p>
      </section>
    </main>
  );
}
