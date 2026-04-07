import { useEffect, useMemo, useState } from "react";
import { fetchDistricts, fetchStates } from "./api";
import type { District, State } from "./types";

function scoreClass(score: number): string {
  if (score >= 75) return "good";
  if (score >= 50) return "ok";
  return "bad";
}

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return Number(n).toLocaleString();
}

function gradeFmt(g: number | string | null | undefined): string {
  if (g === null || g === undefined || g === -1 || g === "-1") return "—";
  if (g === 0 || g === "0" || g === "KG") return "K";
  return String(g);
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="bar">
      <div className="bar-label">
        <span>{label}</span>
        <span>{value.toFixed(0)}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

export default function App() {
  const [states, setStates] = useState<State[]>([]);
  const [stateCode, setStateCode] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [districts, setDistricts] = useState<District[]>([]);
  const [selected, setSelected] = useState<District | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStates()
      .then(setStates)
      .catch(() => setError("Could not load states"));
  }, []);

  useEffect(() => {
    if (!stateCode) return;
    setLoading(true);
    setError(null);
    setSelected(null);
    fetchDistricts(stateCode)
      .then((res) => setDistricts(res.results))
      .catch(() => setError("Could not load districts for this state"))
      .finally(() => setLoading(false));
  }, [stateCode]);

  const filtered = useMemo(() => {
    if (!query) return districts;
    const q = query.toLowerCase();
    return districts.filter((d) => d.name.toLowerCase().includes(q));
  }, [districts, query]);

  return (
    <div className="app">
      <header className="hero">
        <h1>School District Evaluator</h1>
        <p>
          Compare US public school districts using NCES Common Core of Data.
          Pick a state to begin.
        </p>
      </header>

      <div className="controls">
        <select
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value)}
          aria-label="State"
        >
          <option value="">Select a state…</option>
          {states.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter districts by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={!districts.length}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <div className="layout">
        <div className="list">
          {loading && <div className="loading">Loading districts…</div>}
          {!loading && !stateCode && (
            <div className="empty">Select a state to see its districts.</div>
          )}
          {!loading && stateCode && filtered.length === 0 && (
            <div className="empty">No districts found.</div>
          )}
          {!loading &&
            filtered.map((d) => (
              <div
                key={d.leaid}
                className={`row ${selected?.leaid === d.leaid ? "selected" : ""}`}
                onClick={() => setSelected(d)}
              >
                <div>
                  <div className="name">{d.name}</div>
                  <div className="meta">
                    {d.city || "—"} • {fmt(d.enrollment)} students
                  </div>
                </div>
                <div className={`score-pill ${scoreClass(d.score.overall)}`}>
                  {d.score.overall.toFixed(0)}
                </div>
              </div>
            ))}
        </div>

        <div className="detail">
          {!selected ? (
            <div className="empty">Pick a district to see its profile.</div>
          ) : (
            <>
              <h2>{selected.name}</h2>
              <div className="sub">
                {selected.city || ""} {selected.state ? `, ${selected.state}` : ""} • Year{" "}
                {selected.year ?? "—"}
              </div>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <div className={`score-pill big ${scoreClass(selected.score.overall)}`}>
                  {selected.score.overall.toFixed(0)} / 100
                </div>
              </div>

              <div className="stats">
                <div className="stat">
                  <div className="label">Enrollment</div>
                  <div className="value">{fmt(selected.enrollment)}</div>
                </div>
                <div className="stat">
                  <div className="label">Teachers (FTE)</div>
                  <div className="value">{fmt(selected.teachers_total_fte)}</div>
                </div>
                <div className="stat">
                  <div className="label">Student/Teacher Ratio</div>
                  <div className="value">
                    {selected.score.student_teacher_ratio ?? "—"}
                  </div>
                </div>
                <div className="stat">
                  <div className="label">Schools</div>
                  <div className="value">{fmt(selected.number_of_schools)}</div>
                </div>
                <div className="stat">
                  <div className="label">Grades</div>
                  <div className="value">
                    {gradeFmt(selected.lowest_grade_offered)}–
                    {gradeFmt(selected.highest_grade_offered)}
                  </div>
                </div>
                <div className="stat">
                  <div className="label">Free/Reduced Lunch %</div>
                  <div className="value">
                    {selected.free_or_reduced_price_lunch_pct ?? "—"}
                  </div>
                </div>
              </div>

              <div className="factors">
                <h3>Score breakdown</h3>
                <Bar
                  label="Student–teacher ratio"
                  value={selected.score.factors.student_teacher_ratio_score}
                />
                <Bar label="District size" value={selected.score.factors.size_score} />
                <Bar
                  label="Funding context"
                  value={selected.score.factors.funding_context_score}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <footer>
        Data: NCES Common Core of Data via the Urban Institute Education Data Portal.
        Scores are heuristic and not endorsed by either organization.
      </footer>
    </div>
  );
}
