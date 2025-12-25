import React from 'react';
import { ViewState } from '../types';

interface DashboardProps {
    onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-circuit-950">
      <header className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-electric-300 via-electric-500 to-electric-600 mb-4">
          Master Electronics.
        </h1>
        <p className="text-lg text-slate-400">
          Your AI-powered pocket lab. Learn basics, solve circuit problems, and calculate parameters instantly.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        
        {/* Card 0: Electrical Design */}
        <div 
             onClick={() => onNavigate(ViewState.DESIGN)}
             className="group cursor-pointer bg-circuit-900 border border-circuit-800 hover:border-pink-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-900/20 hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-pink-900/30 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:bg-pink-600 group-hover:text-white transition-colors">
            🏗️
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Design Studio</h3>
          <p className="text-slate-400 text-sm">Create BOQs, Tender Docs, and complete designs for Residential & Industrial projects.</p>
        </div>

        {/* Card 0.2: Power Systems (New Feature) */}
        <div 
             onClick={() => onNavigate(ViewState.POWER_SYSTEMS)}
             className="group cursor-pointer bg-circuit-900 border border-circuit-800 hover:border-red-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20 hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:bg-red-600 group-hover:text-white transition-colors">
            🏭
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Plants & Subs</h3>
          <p className="text-slate-400 text-sm">Explore Thermal, Hydro, Solar plants and Substation engineering with real-world examples.</p>
        </div>

         {/* Card 0.5: Lighting Design */}
         <div 
             onClick={() => onNavigate(ViewState.LIGHTING)}
             className="group cursor-pointer bg-circuit-900 border border-circuit-800 hover:border-yellow-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-900/20 hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:bg-yellow-600 group-hover:text-white transition-colors">
            💡
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Lighting System</h3>
          <p className="text-slate-400 text-sm">Lumen method calculations, lux standards, and professional fixture selection.</p>
        </div>

        {/* Card 1: AI Tutor */}
        <div 
            onClick={() => onNavigate(ViewState.TUTOR)}
            className="group cursor-pointer bg-circuit-900 border border-circuit-800 hover:border-electric-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-electric-900/20 hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-electric-900/30 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:bg-electric-600 group-hover:text-white transition-colors">
            🤖
          </div>
          <h3 className="text-xl font-bold text-white mb-2">AI Problem Solver</h3>
          <p className="text-slate-400 text-sm">Ask complex circuit questions, get design help, or explain theory. Powered by Gemini.</p>
        </div>

        {/* Card 2: Calculators */}
        <div 
             onClick={() => onNavigate(ViewState.CALCULATORS)}
             className="group cursor-pointer bg-circuit-900 border border-circuit-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            🧮
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Design Toolbox</h3>
          <p className="text-slate-400 text-sm">Instant calculators for Ohm's Law, Power, Capacitance, Inductance, and more.</p>
        </div>

         {/* Card 3: Simulation */}
         <div 
             onClick={() => onNavigate(ViewState.SIMULATION)}
             className="group cursor-pointer bg-circuit-900 border border-circuit-800 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
            📈
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Visual Lab</h3>
          <p className="text-slate-400 text-sm">Visualize AC waveforms, understand phase angles, and analyze signal properties.</p>
        </div>

        {/* Card 4: Standards */}
        <div 
             onClick={() => onNavigate(ViewState.STANDARDS)}
             className="group cursor-pointer bg-circuit-900 border border-circuit-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/20 hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            📜
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Codes & Stds</h3>
          <p className="text-slate-400 text-sm">Learn BNBC, NEC, IEC, NFPA, and IEEE standards with expert AI guidance.</p>
        </div>

        {/* Card 5: AutoCAD */}
        <div 
             onClick={() => onNavigate(ViewState.AUTOCAD)}
             className="group cursor-pointer bg-circuit-900 border border-circuit-800 hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/20 hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-orange-900/30 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
            📐
          </div>
          <h3 className="text-xl font-bold text-white mb-2">AutoCAD Elect.</h3>
          <p className="text-slate-400 text-sm">Master electrical design workflows, from schematics to panel layouts.</p>
        </div>

        {/* Card 6: BIM / Revit */}
        <div 
             onClick={() => onNavigate(ViewState.BIM)}
             className="group cursor-pointer bg-circuit-900 border border-circuit-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-900/20 hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:bg-cyan-600 group-hover:text-white transition-colors">
            🏢
          </div>
          <h3 className="text-xl font-bold text-white mb-2">BIM & Revit</h3>
          <p className="text-slate-400 text-sm">Learn 3D modeling for electrical systems, coordination, and Revit workflows.</p>
        </div>
      </div>

      <div className="mt-12 text-center">
         <div className="inline-block bg-circuit-800 rounded-full px-4 py-1.5 border border-circuit-700">
             <span className="text-xs text-slate-400 font-mono">
                 Offline Mode Enabled • Gemini API Requires Internet
             </span>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;