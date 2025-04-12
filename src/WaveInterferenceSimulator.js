import React, { useRef, useEffect, useState } from 'react';
import Sketch from 'react-p5';

export default function WaveInterferenceSimulator() {
  const [wave1Amplitude, setWave1Amplitude] = useState(50);
  const [wave2Amplitude, setWave2Amplitude] = useState(50);
  const [wave1Frequency, setWave1Frequency] = useState(0.05);
  const [wave2Frequency, setWave2Frequency] = useState(0.05);
  const [wave1Phase, setWave1Phase] = useState(0);
  const [wave2Phase, setWave2Phase] = useState(0);
  const [showWave1, setShowWave1] = useState(true);
  const [showWave2, setShowWave2] = useState(true);
  const [showResultant, setShowResultant] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(0.05);
  const [paused, setPaused] = useState(false);

  const time = useRef(0);
  const canvasWidth = 800;
  const canvasHeight = 400;

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background('#111827');

    if (!paused) {
      time.current += animationSpeed;
    }

    p5.stroke('#374151');
    p5.strokeWeight(1);

    p5.line(0, canvasHeight / 2, canvasWidth, canvasHeight / 2);

    for (let x = 0; x < canvasWidth; x += 50) {
      p5.line(x, 0, x, canvasHeight);
    }

    for (let y = 0; y < canvasHeight; y += 50) {
      p5.line(0, y, canvasWidth, y);
    }

    if (showWave1) {
      p5.stroke('#3B82F6');
      p5.strokeWeight(2);
      p5.noFill();
      p5.beginShape();

      for (let x = 0; x < canvasWidth; x++) {
        const y = canvasHeight / 2 - wave1Amplitude * Math.sin(wave1Frequency * x + time.current + wave1Phase);
        p5.vertex(x, y);
      }

      p5.endShape();
    }

    if (showWave2) {
      p5.stroke('#F59E0B');
      p5.strokeWeight(2);
      p5.noFill();
      p5.beginShape();

      for (let x = 0; x < canvasWidth; x++) {
        const y = canvasHeight / 2 - wave2Amplitude * Math.sin(wave2Frequency * x + time.current + wave2Phase);
        p5.vertex(x, y);
      }

      p5.endShape();
    }

    if (showResultant && showWave1 && showWave2) {
      p5.stroke('#EF4444');
      p5.strokeWeight(3);
      p5.noFill();
      p5.beginShape();

      for (let x = 0; x < canvasWidth; x++) {
        const y1 = wave1Amplitude * Math.sin(wave1Frequency * x + time.current + wave1Phase);
        const y2 = wave2Amplitude * Math.sin(wave2Frequency * x + time.current + wave2Phase);
        const y = canvasHeight / 2 - (y1 + y2);
        p5.vertex(x, y);
      }

      p5.endShape();
    }

    p5.fill('#F9FAFB');
    p5.noStroke();
    p5.textSize(14);

    if (showWave1) {
      p5.fill('#3B82F6');
      p5.text("Wave 1", 20, 30);
    }

    if (showWave2) {
      p5.fill('#F59E0B');
      p5.text("Wave 2", 20, 50);
    }

    if (showResultant && showWave1 && showWave2) {
      p5.fill('#EF4444');
      p5.text("Resultant Wave", 20, 70);
    }

    if (showWave1 && showWave2 && showResultant) {
      const phaseDiff = Math.abs(wave1Phase - wave2Phase) % (2 * Math.PI);
      let interferenceType = "";

      if (Math.abs(phaseDiff - Math.PI) < 0.1) {
        interferenceType = "Destructive Interference";
      } else if (phaseDiff < 0.1 || Math.abs(phaseDiff - 2 * Math.PI) < 0.1) {
        interferenceType = "Constructive Interference";
      } else {
        interferenceType = "Partial Interference";
      }

      p5.fill('#F9FAFB');
      p5.textSize(16);
      p5.textAlign(p5.RIGHT);
      p5.text(interferenceType, canvasWidth - 20, 30);
      p5.textAlign(p5.LEFT);
    }
  };

  const radToDeg = (rad) => Math.round(rad * 180 / Math.PI);

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-100 mb-4">Wave Interference Simulator</h1>

      <div className="mb-8 flex justify-center">
        <div className="p-2 bg-gray-800 rounded-lg shadow-md w-full">
          <Sketch setup={setup} draw={draw} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Wave 1</h2>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="showWave1"
              checked={showWave1}
              onChange={() => setShowWave1(!showWave1)}
              className="mr-2"
            />
            <label htmlFor="showWave1" className="text-gray-100">Show Wave 1</label>
          </div>

          <div className="mb-4">
            <label className="block text-gray-100 mb-1">Amplitude: {wave1Amplitude}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={wave1Amplitude}
              onChange={(e) => setWave1Amplitude(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-100 mb-1">Frequency: {wave1Frequency.toFixed(3)}</label>
            <input
              type="range"
              min="0.01"
              max="0.15"
              step="0.01"
              value={wave1Frequency}
              onChange={(e) => setWave1Frequency(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-100 mb-1">Phase: {radToDeg(wave1Phase)}°</label>
            <input
              type="range"
              min="0"
              max={2 * Math.PI}
              step="0.1"
              value={wave1Phase}
              onChange={(e) => setWave1Phase(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Wave 2</h2>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="showWave2"
              checked={showWave2}
              onChange={() => setShowWave2(!showWave2)}
              className="mr-2"
            />
            <label htmlFor="showWave2" className="text-gray-100">Show Wave 2</label>
          </div>

          <div className="mb-4">
            <label className="block text-gray-100 mb-1">Amplitude: {wave2Amplitude}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={wave2Amplitude}
              onChange={(e) => setWave2Amplitude(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-100 mb-1">Frequency: {wave2Frequency.toFixed(3)}</label>
            <input
              type="range"
              min="0.01"
              max="0.15"
              step="0.01"
              value={wave2Frequency}
              onChange={(e) => setWave2Frequency(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-100 mb-1">Phase: {radToDeg(wave2Phase)}°</label>
            <input
              type="range"
              min="0"
              max={2 * Math.PI}
              step="0.1"
              value={wave2Phase}
              onChange={(e) => setWave2Phase(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Simulation Controls</h2>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showResultant"
              checked={showResultant}
              onChange={() => setShowResultant(!showResultant)}
              className="mr-2"
            />
            <label htmlFor="showResultant" className="text-gray-100">Show Resultant Wave</label>
          </div>

          <div className="flex-1">
            <label className="block text-gray-100 mb-1">Animation Speed</label>
            <input
              type="range"
              min="0"
              max="0.2"
              step="0.01"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            className={`px-4 py-2 rounded-md ${paused ? 'bg-green-500' : 'bg-red-500'} text-white`}
            onClick={() => setPaused(!paused)}
          >
            {paused ? 'Play' : 'Pause'}
          </button>

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => {
              setWave1Phase(0);
              setWave2Phase(Math.PI);
            }}
          >
            Destructive Interference
          </button>

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => {
              setWave1Phase(0);
              setWave2Phase(0);
            }}
          >
            Constructive Interference
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Wave Interference Explanation</h2>

        <div className="text-gray-100 space-y-2">
          <p><strong>Constructive Interference:</strong> Occurs when waves are in phase (0° or 360° phase difference). The amplitudes add together, resulting in a larger wave.</p>
          <p><strong>Destructive Interference:</strong> Occurs when waves are out of phase (180° phase difference). The amplitudes cancel each other out, resulting in a smaller or zero amplitude wave.</p>
          <p><strong>Partial Interference:</strong> Occurs when waves have phase differences other than 0° or 180°. The result is a wave with varying amplitude.</p>
        </div>
      </div>
    </div>
  );
}