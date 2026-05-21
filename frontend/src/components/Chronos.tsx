import React from 'react';

export const Chronos: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="border-b border-cosmic-accent pb-4">
        <h2 className="text-2xl font-bold text-white uppercase">MÓDULO CHRONOS — Reloj Biológico Tricapa</h2>
        <p className="text-xs text-cosmic-gold uppercase font-mono">Sincronización de Ritmos Cósmicos</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent flex flex-col items-center min-h-[350px]">
          <h3 className="text-xs font-bold uppercase text-white w-full border-b border-cosmic-accent pb-2">Oscilador de Ciclos</h3>
          <div className="relative w-64 h-64 border-4 border-dashed border-cosmic-gold/20 rounded-full flex items-center justify-center mt-4" style={{animation:'spin 60s linear infinite'}}>
            <div className="absolute inset-2 border-2 border-cosmic-gold rounded-full flex items-center justify-center">
              <span className="absolute top-0 text-[8px] bg-cosmic-panel px-1 text-cosmic-gold font-bold">11-YEAR HELIO</span>
            </div>
            <div className="absolute inset-10 border-2 border-purple-500 rounded-full flex items-center justify-center" style={{animation:'spin 30s linear infinite reverse'}}>
              <span className="absolute bottom-0 text-[8px] bg-cosmic-panel px-1 text-purple-400 font-bold">LUNAR 29.5D</span>
            </div>
            <div className="absolute inset-20 border-2 border-blue-400 rounded-full flex items-center justify-center">
              <span className="text-[9px] text-white font-bold text-center">CIRCADIAN<br/>24H</span>
            </div>
          </div>
        </div>
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent">
          <h3 className="text-sm font-bold uppercase text-cosmic-gold border-b border-cosmic-accent pb-2">Ventanas de Excitabilidad</h3>
          <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
            {[
              { day: "Lunes", icon: "🤝", type: "Negociaciones", status: "ÓPTIMO", color: "text-green-400 border-green-500/20 bg-green-950/20" },
              { day: "Miércoles", icon: "🎨", type: "Creatividad", status: "CRÍTICO", color: "text-cosmic-gold border-cosmic-gold/20 bg-cosmic-gold/10" },
              { day: "Viernes", icon: "🏃", type: "Ejercicio", status: "ALTO", color: "text-orange-400 border-orange-500/20 bg-orange-950/20" },
              { day: "Domingo", icon: "😴", type: "Descanso", status: "OBLIGATORIO", color: "text-blue-400 border-blue-500/20 bg-blue-950/20" }
            ].map((w, i) => (
              <div key={i} className={`p-3 border rounded ${w.color}`}>
                <div className="flex justify-between font-bold"><span>{w.day} {w.icon}</span><span className="text-[9px] border px-1">{w.status}</span></div>
                <div className="text-[10px] text-gray-300 mt-2">{w.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
