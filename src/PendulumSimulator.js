import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

const PendulumSimulator = () => {
  const [pendulumParams, setPendulumParams] = useState({
    length: 200,
    mass: 10,
    gravity: 0.5,
    angle: Math.PI / 4,
    damping: 0.995,
    trailLength: 100,
  });

  const [energy, setEnergy] = useState({
    potential: 0,
    kinetic: 0,
    total: 0,
  });

  const [isPaused, setIsPaused] = useState(false);
  const [showTrail, setShowTrail] = useState(true);
  const [showEnergy, setShowEnergy] = useState(true);
  const [resetFlag, setResetFlag] = useState(0);

  const p5ContainerRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const energyHistoryRef = useRef([]);
  const trailRef = useRef([]);

  useEffect(() => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }

    const sketch = (p) => {
      let angle = pendulumParams.angle;
      let angleVelocity = 0;
      let angleAcceleration = 0;

      p.setup = () => {
        p.createCanvas(600, 500);
        resetSimulation();
      };

      p.draw = () => {
        p.background(20);

        const origin = { x: p.width / 2, y: 100 };

        if (!isPaused) {
          angleAcceleration = (-1 * pendulumParams.gravity / pendulumParams.length) * p.sin(angle);
          angleVelocity += angleAcceleration;
          angleVelocity *= pendulumParams.damping;
          angle += angleVelocity;

          const height = pendulumParams.length * (1 - p.cos(angle));
          const kineticEnergy = 0.5 * pendulumParams.mass * (angleVelocity * pendulumParams.length) ** 2;
          const potentialEnergy = pendulumParams.mass * pendulumParams.gravity * height;
          const totalEnergy = kineticEnergy + potentialEnergy;

          setEnergy({
            kinetic: kineticEnergy,
            potential: potentialEnergy,
            total: totalEnergy,
          });

          const bobPosition = {
            x: origin.x + pendulumParams.length * p.sin(angle),
            y: origin.y + pendulumParams.length * p.cos(angle),
          };

          if (showTrail) {
            trailRef.current.push({ ...bobPosition });
            if (trailRef.current.length > pendulumParams.trailLength) {
              trailRef.current.shift();
            }
          }

          energyHistoryRef.current.push({
            kinetic: kineticEnergy,
            potential: potentialEnergy,
            total: totalEnergy,
          });

          if (energyHistoryRef.current.length > 200) {
            energyHistoryRef.current.shift();
          }
        }

        p.fill(200);
        p.stroke(200);
        p.ellipse(origin.x, origin.y, 10, 10);

        const bobPosition = {
          x: origin.x + pendulumParams.length * p.sin(angle),
          y: origin.y + pendulumParams.length * p.cos(angle),
        };

        p.stroke(255);
        p.strokeWeight(2);
        p.line(origin.x, origin.y, bobPosition.x, bobPosition.y);

        p.fill(255, 100, 100);
        p.noStroke();
        p.ellipse(bobPosition.x, bobPosition.y, pendulumParams.mass * 2, pendulumParams.mass * 2);

        if (showTrail && trailRef.current.length > 0) {
          p.noFill();
          p.beginShape();
          trailRef.current.forEach((pos, i) => {
            const alpha = p.map(i, 0, trailRef.current.length - 1, 10, 200);
            p.stroke(255, 100, 100, alpha);
            p.vertex(pos.x, pos.y);
          });
          p.endShape();
        }

        if (showEnergy) {
          drawEnergyGraph(p);
        }
      };

      p.mousePressed = () => {
        const origin = { x: p.width / 2, y: 100 };
        const dx = p.mouseX - origin.x;
        const dy = p.mouseY - origin.y;

        if (p.dist(p.mouseX, p.mouseY, origin.x + pendulumParams.length * p.sin(angle), origin.y + pendulumParams.length * p.cos(angle)) < pendulumParams.mass * 2) {
          const newAngle = p.atan2(dx, dy);
          angle = newAngle;
          angleVelocity = 0;

          trailRef.current = [];
          energyHistoryRef.current = [];
        }
      };

      const drawEnergyGraph = (p) => {
        const graphHeight = 100;
        const graphY = p.height - graphHeight - 20;

        p.fill(30);
        p.rect(20, graphY, p.width - 40, graphHeight);

        if (energyHistoryRef.current.length > 0) {
          const maxEnergy = Math.max(...energyHistoryRef.current.map((e) => Math.max(e.kinetic, e.potential, e.total))) * 1.1 || 100;

          p.stroke(100, 200, 255);
          p.beginShape();
          energyHistoryRef.current.forEach((e, i) => {
            const x = p.map(i, 0, energyHistoryRef.current.length - 1, 20, p.width - 40);
            const y = p.map(e.kinetic, 0, maxEnergy, graphY + graphHeight, graphY);
            p.vertex(x, y);
          });
          p.endShape();

          p.stroke(255, 200, 100);
          p.beginShape();
          energyHistoryRef.current.forEach((e, i) => {
            const x = p.map(i, 0, energyHistoryRef.current.length - 1, 20, p.width - 40);
            const y = p.map(e.potential, 0, maxEnergy, graphY + graphHeight, graphY);
            p.vertex(x, y);
          });
          p.endShape();

          p.stroke(255, 100, 100);
          p.beginShape();
          energyHistoryRef.current.forEach((e, i) => {
            const x = p.map(i, 0, energyHistoryRef.current.length - 1, 20, p.width - 40);
            const y = p.map(e.total, 0, maxEnergy, graphY + graphHeight, graphY);
            p.vertex(x, y);
          });
          p.endShape();
        }

        p.fill(255);
        p.noStroke();
        p.textSize(12);
        p.text("Energy Graph", 25, graphY + 15);

        p.fill(100, 200, 255);
        p.rect(100, graphY + 7, 10, 10);
        p.fill(255);
        p.text("Kinetic", 115, graphY + 15);

        p.fill(255, 200, 100);
        p.rect(170, graphY + 7, 10, 10);
        p.fill(255);
        p.text("Potential", 185, graphY + 15);

        p.fill(255, 100, 100);
        p.rect(250, graphY + 7, 10, 10);
        p.fill(255);
        p.text("Total", 265, graphY + 15);
      };

      const resetSimulation = () => {
        angle = pendulumParams.angle;
        angleVelocity = 0;
        angleAcceleration = 0;
        trailRef.current = [];
        energyHistoryRef.current = [];
      };
    };

    if (p5ContainerRef.current) {
      p5InstanceRef.current = new p5(sketch, p5ContainerRef.current);
    }

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [pendulumParams, isPaused, showTrail, showEnergy, resetFlag]);

  const handleReset = () => {
    trailRef.current = [];
    energyHistoryRef.current = [];
    setResetFlag((prev) => prev + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPendulumParams((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const formatEnergy = (value) => {
    return Math.round(value * 100) / 100;
  };

  return (
    <div className="w-screen mx-auto p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold mb-4">Advanced Pendulum Simulator</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/3 flex justify-center">
          <div ref={p5ContainerRef} className="bg-black rounded-lg overflow-hidden"></div>

        </div>

        <div className="lg:w-1/3 bg-gray-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Controls</h2>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm mb-1">Length: {pendulumParams.length}</label>
              <input
                type="range"
                name="length"
                min="50"
                max="300"
                value={pendulumParams.length}
                onChange={handleInputChange}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Mass: {pendulumParams.mass}</label>
              <input
                type="range"
                name="mass"
                min="1"
                max="20"
                value={pendulumParams.mass}
                onChange={handleInputChange}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Gravity: {pendulumParams.gravity}</label>
              <input
                type="range"
                name="gravity"
                min="0.1"
                max="1"
                step="0.05"
                value={pendulumParams.gravity}
                onChange={handleInputChange}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Initial Angle: {Math.round((pendulumParams.angle * 180) / Math.PI)}°
              </label>
              <input
                type="range"
                name="angle"
                min={-Math.PI / 2}
                max={Math.PI / 2}
                step={0.01}
                value={pendulumParams.angle}
                onChange={handleInputChange}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Damping: {pendulumParams.damping}</label>
              <input
                type="range"
                name="damping"
                min="0.98"
                max="1"
                step="0.001"
                value={pendulumParams.damping}
                onChange={handleInputChange}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Trail Length: {pendulumParams.trailLength}</label>
              <input
                type="range"
                name="trailLength"
                min="0"
                max="200"
                step="1"
                value={pendulumParams.trailLength}
                onChange={handleInputChange}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md"
              >
                {isPaused ? "Resume" : "Pause"}
              </button>

              <button
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md"
              >
                Reset
              </button>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showTrail}
                  onChange={() => setShowTrail(!showTrail)}
                  className="mr-2"
                />
                Show Trail
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showEnergy}
                  onChange={() => setShowEnergy(!showEnergy)}
                  className="mr-2"
                />
                Show Energy Graph
              </label>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-300">
            <p>Click and drag the pendulum bob to reposition it.</p>
            <p>Adjust parameters to see how they affect the motion and energy.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Energy Values</h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-gray-800 rounded-md">
                <div className="text-sm text-blue-300">Kinetic Energy</div>
                <div className="text-lg">{formatEnergy(energy.kinetic)}</div>
              </div>
              <div className="p-2 bg-gray-800 rounded-md">
                <div className="text-sm text-yellow-300">Potential Energy</div>
                <div className="text-lg">{formatEnergy(energy.potential)}</div>
              </div>
              <div className="p-2 bg-gray-800 rounded-md">
                <div className="text-sm text-red-300">Total Energy</div>
                <div className="text-lg">{formatEnergy(energy.total)}</div>
              </div>
            </div>
          </div>
    </div>
  );
};

export default PendulumSimulator;