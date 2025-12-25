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
    { id: ViewState.POWER_SYSTEMS, label: 'Power Plants & Sub.', icon: '🏭' },
    { id: ViewState.LIGHTING, label: 'Lighting Design', icon: '💡' },
    { id: ViewState.TUTOR, label: 'AI Tutor', icon: '🤖' },
    { id: ViewState.CALCULATORS, label: 'Toolbox', icon: '🧮' },
    { id: ViewState.SIMULATION, label: 'Visualizer', icon: '📈' },
    { id: ViewState.STANDARDS, label: 'Codes & Std', icon: '📜' },
    { id: ViewState.AUTOCAD, label: 'AutoCAD Elect.', icon: '📐' },
    { id: ViewState.BIM, label: 'BIM / Revit', icon: '🏢' },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-circuit-900 border-r border-circuit-800 transform transition-transform duration-300 ease-in-out
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    md:relative md:translate-x-0
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex items-center justify-center h-16 border-b border-circuit-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-electric-400 to-electric-600 bg-clip-text text-transparent">
            ElectroMind AI
          </h1>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                currentView === item.id
                  ? 'bg-electric-600 text-white shadow-lg shadow-electric-900/50'
                  : 'text-slate-400 hover:bg-circuit-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-circuit-800">
          <div className="bg-circuit-800 rounded-lg p-3 text-xs text-slate-400">
            <p className="font-semibold text-electric-400 mb-1">Status: Online</p>
            <p>v2.0.1 • Stable</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;