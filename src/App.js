import WaveInterferenceSimulator from "./WaveInterferenceSimulator";
import PendulumSimulator from "./PendulumSimulator";
import Home from "./Home";
import { Routes , Route } from "react-router-dom";
function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/wave-simulator" element={<WaveInterferenceSimulator />} />
        <Route exact path="/pendulum-simulator" element={<PendulumSimulator />} />
      </Routes>
    </div>
  );
}

export default App;
