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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
          <div className="mt-4 flex items-center text-electric-500 text-sm font-medium">
            Start Chat <span className="ml-1">→</span>
          </div>
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
           <div className="mt-4 flex items-center text-blue-500 text-sm font-medium">
            Open Tools <span className="ml-1">→</span>
          </div>
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
           <div className="mt-4 flex items-center text-purple-500 text-sm font-medium">
            Visualize <span className="ml-1">→</span>
          </div>
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