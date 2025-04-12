import React from 'react';
import { Waves, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111827] text-gray-100 flex flex-col">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">PhysicsLab</h1>
          <nav className="hidden md:flex space-x-8">
            <a href="#about" className="text-gray-300 hover:text-white transition duration-150">About</a>
            <a href="#simulators" className="text-gray-300 hover:text-white transition duration-150">Simulators</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition duration-150">Contact</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Interactive Physics Simulations
            </h2>
            <p className="mt-4 text-xl text-gray-400">
              Explore physics concepts through interactive simulations designed to enhance understanding and learning.
            </p>
          </div>
        </section>

        <section id="simulators" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 bg-opacity-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Available Simulators</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Wave Simulator Card */}
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                <div className="h-48 bg-blue-900 flex items-center justify-center">
                  <Waves size={80} className="text-blue-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Wave Simulator</h3>
                  <p className="text-gray-400 mb-4">
                    Visualize wave properties including amplitude, frequency, wavelength, and interference patterns in real-time.
                  </p>
                  <Link 
                    to="/wave-simulator" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-150"
                  >
                    Launch Simulator
                  </Link>
                </div>
              </div>

              {/* Pendulum Simulator Card */}
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                <div className="h-48 bg-purple-900 flex items-center justify-center">
                  <PenTool size={80} className="text-purple-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Pendulum Simulator</h3>
                  <p className="text-gray-400 mb-4">
                    Experiment with simple and compound pendulums to explore the principles of periodic motion, gravity, and conservation of energy.
                  </p>
                  <Link
                    to="/pendulum-simulator" 
                    className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition duration-150"
                  >
                    Launch Simulator
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Why Use PhysicsLab?</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-10 text-left">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-blue-400">Interactive Learning</h3>
                <p className="text-gray-400">Engage with physics concepts through hands-on experimentation and visualization.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-400">Real-time Feedback</h3>
                <p className="text-gray-400">Immediately see how changing variables affects physical systems.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-green-400">Accessible Anywhere</h3>
                <p className="text-gray-400">Use our simulators on any device with a web browser, no installation required.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-white">PhysicsLab</h2>
            <p className="text-sm text-gray-400">Interactive physics simulations for education</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy
            </a>
            <a href="#contact" className="text-gray-400 hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}