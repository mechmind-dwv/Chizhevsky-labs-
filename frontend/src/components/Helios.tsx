import React, { useState, useEffect } from 'react';
import { fetchSolarCurrent, fetchHistoricalEvents, calculateExcitability } from '../services/api';
import { SolarMetrics, UserMetrics, HistoricalEvent } from '../types';

export const Helios: React.FC = () => {
  const [solarData, setSolarData] = useState<SolarMetrics>({
    sunspots: 0, solarWind: 0, kpIndex: 0, fluxDensity: 0
  });
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UserMetrics>({
    birthDate: '1995-06-15', chronotype: 'Intermediate', moodRating: 7
  });
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [solar, historical] = await Promise.all([
        fetchSolarCurrent(),
        fetchHistoricalEvents(10)
      ]);
      setSolarData(solar.data);
      setEvents(historical.data);
    } catch (e) {
      console.log('Usando datos simulados (backend no disponible)');
      setSolarData({ sunspots: 142, solarWind: 485.2, kpIndex: 4, fluxDensity: 172.4 });
      setEvents([]);
    }
    setLoading(false);
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await calculateExcitability({
        birth_date: formData.birthDate,
        chronotype: formData.chronotype,
        mood_rating: formData.moodRating
      });
      setResult(res.data);
    } catch (e) {
      // Fallback a cálculo local
      const cf = formData.chronotype === 'Owl' ? 1.2 : formData.chronotype === 'Lark' ? 0.9 : 1.0;
      const idx = Math.min(10, Math.max(1, ((solarData.kpIndex/9)*5*cf) + (formData.moodRating*0.3)));
      setResult({ excitability_index: parseFloat(idx.toFixed(2)), alert_level: idx > 6 ? 'ALTA' : 'BAJA', formula: 'I_eb = (Kp/9 × 5 × α_crono) + (mood × 0.3)' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-cosmic-accent pb-4">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">MÓDULO HELIOS — Inteligencia Solar</h2>
        <p className="text-xs text-cosmic-gold uppercase tracking-widest font-mono">
          {loading ? 'Conectando a NOAA SWPC...' : 'Monitoreo de Actividad Coronal — Datos en tiempo real'}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Manchas (R)", value: solarData.sunspots, unit: "" },
          { label: "Viento Solar", value: solarData.solarWind, unit: "km/s" },
          { label: "Índice Kp", value: `${solarData.kpIndex}`, unit: "/9" },
          { label: "Flujo F10.7", value: solarData.fluxDensity, unit: "sfu" }
        ].map((m, i) => (
          <div key={i} className="bg-cosmic-panel p-4 border border-cosmic-accent">
            <div className="text-[10px] text-gray-400 uppercase">{m.label}</div>
            <div className="text-2xl font-mono font-bold text-white my-1">{m.value}{m.unit}</div>
          </div>
        ))}
      </div>

      {/* Calculadora */}
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
          {result ? (
            <div className="text-center space-y-4">
              <div className="text-[11px] text-gray-400 uppercase">Índice de Excitabilidad</div>
              <div className="text-6xl font-mono font-bold text-cosmic-solarRed">{result.excitability_index}<span className="text-xs text-gray-400">/10</span></div>
              <div className={`text-sm font-bold ${result.alert_level === 'ALTA' ? 'text-red-400' : 'text-green-400'}`}>NIVEL: {result.alert_level}</div>
              <p className="text-xs text-gray-300">{result.recommendation || (result.excitability_index > 6 ? 'Hiperexcitabilidad cortical detectada.' : 'Sincronización óptima.')}</p>
              {result.formula && <p className="text-[10px] text-gray-500 font-mono mt-2">{result.formula}</p>}
            </div>
          ) : (
            <div className="text-center text-xs text-gray-500 py-12">Introduce parámetros para calcular el índice.</div>
          )}
        </div>
      </div>

      {/* Tabla histórica */}
      <div className="bg-cosmic-panel p-4 border border-cosmic-accent">
        <h3 className="text-sm font-bold uppercase text-white mb-3">Eventos Históricos (Análisis Chizhevsky) — Desde API</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-cosmic-accent text-cosmic-gold uppercase bg-cosmic-bg/60">
                <th className="p-2">Año</th><th className="p-2">Fase Solar</th><th className="p-2">Evento</th><th className="p-2 text-center">Factor</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? events.map((e: any) => (
                <tr key={e.id || e.year} className="border-b border-cosmic-accent/40 hover:bg-cosmic-bg/40 font-mono">
                  <td className="p-2 text-white font-bold">{e.year}</td>
                  <td className="p-2"><span className={`px-2 py-0.5 text-[10px] font-bold ${e.solar_phase==='Maxima'?'bg-red-950 text-red-400':'bg-blue-950 text-blue-400'}`}>{e.solar_phase}</span></td>
                  <td className="p-2"><div className="font-bold text-gray-200">{e.event}</div></td>
                  <td className="p-2 text-center text-cosmic-gold font-bold">{e.estimated_excitability}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">Conecta el backend en puerto 8000 para ver 50 eventos históricos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
