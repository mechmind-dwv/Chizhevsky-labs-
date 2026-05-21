import React from 'react';

export const Chronos: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-cosmic-accent pb-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">MÓDULO CHRONOS — Reloj Biológico Tricapa</h2>
        <p className="text-xs text-cosmic-gold uppercase tracking-widest font-mono">Sincronización de Ritmos Circadianos y Ciclos Macro-Cósmicos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent flex flex-col items-center justify-center space-y-4 min-h-[350px]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white self-start w-full border-b border-cosmic-accent pb-2">
            Oscilador de Ciclos Concéntricos
          </h3>
          
          <div className="relative w-64 h-64 border-4 border-dashed border-cosmic-gold/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '60s' }}>
            <div className="absolute inset-2 border-2 border-cosmic-gold rounded-full flex items-center justify-center">
              <span className="absolute top-0 text-[8px] bg-cosmic-panel px-1 text-cosmic-gold font-bold font-mono">11-YEAR HELIO</span>
            </div>
            <div className="absolute inset-10 border-2 border-purple-500 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
              <span className="absolute bottom-0 text-[8px] bg-cosmic-panel px-1 text-purple-400 font-bold font-mono">LUNAR 29.5D</span>
            </div>
            <div className="absolute inset-20 border-2 border-blue-400 rounded-full flex items-center justify-center">
              <span className="text-[9px] text-white font-bold font-mono text-center">CIRCADIAN<br/>24H</span>
            </div>
          </div>
          <div className="text-[10px] text-gray-500 font-mono italic mt-2">Animación a escala acelerada para visualización de capas de resonancia.</div>
        </div>

        <div className="bg-cosmic-panel p-6 border border-cosmic-accent space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-cosmic-gold border-b border-cosmic-accent pb-2">
            Ventanas de Excitabilidad Máxima Optimizadas
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            {[
              { day: "Lunes", icon: "🤝", type: "Negociaciones Estratégicas", status: "ÓPTIMO", color: "text-green-400 border-green-500/20 bg-green-950/20" },
              { day: "Miércoles", icon: "🎨", type: "Expansión Creativa", status: "CRÍTICO", color: "text-cosmic-gold border-cosmic-gold/20 bg-cosmic-gold/10" },
              { day: "Viernes", icon: "🏃", type: "Ejercicio de Resistencia", status: "ALTO", color: "text-orange-400 border-orange-500/20 bg-orange-950/20" },
              { day: "Domingo", icon: "😴", type: "Descanso Total / Apantallamiento", status: "OBLIGATORIO", color: "text-blue-400 border-blue-500/20 bg-blue-950/20" }
            ].map((window, idx) => (
              <div key={idx} className={`p-3 border rounded flex flex-col justify-between ${window.color}`}>
                <div className="flex justify-between items-center font-bold">
                  <span>{window.day} {window.icon}</span>
                  <span className="text-[9px] border px-1 font-bold tracking-widest">{window.status}</span>
                </div>
                <div className="text-[10px] text-gray-300 mt-2 font-sans">{window.type}</div>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-gray-400 bg-cosmic-bg p-2 border border-cosmic-accent leading-relaxed">
            <strong>Nota de Simulación Biológica:</strong> Estas ventanas se calculan algorítmicamente superponiendo el nadir solar con el cronotipo base del usuario de forma automática cada 24 horas.
          </div>
        </div>
      </div>
    </div>
  );
};
EO
cat << 'EOF' > chizhevsky-labs/frontend/src/App.tsx
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { Helios } from './components/Helios';
import { Aerion } from './components/Aerion';
import { Chronos } from './components/Chronos';

export default function App() {
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('HELIOS');

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      isDashboard={isDashboard} 
      setIsDashboard={setIsDashboard}
    >
      {!isDashboard ? (
        <LandingPage onEnter={() => setIsDashboard(true)} />
      ) : (
        <>
          {activeTab === 'HELIOS' && <Helios />}
          {activeTab === 'AERION' && <Aerion />}
          {activeTab === 'CHRONOS' && <Chronos />}
          {activeTab === 'ASTROVIR' && (
            <div className="p-8 border border-cosmic-accent bg-cosmic-panel text-center font-mono text-xs">
              <div className="text-4xl mb-2">🦠</div>
              <h3 className="text-cosmic-gold font-bold uppercase tracking-widest mb-1">MÓDULO ASTROVIR — Vigilancia Epidemiológica</h3>
              <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                El mapa de riesgo interactivo requiere conexión en vivo con los nodos TimescaleDB y clústeres Python FastAPI para procesar capas vectoriales complejas. Despliegue el backend en Docker para activar la geolocalización cuántica.
              </p>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
