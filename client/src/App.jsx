/**
 * App.jsx — Root component with layout and background
 */
import BackgroundFx from "./components/BackgroundFx";
import Header from "./components/Header";
import Home from "./pages/Home";

const App = () => (
  <div className="relative min-h-screen bg-ink-950 font-body text-slate-100">
    <BackgroundFx />
    <Header />
    <Home />
  </div>
);

export default App;
