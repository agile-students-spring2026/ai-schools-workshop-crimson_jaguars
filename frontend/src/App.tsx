import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

function ResultsPlaceholder() {
  return <div style={{ padding: "2rem" }}>Results page goes here.</div>;
}

function ComparePlaceholder() {
  return <div style={{ padding: "2rem" }}>Compare page goes here.</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsPlaceholder />} />
        <Route path="/compare" element={<ComparePlaceholder />} />
      </Routes>
    </BrowserRouter>
  );
}