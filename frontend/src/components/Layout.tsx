import React from 'react';
import { Compass, Sun, ShieldAlert, Zap, Globe } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDashboard: boolean;
  setIsDashboard: (val: boolean) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isDashboard, setIsDashboard }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cosmic-bg text-gray-200">
      <header className="border-b border-cosmic-accent bg-cosmic-panel px-6 py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsDashboard(false)}>
          <span className="text-2xl text-cosmic-gold font-bold">☀️ CHIZHEVSKY LABS</span>
          <span className="text-xs bg-cosmic-accent text-cosmic-gold px-2 py-0.5 border border-cosmic-gold/30 uppercase tracking-widest font-bold">
            Cosmic Intelligence v1.0
          </span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsDashboard(!isDashboard)}
            className={`px-4 py-2 border font-bold text-xs tracking-wider transition-colors uppercase ${
              isDashboard ? 'bg-cosmic-gold text-cosmic-bg border-cosmic-gold' : 'border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10'
            }`}
          >
            {isDashboard ? "Ver Sitio Público" : "Entrar al Sistema"}
          </button>
        </div>
      </header>
      <div className="flex flex-1">
        {isDashboard && (
          <aside className="w-64 bg-cosmic-panel border-r border-cosmic-accent flex flex-col justify-between p-4">
            <nav className="flex flex-col gap-2">
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest px-3 mb-2">Módulos Científicos</div>
              {[
                { id: 'HELIOS', name: 'Helios (Sol)', icon: <Sun size={18} /> },
                { id: 'AERION', name: 'Aerion (Iones)', icon: <Zap size={18} /> },
                { id: 'ASTROVIR', name: 'Astrovir (Riesgo)', icon: <ShieldAlert size={18} /> },
                { id: 'CHRONOS', name: 'Chronos (Ritmos)', icon: <Compass size={18} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 font-bold text-sm transition-all border ${
                    activeTab === item.id 
                      ? 'bg-cosmic-gold text-cosmic-bg border-cosmic-gold' 
                      : 'border-transparent text-gray-400 hover:bg-cosmic-accent/40 hover:text-white'
                  }`}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </nav>
            <div className="p-3 border border-cosmic-accent bg-cosmic-bg/50 rounded text-center">
              <div className="text-[10px] uppercase text-cosmic-gold tracking-widest font-bold">Sincronización</div>
              <div className="text-xl font-bold text-white mt-1">94.2%</div>
            </div>
          </aside>
        )}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
      <footer className="border-t border-cosmic-accent bg-cosmic-panel px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
        <div>"El Sol no solo ilumina — regula." — Alexander Chizhevsky</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-cosmic-gold border border-cosmic-gold/20 px-2 py-0.5 bg-cosmic-bg/40 font-bold">
            <Globe size={12} /> OPEN SOURCE
          </span>
        </div>
      </footer>
    </div>
  );
};
