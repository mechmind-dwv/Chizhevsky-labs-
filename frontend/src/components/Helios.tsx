import React, { useState, useEffect } from 'react';
import { fetchSolarCurrent, fetchHistoricalEvents, calculateExcitability } from '../services/api';

export const Helios: React.FC = () => {
  const [solarData, setSolarData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  
  const [formData, setFormData] = useState({
    birthDate: '1995-06-15',
    chronotype: 'Intermediate',
    moodRating: 7
  });
  const [result, setResult] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

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
      setApiConnected(true);
      console.log('✅ Conectado al backend — Datos reales');
    } catch (e) {
      console.log('⚠️ Backend no disponible — usando datos simulados');
      setSolarData({
        sunspots: 142, solar_wind: 485.2, kp_index: 4, flux_density: 172.4
      });
      setApiConnected(false);
    }
    setLoading(false);
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    try {
      const res = await calculateExcitability({
        birth_date: formData.birthDate,
        chronotype: formData.chronotype,
        mood_rating: formData.moodRating
      });
      setResult(res.data);
    } catch (e) {
      const cf = formData.chronotype === 'Owl' ? 1.2 : formData.chronotype === 'Lark' ? 0.9 : 1.0;
      const kp = solarData?.kp_index || 4;
      const idx = Math.min(10, Math.max(1, ((kp/9)*5*cf) + (formData.moodRating*0.3)));
      setResult({
        excitability_index: parseFloat(idx.toFixed(2)),
        alert_level: idx > 6 ? 'ALTA' : 'BAJA',
        formula: 'I_eb = (Kp/9 × 5 × α_crono) + (mood × 0.3) [LOCAL]'
      });
    }
    setCalculating(false);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-cosmic-accent pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">MÓDULO HELIOS — Inteligencia Solar</h2>
          <p className="text-xs text-cosmic-gold uppercase tracking-widest font-mono">
            {loading ? '⏳ Conectando...' : apiConnected ? '🟢 Backend conectado — Datos en tiempo real' : '🟡 Modo offline — Datos simulados'}
          </p>
        </div>
        <div className={`px-3 py-1 text-xs font-bold border ${apiConnected ? 'bg-green-950/40 text-green-400 border-green-500/30' : 'bg-yellow-950/40 text-yellow-400 border-yellow-500/30'}`}>
          {apiConnected ? 'API ONLINE' : 'MODO LOCAL'}
        </div>
      </div>

      {/* KPIs solares */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Manchas (R)", value: solarData?.sunspots, unit: "", icon: "☀️" },
          { label: "Viento Solar", value: solarData?.solar_wind, unit: "km/s", icon: "💨" },
          { label: "Índice Kp", value: solarData?.kp_index, unit: "/9", icon: "🧭" },
          { label: "Flujo F10.7", value: solarData?.flux_density, unit: "sfu", icon: "📡" }
        ].map((m, i) => (
          <div key={i} className="bg-cosmic-panel p-4 border border-cosmic-accent relative overflow-hidden">
            <div className="absolute right-2 top-1 opacity-20 text-2xl">{m.icon}</div>
            <div className="text-[10px] text-gray-400 uppercase">{m.label}</div>
            <div className="text-2xl font-mono font-bold text-white my-1">
              {loading ? '...' : m.value}{m.unit}
            </div>
          </div>
        ))}
      </div>

      {/* Calculadora + Resultado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cosmic-panel p-6 border border-cosmic-accent">
          <h3 className="text-sm font-bold uppercase text-cosmic-gold border-b border-cosmic-accent pb-2">
            🧮 Calculadora de Excitabilidad Biológica
          </h3>
          <form onSubmit={handleCalculate} className="space-y-4 text-xs mt-4">
            <div>
              <label className="block text-gray-400 uppercase font-mono mb-1">Fecha de Nacimiento</label>
              <input type="date" value={formData.birthDate} 
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="w-full bg-cosmic-bg border border-cosmic-accent p-2 rounded text-white font-mono focus:border-cosmic-gold" />
            </div>
            <div>
              <label className="block text-gray-400 uppercase font-mono mb-1">Cronotipo</label>
              <select value={formData.chronotype} 
                onChange={(e) => setFormData({...formData, chronotype: e.target.value})}
                className="w-full bg-cosmic-bg border border-cosmic-accent p-2 rounded text-white font-mono">
                <option value="Lark">🌅 Matutino (Alondra)</option>
                <option value="Intermediate">☀️ Intermedio</option>
                <option value="Owl">🦉 Nocturno (Búho)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 uppercase font-mono mb-1">
                Estado de Ánimo: <span className="text-cosmic-gold font-bold">{formData.moodRating}/10</span>
              </label>
              <input type="range" min="1" max="10" value={formData.moodRating}
                onChange={(e) => setFormData({...formData, moodRating: parseInt(e.target.value)})}
                className="w-full accent-cosmic-gold" />
            </div>
            <button type="submit" disabled={calculating}
              className="w-full bg-cosmic-gold text-cosmic-bg font-bold py-3 uppercase tracking-wider hover:bg-yellow-500 transition-colors disabled:opacity-50">
              {calculating ? '⏳ Calculando...' : 'Calcular Coeficiente Magnético-Biológico'}
            </button>
          </form>
        </div>

        <div className="bg-cosmic-panel p-6 border border-cosmic-accent flex flex-col justify-center">
          {result ? (
            <div className="text-center space-y-4">
              <div className="text-[11px] text-gray-400 uppercase tracking-widest">Índice de Excitabilidad Biológica</div>
              <div className={`text-6xl font-mono font-bold ${result.excitability_index > 6 ? 'text-red-400 animate-pulse' : 'text-cosmic-gold'}`}>
                {result.excitability_index}<span className="text-xs text-gray-400">/10</span>
              </div>
              <div className={`inline-block px-3 py-1 text-xs font-bold border ${result.alert_level === 'ALTA' ? 'text-red-400 border-red-500/30 bg-red-950/20' : 'text-green-400 border-green-500/30 bg-green-950/20'}`}>
                NIVEL: {result.alert_level}
              </div>
              {result.recommendation && (
                <p className="text-xs text-gray-300 max-w-xs mx-auto">{result.recommendation}</p>
              )}
              {result.formula && (
                <p className="text-[10px] text-gray-500 font-mono mt-2 border-t border-cosmic-accent pt-2">{result.formula}</p>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔬</div>
              <p className="text-xs text-gray-500 font-mono">
                {apiConnected 
                  ? 'Introduce tus parámetros biométricos para calcular el índice con datos reales del backend.'
                  : 'Introduce tus parámetros. El cálculo se hará localmente (backend no detectado).'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de eventos históricos */}
      <div className="bg-cosmic-panel p-4 border border-cosmic-accent">
        <h3 className="text-sm font-bold uppercase text-white mb-3">
          📜 Eventos Históricos — Base de datos Chizhevsky 
          <span className="text-[10px] text-gray-500 font-normal ml-2">
            ({events.length} eventos {apiConnected ? 'desde API' : 'locales'})
          </span>
        </h3>
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0">
              <tr className="border-b border-cosmic-accent text-cosmic-gold uppercase bg-cosmic-bg/80">
                <th className="p-2">Año</th>
                <th className="p-2">Fase Solar</th>
                <th className="p-2">Evento</th>
                <th className="p-2 text-center">Factor Chizhevsky</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? events.map((e: any) => (
                <tr key={e.id || e.year} className="border-b border-cosmic-accent/30 hover:bg-cosmic-bg/30 font-mono transition-colors">
                  <td className="p-2 text-white font-bold">{e.year}</td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${e.solar_phase === 'Maxima' ? 'bg-red-950/50 text-red-400 border border-red-500/20' : 'bg-blue-950/50 text-blue-400 border border-blue-500/20'}`}>
                      {e.solar_phase}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="font-bold text-gray-200">{e.event}</div>
                  </td>
                  <td className="p-2 text-center">
                    <span className={`font-bold ${e.estimated_excitability >= 8.5 ? 'text-red-400' : e.estimated_excitability >= 7 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {e.estimated_excitability}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500 font-mono">
                    {apiConnected ? '📡 Conectado al backend pero sin eventos. Verifica la base de datos.' : '🔌 Backend no detectado. Los eventos históricos requieren conexión a la API.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
