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
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-cosmic-accent pb-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">MÓDULO AERION — Aero-ionización Terapéutica</h2>
        <p className="text-xs text-cosmic-gold uppercase tracking-widest font-mono">Control y Simulación Físico-Química de Iones Atmosféricos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-cosmic-accent pb-2">
            Densidad Actual de Iones Negativos (𝚽-)
          </h3>
          <div className="text-center py-6 relative">
            <div className="text-5xl font-mono font-bold text-cosmic-gold">{simulatedDensity.toLocaleString()} <span className="text-xs text-gray-400">iones/cm³</span></div>
            <div className="mt-2 text-xs text-gray-400 font-mono">
              Status: {simulatedDensity > 20000 ? "Saturación Óptima (Bosque de Alta Montaña)" : "Entorno Artificial Degradado"}
            </div>
            <div className="w-full bg-cosmic-bg h-3 border border-cosmic-accent mt-4 relative">
              <div 
                className="bg-cosmic-gold h-full transition-all duration-700 shadow-[0_0_10px_rgba(255,215,0,0.5)]" 
                style={{ width: `${Math.min(100, (simulatedDensity / 50000) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-cosmic-panel p-6 border border-cosmic-accent space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-cosmic-accent pb-2">
            Comparativa Ambiental de Referencia
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b border-cosmic-accent/40 pb-1">
              <span>Tu Entorno Actual (Simulado):</span>
              <span className="text-cosmic-gold font-bold">{simulatedDensity} /cm³</span>
            </div>
            <div className="flex justify-between border-b border-cosmic-accent/40 pb-1 text-gray-400">
              <span>Bosque Natural / Cascada Prístina:</span>
              <span className="text-green-400">50,000 /cm³</span>
            </div>
            <div className="flex justify-between border-b border-cosmic-accent/40 pb-1 text-gray-400">
              <span>Oficina Metropolitana Cerrada:</span>
              <span className="text-red-400">&lt; 100 /cm³</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Preconfiguraciones de Flujo Ionosférico</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleModeChange('CREATIVE')}
            className={`p-6 border text-left transition-all ${
              currentMode === 'CREATIVE' 
                ? 'bg-gradient-to-br from-orange-950 to-cosmic-panel border-orange-500 shadow-xl' 
                : 'bg-cosmic-panel border-cosmic-accent hover:border-orange-500/50'
            }`}
          >
            <div className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">MODE 01</div>
            <div className="text-lg font-bold text-white uppercase mt-1">Revolución Creativa</div>
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-mono">
              Maximiza el flujo de aero-iones negativos para aumentar la absorción celular de oxígeno y catalizar picos cognitivos.
            </p>
          </button>

          <button 
            onClick={() => handleModeChange('GULAG_RECOVERY')}
            className={`p-6 border text-left transition-all ${
              currentMode === 'GULAG_RECOVERY' 
                ? 'bg-gradient-to-br from-blue-950 to-cosmic-panel border-blue-500 shadow-xl' 
                : 'bg-cosmic-panel border-cosmic-accent hover:border-blue-500/50'
            }`}
          >
            <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">MODE 02</div>
            <div className="text-lg font-bold text-white uppercase mt-1">Gulag Recovery</div>
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-mono">
              Inyección balanceada diseñada para contrarrestar dolores de cabeza producidos por la acumulación estática de iones positivos de pantallas electrónicas modernas.
            </p>
          </button>

          <button 
            onClick={() => handleModeChange('TSIOLKOVSKY')}
            className={`p-6 border text-left transition-all ${
              currentMode === 'TSIOLKOVSKY' 
                ? 'bg-gradient-to-br from-purple-950 to-cosmic-panel border-purple-500 shadow-xl' 
                : 'bg-cosmic-panel border-cosmic-accent hover:border-purple-500/50'
            }`}
          >
            <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">MODE 03</div>
            <div className="text-lg font-bold text-white uppercase mt-1">Efecto Tsiolkovsky</div>
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-mono">
              Ciclos automatizados que alternan la intensidad de carga emulando variaciones de la alta atmósfera y vuelos estratosféricos.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
