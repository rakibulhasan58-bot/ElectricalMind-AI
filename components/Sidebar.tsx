import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: '⚡' },
    { id: ViewState.DESIGN, label: 'Electrical Design', icon: '🏗️' },
    { id: ViewState.POWER_SYSTEMS, label: 'Power Plants', icon: '🏭' },
    { id: ViewState.LIGHTING, label: 'Lighting Design', icon: '💡' },
    { id: ViewState.TUTOR, label: 'AI Tutor', icon: '🤖' },
    { id: ViewState.CALCULATORS, label: 'Toolbox', icon: '🧮' },
    { id: ViewState.SIMULATION, label: 'Visualizer', icon: '📈' },
    { id: ViewState.STANDARDS, label: 'Codes & Std', icon: '📜' },
    { id: ViewState.AUTOCAD, label: 'AutoCAD Elect.', icon: '📐' },
    { id: ViewState.BIM, label: 'BIM / Revit', icon: '🏢' },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 glass-panel border-r border-white/5 transform transition-transform duration-300 ease-in-out
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    md:relative md:translate-x-0 flex flex-col
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex items-center justify-center h-24 border-b border-white/5 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-500 to-transparent opacity-50"></div>
          
          <div className="text-center z-10">
            <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-electric-300 via-electric-400 to-electric-600 bg-clip-text text-transparent drop-shadow-lg">
              ELECTROMIND
            </h1>
            <p className="text-[10px] text-electric-200 tracking-[0.2em] uppercase mt-1 font-medium opacity-80">AI Engineering Lab</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 mb-2 mt-2">Core Modules</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 border border-transparent ${
                currentView === item.id
                  ? 'bg-electric-500/10 text-electric-400 border-electric-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white hover:border-white/5'
              }`}
            >
              <span className={`text-xl transition-transform duration-300 ${currentView === item.id ? 'scale-110 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="font-medium tracking-wide">{item.label}</span>
              
              {/* Active Indicator */}
              {currentView === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-electric-400 shadow-[0_0_5px_#fbbf24]"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="bg-gradient-to-br from-circuit-800 to-circuit-900 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-electric-500/20 blur-2xl rounded-full group-hover:bg-electric-500/30 transition-all"></div>
            
            <div className="flex items-center justify-between mb-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-mono text-green-400">SYSTEM ONLINE</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">v2.1.0 • Connected</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;