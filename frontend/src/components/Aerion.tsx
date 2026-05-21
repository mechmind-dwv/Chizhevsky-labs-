import React, { useState, useEffect } from 'react';
import { simulateAerion } from '../services/api';

type IonMode = 'creative' | 'recovery' | 'tsiolkovsky';

export const Aerion: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<IonMode>('tsiolkovsky');
  const [ionData, setIonData] = useState<any>({
    ion_density: 25000,
    quality_assessment: 'CALIDAD MODERADA',
    mode: 'Efecto Tsiolkovsky'
  });
  const [apiConnected, setApiConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleModeChange('tsiolkovsky');
  }, []);

  const handleModeChange = async (mode: IonMode) => {
    setCurrentMode(mode);
    setLoading(true);
    try {
      const res = await simulateAerion(mode);
      setIonData(res.data);
      setApiConnected(true);
    } catch (e) {
      const densities: Record<IonMode, any> = {
        creative: { ion_density: 48000, mode: 'Revolución Creativa', quality_assessment: 'SATURACIÓN ÓPTIMA' },
        recovery: { ion_density: 1200, mode: 'Gulag Recovery', quality_assessment: 'ENTORNO ARTIFICIAL' },
        tsiolkovsky: { ion_density: 15000, mode: 'Efecto Tsiolkovsky', quality_assessment: 'CALIDAD MODERADA' }
      };
      setIonData(densities[mode]);
      setApiConnected(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-cosmic-accent pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase">MÓDULO AERION — Aero-ionización</h2>
          <p className="text-xs text-cosmic-gold uppercase font-mono">
            {apiConnected ? '🟢 Backend conectado' : '🟡 Modo local'}
          </p>
        </div>
        <div className={`px-3 py-1 text-xs font-bold border ${apiConnected ? 'bg-green-950/40 text-green-400 border-green-500/30' : 'bg-yellow-950/40 text-yellow-400 border-yellow-500/30'}`}>
          {apiConnected ? 'API ONLINE' : 'MODO LOCAL'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent text-center">
          <h3 className="text-sm font-bold uppercase text-white border-b border-cosmic-accent pb-2">Densidad de Iones Negativos</h3>
          <div className="text-5xl font-mono font-bold text-cosmic-gold py-6">
            {loading ? '...' : ionData?.ion_density?.toLocaleString()} <span className="text-xs text-gray-400">iones/cm³</span>
          </div>
          <div className="w-full bg-cosmic-bg h-3 border border-cosmic-accent">
            <div className="bg-cosmic-gold h-full transition-all duration-700 shadow-[0_0_10px_rgba(255,215,0,0.3)]" 
              style={{ width: `${Math.min(100, ((ionData?.ion_density || 25000)/50000)*100)}%` }} />
          </div>
          <div className="text-xs text-gray-400 mt-2 font-mono">{ionData?.quality_assessment || 'CALIDAD MODERADA'}</div>
        </div>
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent text-xs font-mono space-y-2">
          <h3 className="text-sm font-bold uppercase text-white border-b border-cosmic-accent pb-2">Comparativa Ambiental</h3>
          <div className="flex justify-between border-b border-cosmic-accent/30 pb-1"><span>Tu Entorno Actual:</span><span className="text-cosmic-gold font-bold">{ionData?.ion_density || 25000}/cm³</span></div>
          <div className="flex justify-between border-b border-cosmic-accent/30 pb-1"><span>🌲 Bosque Natural:</span><span className="text-green-400">50,000/cm³</span></div>
          <div className="flex justify-between"><span>🏢 Oficina Cerrada:</span><span className="text-red-400">&lt;100/cm³</span></div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase text-white mb-4">⚡ Preconfiguraciones de Flujo Ionosférico</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { mode: 'creative' as IonMode, color: 'orange', icon: '🔥', title: 'Revolución Creativa', desc: 'Máximo flujo de iones negativos para picos cognitivos.' },
            { mode: 'recovery' as IonMode, color: 'blue', icon: '🧘', title: 'Gulag Recovery', desc: 'Contrarresta fatiga por pantallas electrónicas.' },
            { mode: 'tsiolkovsky' as IonMode, color: 'purple', icon: '🚀', title: 'Efecto Tsiolkovsky', desc: 'Ciclos alternados de alta atmósfera.' }
          ].map((m) => (
            <button key={m.mode} onClick={() => handleModeChange(m.mode)}
              className={`p-6 border text-left transition-all ${currentMode === m.mode ? `bg-gradient-to-br from-${m.color}-950 to-cosmic-panel border-${m.color}-500 shadow-xl` : 'bg-cosmic-panel border-cosmic-accent hover:border-cosmic-gold/50'}`}>
              <div className="text-2xl mb-2">{m.icon}</div>
              <div className="text-sm font-bold text-white uppercase">{m.title}</div>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
