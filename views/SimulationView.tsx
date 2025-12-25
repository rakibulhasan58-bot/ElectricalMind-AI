import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '../types';

const SimulationView: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [frequency, setFrequency] = useState(1); // Hz
  const [amplitude, setAmplitude] = useState(5); // V
  const [phase, setPhase] = useState(0); // Degrees
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    // Generate static points for the graph based on parameters
    const generateData = () => {
      const points: ChartDataPoint[] = [];
      const samples = 100;
      const period = 1 / frequency; // Length of one cycle
      const timeSpan = period * 2; // Show 2 cycles
      
      for (let i = 0; i <= samples; i++) {
        const t = (i / samples) * timeSpan;
        const radianPhase = (phase * Math.PI) / 180;
        // Primary Wave (Sine)
        const v = amplitude * Math.sin(2 * Math.PI * frequency * t + radianPhase);
        // Secondary Wave (Cosine/Derivative representation)
        const v2 = amplitude * Math.cos(2 * Math.PI * frequency * t);
        
        points.push({ time: parseFloat(t.toFixed(3)), value: parseFloat(v.toFixed(2)), value2: parseFloat(v2.toFixed(2)) });
      }
      setData(points);
    };

    if (isRunning) {
        generateData();
    }
  }, [frequency, amplitude, phase, isRunning]);


  return (
    <div className="p-6 h-full flex flex-col bg-circuit-950 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">AC Waveform Visualizer</h2>
        <p className="text-slate-400">Real-time visualization of voltage waveforms, phase shifts, and frequency response.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Chart Area */}
        <div className="flex-1 bg-circuit-800 border border-circuit-700 rounded-xl p-4 h-[400px] shadow-lg">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8" 
                label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }} 
              />
              <YAxis stroke="#94a3b8" label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#fbbf24' }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" name="Voltage (V)" stroke="#fbbf24" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="value2" name="Current (Scaled)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Controls */}
        <div className="w-full lg:w-80 bg-circuit-900 border border-circuit-700 rounded-xl p-6 space-y-6 h-fit">
            <h3 className="text-lg font-semibold text-white border-b border-circuit-800 pb-2">Signal Parameters</h3>
            
            <div className="space-y-2">
                <label className="flex justify-between text-sm text-slate-300">
                    <span>Frequency</span>
                    <span className="text-electric-400 font-mono">{frequency} Hz</span>
                </label>
                <input 
                    type="range" min="1" max="60" step="1"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-full h-2 bg-circuit-700 rounded-lg appearance-none cursor-pointer accent-electric-500"
                />
            </div>

            <div className="space-y-2">
                <label className="flex justify-between text-sm text-slate-300">
                    <span>Amplitude</span>
                    <span className="text-electric-400 font-mono">{amplitude} V</span>
                </label>
                <input 
                    type="range" min="1" max="240" step="1"
                    value={amplitude}
                    onChange={(e) => setAmplitude(Number(e.target.value))}
                    className="w-full h-2 bg-circuit-700 rounded-lg appearance-none cursor-pointer accent-electric-500"
                />
            </div>

             <div className="space-y-2">
                <label className="flex justify-between text-sm text-slate-300">
                    <span>Phase Shift</span>
                    <span className="text-electric-400 font-mono">{phase}°</span>
                </label>
                <input 
                    type="range" min="0" max="360" step="15"
                    value={phase}
                    onChange={(e) => setPhase(Number(e.target.value))}
                    className="w-full h-2 bg-circuit-700 rounded-lg appearance-none cursor-pointer accent-electric-500"
                />
            </div>

            <div className="pt-4 border-t border-circuit-800">
                <div className="text-xs text-slate-500 mb-2">Analysis</div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-circuit-800 p-2 rounded text-center">
                        <div className="text-slate-400 text-xs">V(rms)</div>
                        <div className="text-electric-300 font-mono font-bold">{(amplitude * 0.707).toFixed(1)}V</div>
                    </div>
                     <div className="bg-circuit-800 p-2 rounded text-center">
                        <div className="text-slate-400 text-xs">Period</div>
                        <div className="text-electric-300 font-mono font-bold">{(1/frequency).toFixed(3)}s</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationView;