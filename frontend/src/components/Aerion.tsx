import React, { useState } from 'react';

type IonMode = 'CREATIVE' | 'GULAG_RECOVERY' | 'TSIOLKOVSKY';

export const Aerion: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<IonMode>('TSIOLKOVSKY');
  const [simulatedDensity, setSimulatedDensity] = useState<number>(25000);

  const handleModeChange = (mode: IonMode) => {
    setCurrentMode(mode);
    if (mode === 'CREATIVE') setSimulatedDensity(48000);
    else if (mode === 'GULAG_RECOVERY') setSimulatedDensity(1200);
    else setSimulatedDensity(15000);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-cosmic-accent pb-4">
        <h2 className="text-2xl font-bold text-white uppercase">MÓDULO AERION — Aero-ionización</h2>
        <p className="text-xs text-cosmic-gold uppercase font-mono">Control de Iones Atmosféricos</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent text-center">
          <h3 className="text-sm font-bold uppercase text-white border-b border-cosmic-accent pb-2">Densidad de Iones Negativos</h3>
          <div className="text-5xl font-mono font-bold text-cosmic-gold py-6">{simulatedDensity.toLocaleString()} <span className="text-xs text-gray-400">iones/cm³</span></div>
          <div className="w-full bg-cosmic-bg h-3 border border-cosmic-accent">
            <div className="bg-cosmic-gold h-full transition-all duration-700" style={{ width: `${Math.min(100,(simulatedDensity/50000)*100)}%` }} />
          </div>
        </div>
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent text-xs font-mono space-y-2">
          <h3 className="text-sm font-bold uppercase text-white border-b border-cosmic-accent pb-2">Comparativa Ambiental</h3>
          <div className="flex justify-between"><span>Tu Entorno:</span><span className="text-cosmic-gold font-bold">{simulatedDensity}/cm³</span></div>
          <div className="flex justify-between text-gray-400"><span>Bosque Natural:</span><span className="text-green-400">50,000/cm³</span></div>
          <div className="flex justify-between text-gray-400"><span>Oficina Cerrada:</span><span className="text-red-400">&lt;100/cm³</span></div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase text-white mb-4">Preconfiguraciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { mode: 'CREATIVE' as IonMode, color: 'orange', title: 'Revolución Creativa', desc: 'Máximo flujo de iones negativos para picos cognitivos.' },
            { mode: 'GULAG_RECOVERY' as IonMode, color: 'blue', title: 'Gulag Recovery', desc: 'Contrarresta fatiga por pantallas electrónicas.' },
            { mode: 'TSIOLKOVSKY' as IonMode, color: 'purple', title: 'Efecto Tsiolkovsky', desc: 'Ciclos alternados emulando alta atmósfera.' }
          ].map((m) => (
            <button key={m.mode} onClick={() => handleModeChange(m.mode)}
              className={`p-6 border text-left transition-all ${currentMode===m.mode ? `bg-gradient-to-br from-${m.color}-950 to-cosmic-panel border-${m.color}-500 shadow-xl` : 'bg-cosmic-panel border-cosmic-accent hover:border-${m.color}-500/50'}`}>
              <div className={`text-xs font-mono font-bold text-${m.color}-400 uppercase`}>MODE</div>
              <div className="text-lg font-bold text-white uppercase mt-1">{m.title}</div>
              <p className="text-[11px] text-gray-400 mt-2">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
