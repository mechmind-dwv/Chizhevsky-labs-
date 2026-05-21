import React, { useState } from 'react';
import { historicalEvents } from '../data/historicalEvents';
import { SolarMetrics, UserMetrics } from '../types';

export const Helios: React.FC = () => {
  const [solarData] = useState<SolarMetrics>({
    sunspots: 142, solarWind: 485.2, kpIndex: 4, fluxDensity: 172.4
  });
  const [formData, setFormData] = useState<UserMetrics>({
    birthDate: '1995-06-15', chronotype: 'Intermediate', moodRating: 7
  });
  const [calculatedIndex, setCalculatedIndex] = useState<number | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const chronotypeFactor = formData.chronotype === 'Owl' ? 1.2 : formData.chronotype === 'Lark' ? 0.9 : 1.0;
    const baseKpEffect = (solarData.kpIndex / 9) * 5;
    const calculated = Math.min(10, Math.max(1, (baseKpEffect * chronotypeFactor) + (formData.moodRating * 0.3)));
    setCalculatedIndex(parseFloat(calculated.toFixed(2)));
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-cosmic-accent pb-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">MÓDULO HELIOS — Inteligencia Solar</h2>
        <p className="text-xs text-cosmic-gold uppercase tracking-widest font-mono">Monitoreo de Actividad Coronal</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Manchas (R)", value: solarData.sunspots, status: "Ciclo Activo" },
          { label: "Viento Solar", value: `${solarData.solarWind} km/s`, status: "Estable" },
          { label: "Índice Kp", value: `${solarData.kpIndex}/9`, status: "Tranquilo" },
          { label: "Flujo F10.7", value: `${solarData.fluxDensity} sfu`, status: "Alto" }
        ].map((m, i) => (
          <div key={i} className="bg-cosmic-panel p-4 border border-cosmic-accent">
            <div className="text-[10px] text-gray-400 uppercase">{m.label}</div>
            <div className="text-2xl font-mono font-bold text-white my-1">{m.value}</div>
            <div className="text-[9px] text-cosmic-gold uppercase font-mono">{m.status}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent">
          <h3 className="text-sm font-bold uppercase text-cosmic-gold border-b border-cosmic-accent pb-2">Calculadora de Excitabilidad Biológica</h3>
          <form onSubmit={handleCalculate} className="space-y-4 text-xs mt-4">
            <div>
              <label className="block text-gray-400 uppercase font-mono">Fecha de Nacimiento</label>
              <input type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} className="w-full bg-cosmic-bg border border-cosmic-accent p-2 rounded text-white font-mono" />
            </div>
            <div>
              <label className="block text-gray-400 uppercase font-mono">Cronotipo</label>
              <select value={formData.chronotype} onChange={(e) => setFormData({...formData, chronotype: e.target.value as any})} className="w-full bg-cosmic-bg border border-cosmic-accent p-2 rounded text-white font-mono">
                <option value="Lark">Matutino (Alondra)</option>
                <option value="Intermediate">Intermedio</option>
                <option value="Owl">Nocturno (Búho)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 uppercase font-mono">Estado de Ánimo (1-10)</label>
              <input type="range" min="1" max="10" value={formData.moodRating} onChange={(e) => setFormData({...formData, moodRating: parseInt(e.target.value)})} className="w-full accent-cosmic-gold" />
              <div className="text-right text-cosmic-gold font-bold">{formData.moodRating}/10</div>
            </div>
            <button type="submit" className="w-full bg-cosmic-gold text-cosmic-bg font-bold py-3 uppercase tracking-wider">Calcular Coeficiente</button>
          </form>
        </div>
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent flex flex-col justify-center">
          {calculatedIndex !== null ? (
            <div className="text-center space-y-4">
              <div className="text-[11px] text-gray-400 uppercase">Índice de Afectación</div>
              <div className="text-6xl font-mono font-bold text-cosmic-solarRed">{calculatedIndex}<span className="text-xs text-gray-400">/10</span></div>
              <p className="text-xs text-gray-300">{calculatedIndex > 6 ? "[ALERTA] Hiperexcitabilidad cortical." : "[NORMAL] Sincronización óptima."}</p>
            </div>
          ) : (
            <div className="text-center text-xs text-gray-500 py-12">Introduce parámetros para calcular el índice.</div>
          )}
        </div>
      </div>
      <div className="bg-cosmic-panel p-4 border border-cosmic-accent">
        <h3 className="text-sm font-bold uppercase text-white mb-3">Eventos Históricos (Análisis Chizhevsky)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-cosmic-accent text-cosmic-gold uppercase bg-cosmic-bg/60">
                <th className="p-2">Año</th><th className="p-2">Fase Solar</th><th className="p-2">Evento</th><th className="p-2 text-center">Factor</th>
              </tr>
            </thead>
            <tbody>
              {historicalEvents.map((e) => (
                <tr key={e.id} className="border-b border-cosmic-accent/40 hover:bg-cosmic-bg/40 font-mono">
                  <td className="p-2 text-white font-bold">{e.year}</td>
                  <td className="p-2"><span className={`px-2 py-0.5 text-[10px] font-bold ${e.solarPhase==='Maxima'?'bg-red-950 text-red-400':'bg-blue-950 text-blue-400'}`}>{e.solarPhase}</span></td>
                  <td className="p-2"><div className="font-bold text-gray-200">{e.event}</div><div className="text-[10px] text-gray-500">{e.description}</div></td>
                  <td className="p-2 text-center text-cosmic-gold font-bold">{e.estimatedExcitability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
