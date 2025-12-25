import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import TutorView from './views/TutorView';
import ToolsView from './views/ToolsView';
import SimulationView from './views/SimulationView';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case ViewState.TUTOR:
        return <TutorView />;
      case ViewState.CALCULATORS:
        return <ToolsView />;
      case ViewState.SIMULATION:
        return <SimulationView />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-circuit-950 overflow-hidden text-slate-200 font-sans selection:bg-electric-500/30">
      
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-circuit-900 border-b border-circuit-800 z-10">
          <span className="font-bold text-lg text-electric-500">ElectroMind</span>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-300 hover:bg-circuit-800 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* View Container */}
        <main className="flex-1 overflow-hidden relative">
          {renderView()}
        </main>

      </div>
    </div>
  );
};

export default App;