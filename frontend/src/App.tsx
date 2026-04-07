import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ResultsPage } from "./pages/ResultsPage";
import { ComparePage } from "./pages/ComparePage";
import type { Audience, PresetKey, ScoredDistrict } from "./lib/types";

const VALID_AUDIENCES: Audience[] = ["parent", "educator"];
const VALID_PRESETS: PresetKey[] = [
  "academic",
  "balancedFamily",
  "smallClassrooms",
  "classroomConditions",
  "resourceSupport",
  "balancedTeaching",
];

function ResultsRoute() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const rawAudience = params.get("audience");
  const audience: Audience = VALID_AUDIENCES.includes(rawAudience as Audience)
    ? (rawAudience as Audience)
    : "parent";

  const state = params.get("state") ?? "NY";

  const rawPreset = params.get("preset");
  const preset: PresetKey = VALID_PRESETS.includes(rawPreset as PresetKey)
    ? (rawPreset as PresetKey)
    : "academic";

  const handleCompare = (districts: [ScoredDistrict, ScoredDistrict]) => {
    const [a, b] = districts;
    const qs = new URLSearchParams({ a: a.id, b: b.id });
    navigate(`/compare?${qs.toString()}`);
  };

  return (
    <ResultsPage
      state={state}
      audience={audience}
      preset={preset}
      onBack={() => navigate("/")}
      onCompare={handleCompare}
    />
  );
}

function CompareRoute() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const a = params.get("a");
  const b = params.get("b");

  if (!a || !b) return <div className="p-8">Invalid comparison</div>;

  // For now, return placeholder - will be populated by test or actual data
  return <div className="p-8">Compare page loading...</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsRoute />} />
        <Route path="/compare" element={<CompareRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
