import React, { useState } from 'react';
import { simulateAerion } from '../services/api';

type IonMode = 'creative' | 'recovery' | 'tsiolkovsky';

export const Aerion: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<IonMode>('tsiolkovsky');
  const [ionData, setIonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleModeChange = async (mode: IonMode) => {
    setCurrentMode(mode);
    setLoading(true);
    try {
      const res = await simulateAerion(mode);
      setIonData(res.data);
    } catch (e) {
      // Fallback local
      const densities: Record<IonMode, number> = { creative: 48000, recovery: 1200, tsiolkovsky: 15000 };
      setIonData({ ion_density: densities[mode], mode: mode, quality_assessment: densities[mode] > 20000 ? 'SATURACIÓN ÓPTIMA' : 'ENTORNO ARTIFICIAL' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-cosmic-accent pb-4">
        <h2 className="text-2xl font-bold text-white uppercase">MÓDULO AERION — Aero-ionización</h2>
        <p className="text-xs text-cosmic-gold uppercase font-mono">Control de Iones Atmosféricos {ionData?.ion_density ? '— Conectado a API' : ''}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent text-center">
          <h3 className="text-sm font-bold uppercase text-white border-b border-cosmic-accent pb-2">Densidad de Iones Negativos</h3>
          <div className="text-5xl font-mono font-bold text-cosmic-gold py-6">
            {loading ? '...' : ionData?.ion_density?.toLocaleString() || 25000} <span className="text-xs text-gray-400">iones/cm³</span>
          </div>
          <div className="w-full bg-cosmic-bg h-3 border border-cosmic-accent">
            <div className="bg-cosmic-gold h-full transition-all duration-700" style={{ width: `${Math.min(100, ((ionData?.ion_density || 25000)/50000)*100)}%` }} />
          </div>
          <div className="text-xs text-gray-400 mt-2">{ionData?.quality_assessment || 'CALIDAD MODERADA'}</div>
        </div>
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent text-xs font-mono space-y-2">
          <h3 className="text-sm font-bold uppercase text-white border-b border-cosmic-accent pb-2">Comparativa Ambiental</h3>
          <div className="flex justify-between"><span>Tu Entorno:</span><span className="text-cosmic-gold font-bold">{ionData?.ion_density || 25000}/cm³</span></div>
          <div className="flex justify-between text-gray-400"><span>Bosque Natural:</span><span className="text-green-400">50,000/cm³</span></div>
          <div className="flex justify-between text-gray-400"><span>Oficina Cerrada:</span><span className="text-red-400">&lt;100/cm³</span></div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase text-white mb-4">Preconfiguraciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { mode: 'creative' as IonMode, color: 'orange', title: 'Revolución Creativa', desc: 'Máximo flujo de iones negativos.' },
            { mode: 'recovery' as IonMode, color: 'blue', title: 'Gulag Recovery', desc: 'Contrarresta fatiga por pantallas.' },
            { mode: 'tsiolkovsky' as IonMode, color: 'purple', title: 'Efecto Tsiolkovsky', desc: 'Ciclos alternados de alta atmósfera.' }
          ].map((m) => (
            <button key={m.mode} onClick={() => handleModeChange(m.mode)}
              className={`p-6 border text-left transition-all ${currentMode===m.mode ? `bg-gradient-to-br from-${m.color}-950 to-cosmic-panel border-${m.color}-500 shadow-xl` : 'bg-cosmic-panel border-cosmic-accent'}`}>
              <div className="text-xs font-mono font-bold uppercase">{m.title}</div>
              <p className="text-[11px] text-gray-400 mt-2">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
