import { ResultsPage } from "./pages/ResultsPage";

function App() {
  return (
    <ResultsPage
      state="NY"
      audience="parent"
      preset="academic"
      onBack={() => console.log("back")}
      onCompare={(districts) => console.log("compare", districts)}
    />
  );
}

export default App;
