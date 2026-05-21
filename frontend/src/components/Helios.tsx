import React, { useState } from 'react';
import { historicalEvents } from '../data/historicalEvents';
import { SolarMetrics, UserMetrics } from '../types';

export const Helios: React.FC = () => {
  const [solarData] = useState<SolarMetrics>({
    sunspots: 142,
    solarWind: 485.2,
    kpIndex: 4,
    fluxDensity: 172.4
  });

  const [formData, setFormData] = useState<UserMetrics>({
    birthDate: '1995-06-15',
    chronotype: 'Intermediate',
    moodRating: 7
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
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-cosmic-accent pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">MÓDULO HELIOS — Inteligencia Solar Aplicada</h2>
          <p className="text-xs text-cosmic-gold uppercase tracking-widest font-mono">Monitoreo de Radiación e Índices de Actividad Coronal</p>
        </div>
        <div className="flex gap-2 text-xs font-mono">
          <span className="bg-green-950/40 text-green-400 px-3 py-1 border border-green-500/30">GEOMAGNETIC STATUS: NOMINAL</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Número de Manchas (R)", value: solarData.sunspots, status: "Ciclo Activo" },
          { label: "Viento Solar (V)", value: `${solarData.solarWind} km/s`, status: "Estable" },
          { label: "Índice Kp", value: `${solarData.kpIndex} / 9`, status: solarData.kpIndex > 6 ? "Tormenta" : "Tranquilo" },
          { label: "Flujo de Radio F10.7", value: `${solarData.fluxDensity} sfu`, status: "Alto" }
        ].map((metric, idx) => (
          <div key={idx} className="bg-cosmic-panel p-4 border border-cosmic-accent relative overflow-hidden">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{metric.label}</div>
            <div className="text-2xl font-mono font-bold text-white my-1">{metric.value}</div>
            <div className="text-[9px] text-cosmic-gold uppercase font-mono">{metric.status}</div>
            <div className="absolute right-2 bottom-1 opacity-10 text-4xl font-bold">☀️</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-cosmic-gold border-b border-cosmic-accent pb-2">
            Calculadora del Índice de Excitabilidad Biológica
          </h3>
          <form onSubmit={handleCalculate} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-gray-400 uppercase font-mono">Fecha de Nacimiento (Alineación de Ciclo)</label>
              <input 
                type="date" 
                value={formData.birthDate} 
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="w-full bg-cosmic-bg border border-cosmic-accent p-2 rounded text-white font-mono focus:outline-none focus:border-cosmic-gold"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-gray-400 uppercase font-mono">Cronotipo Humano</label>
              <select 
                value={formData.chronotype} 
                onChange={(e) => setFormData({...formData, chronotype: e.target.value as any})}
                className="w-full bg-cosmic-bg border border-cosmic-accent p-2 rounded text-white font-mono focus:outline-none focus:border-cosmic-gold"
              >
                <option value="Lark">Matutino (Alondra)</option>
                <option value="Intermediate">Intermedio</option>
                <option value="Owl">Nocturno (Búho)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-gray-400 uppercase font-mono">Estado de Ánimo Interno (1 - 10)</label>
              <input 
                type="range" min="1" max="10" 
                value={formData.moodRating}
                onChange={(e) => setFormData({...formData, moodRating: parseInt(e.target.value)})}
                className="w-full accent-cosmic-gold"
              />
              <div className="text-right text-cosmic-gold font-mono font-bold">{formData.moodRating}/10</div>
            </div>
            <button type="submit" className="w-full bg-cosmic-gold text-cosmic-bg font-bold py-3 uppercase tracking-wider font-mono transition-colors hover:bg-yellow-500">
              Calcular Coeficiente Magnético-Biológico
            </button>
          </form>
        </div>

        <div className="bg-cosmic-panel p-6 border border-cosmic-accent flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-cosmic-gold border-b border-cosmic-accent pb-2">
              Resultado del Análisis en Tiempo Real
            </h3>
            {calculatedIndex !== null ? (
              <div className="mt-6 text-center space-y-4">
                <div className="text-[11px] text-gray-400 uppercase tracking-widest">Índice Estimado de Afectación</div>
                <div className="text-6xl font-mono font-bold text-cosmic-solarRed animate-pulse">{calculatedIndex} <span className="text-xs text-gray-400">/ 10</span></div>
                <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto font-mono">
                  {calculatedIndex > 6 
                    ? "[ALERTA] Los campos geomagnéticos y tu perfil sugieren un estado de hiperexcitabilidad cortical. Se recomienda espaciar decisiones críticas."
                    : "[NORMAL] Sincronización óptima. Estabilidad homeostática frente a los flujos solares de fondo."
                  }
                </p>
              </div>
            ) : (
              <div className="text-center text-xs text-gray-500 py-12 font-mono">
                Introduce los parámetros biométricos para cruzar los datos del sistema nervioso con la telemetría del viento solar.
              </div>
            )}
          </div>
          <div className="text-[9px] text-gray-500 border-t border-cosmic-accent pt-2 italic">
            * Algoritmo inferido de los cuadernos de anotación de Kaluga (1920-1928). [SIMULADO EN ENTREGABLE]
          </div>
        </div>
      </div>

      <div className="bg-cosmic-panel p-4 border border-cosmic-accent">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-3">
          Historial de Eventos de la Biosfera (Análisis de Ciclos de Chizhevsky)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cosmic-accent text-cosmic-gold uppercase tracking-wider font-mono bg-cosmic-bg/60">
                <th className="p-2">Año</th>
                <th className="p-2">Fase Solar</th>
                <th className="p-2">Evento de Masas</th>
                <th className="p-2 text-center">Factor Chizhevsky</th>
              </tr>
            </thead>
            <tbody>
              {historicalEvents.map((event) => (
                <tr key={event.id} className="border-b border-cosmic-accent/40 hover:bg-cosmic-bg/40 font-mono transition-colors">
                  <td className="p-2 text-white font-bold">{event.year}</td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold ${event.solarPhase === 'Maxima' ? 'bg-red-950 text-red-400 border border-red-500/20' : 'bg-blue-950 text-blue-400'}`}>
                      {event.solarPhase}
                    </span>
                  </td>
                  <td className="p-2 max-w-md">
                    <div className="font-bold text-gray-200">{event.event}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{event.description}</div>
                  </td>
                  <td className="p-2 text-center text-cosmic-gold font-bold">{event.estimatedExcitability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
