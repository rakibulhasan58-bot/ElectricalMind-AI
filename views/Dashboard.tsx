import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';

interface DashboardProps {
    onNavigate: (view: ViewState) => void;
}

const LiveTicker = () => {
    const [newsIndex, setNewsIndex] = useState(0);
    const news = [
        "⚡ Global Copper prices surge 2.4% impacting transformer manufacturing costs.",
        "🏭 New IEC 61850 standard update released for Substation Automation.",
        "🔋 Solid-state battery breakthrough achieves 500Wh/kg energy density.",
        "🤖 AI-driven Load Forecasting reduces grid inefficiencies by 14%.",
        "💡 LED efficiency record broken: 305 lm/W achieved in lab conditions."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setNewsIndex((prev) => (prev + 1) % news.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-circuit-900/50 border-y border-white/5 backdrop-blur-md overflow-hidden py-2 flex items-center">
            <div className="px-4 flex items-center gap-2 border-r border-white/10 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live Updates</span>
            </div>
            <div className="flex-1 px-4 relative h-6">
                {news.map((item, idx) => (
                    <div 
                        key={idx}
                        className={`absolute top-0 left-4 transition-all duration-500 ease-in-out text-sm text-slate-300 truncate w-full ${
                            idx === newsIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="h-full overflow-y-auto bg-transparent relative">
      {/* Decorative Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-electric-600/10 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <LiveTicker />

      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <header className="text-center space-y-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-2xl">
            Engineer The Future.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Your advanced AI companion for electrical design, simulation, and analysis. 
            <span className="text-electric-400 font-semibold block mt-1">Ready to solve complex problems?</span>
          </p>
          
          <div className="flex justify-center gap-4 pt-4">
             <button 
                onClick={() => onNavigate(ViewState.TUTOR)}
                className="px-8 py-3 bg-electric-600 hover:bg-electric-500 text-white rounded-full font-bold shadow-[0_0_20px_rgba(217,119,6,0.4)] hover:shadow-[0_0_30px_rgba(217,119,6,0.6)] transition-all transform hover:-translate-y-1"
             >
                Start AI Tutor
             </button>
             <button 
                onClick={() => onNavigate(ViewState.CALCULATORS)}
                className="px-8 py-3 glass-panel hover:bg-white/5 text-slate-200 rounded-full font-bold border border-white/10 transition-all transform hover:-translate-y-1"
             >
                Open Toolbox
             </button>
          </div>
        </header>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { id: ViewState.DESIGN, title: "Design Studio", desc: "BOQ, Tender Docs & Specs", icon: "🏗️", color: "from-pink-500 to-rose-500" },
                { id: ViewState.POWER_SYSTEMS, title: "Power Plants", desc: "Generation & Transmission", icon: "🏭", color: "from-red-500 to-orange-500" },
                { id: ViewState.LIGHTING, title: "Lighting Sys", desc: "Lumen Calc & Standards", icon: "💡", color: "from-yellow-400 to-amber-500" },
                { id: ViewState.TUTOR, title: "AI Solver", desc: "Complex Problem Solving", icon: "🤖", color: "from-electric-400 to-yellow-600" },
                { id: ViewState.CALCULATORS, title: "Toolbox", desc: "Instant Engineering Calcs", icon: "🧮", color: "from-blue-400 to-indigo-500" },
                { id: ViewState.SIMULATION, title: "Visual Lab", desc: "Waveform Analysis", icon: "📈", color: "from-purple-400 to-violet-600" },
                { id: ViewState.STANDARDS, title: "Standards", desc: "NEC, IEC, IEEE Codes", icon: "📜", color: "from-emerald-400 to-green-600" },
                { id: ViewState.AUTOCAD, title: "AutoCAD", desc: "Automation Workflows", icon: "📐", color: "from-orange-400 to-red-500" },
            ].map((card, idx) => (
                <div 
                    key={card.id}
                    onClick={() => onNavigate(card.id)}
                    className="group relative cursor-pointer glass-panel rounded-2xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
                    style={{ animationDelay: `${idx * 100}ms` }}
                >
                    {/* Gradient Border on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    <div className="relative bg-circuit-900/90 h-full rounded-xl p-6 flex flex-col items-start z-10">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-3xl shadow-lg mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                            {card.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-electric-300 transition-colors">{card.title}</h3>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed">{card.desc}</p>
                        
                        <div className="mt-auto pt-4 flex items-center text-xs font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-wider">
                            Access Module <span className="ml-2">→</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Daily Fact / Quick Stat */}
        <div className="glass-panel rounded-2xl p-8 border border-electric-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-electric-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <div className="text-electric-400 font-mono text-sm mb-2">● DAILY ENGINEERING INSIGHT</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Did you know?</h3>
                    <p className="text-slate-300 max-w-2xl">
                        High Voltage Direct Current (HVDC) transmission losses are roughly <span className="text-white font-bold">30-40% lower</span> than typical AC lines over long distances (example: >600km). This makes HVDC ideal for connecting offshore wind farms to the main grid.
                    </p>
                </div>
                <button 
                    onClick={() => onNavigate(ViewState.POWER_SYSTEMS)}
                    className="shrink-0 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
                >
                    Explore Power Systems
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;