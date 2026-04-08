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
    <main className="page">
      <section className="hero-card">
        <p className="eyebrow">SchoolScout</p>
        <h1>Compare school districts by your priorities</h1>
        <p className="subtitle">
          Pick whether you’re evaluating for a parent or educator, choose a
          state, and view districts ranked by what matters most.
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <AudienceToggle value={audience} onChange={handleAudienceChange} />
          <StateSelect value={state} states={STATES} onChange={setState} />
          <PresetSelect
            value={preset}
            options={presetOptions}
            onChange={setPreset}
          />
          <button className="primary-button" type="submit" disabled={!state}>
            View Districts
          </button>
        </form>
      </section>
    </main>
  );
}