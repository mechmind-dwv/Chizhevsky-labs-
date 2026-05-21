import React, { useState, useEffect } from 'react';
import { 
  fetchSolarCurrent, 
  fetchHistoricalEvents, 
  fetchNASASpaceWeather,
  fetchNASAFlares,
  fetchNAGAGeomagneticStorms,
  calculateExcitability 
} from '../services/api';
import { Sun, Zap, AlertTriangle, Activity, Satellite, Radio, Globe, Brain } from 'lucide-react';

const ML_API_URL = 'http://localhost:8001';

async function fetchMLPrediction(solarData: any) {
  try {
    const res = await fetch(`${ML_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sunspots: solarData?.sunspots || 142,
        solar_wind: solarData?.solar_wind || 485.2,
        kp_index: solarData?.kp_index || 4,
        flux_density: solarData?.flux_density || 172.4
      })
    });
    if (!res.ok) throw new Error('ML API error');
    return res.json();
  } catch (e) {
    return null;
  }
}

export const Dashboard: React.FC = () => {
  const [solarData, setSolarData] = useState<any>(null);
  const [nasaData, setNasaData] = useState<any>(null);
  const [flares, setFlares] = useState<any[]>([]);
  const [storms, setStorms] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [mlPrediction, setMlPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('offline');
  const [mlStatus, setMlStatus] = useState<'online' | 'offline'>('offline');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    try {
      const [solar, nasa, flaresData, stormsData, historical] = await Promise.all([
        fetchSolarCurrent(),
        fetchNASASpaceWeather(),
        fetchNASAFlares(3),
        fetchNAGAGeomagneticStorms(3),
        fetchHistoricalEvents(5)
      ]);

      setSolarData(solar.data);
      setNasaData(nasa.data);
      setFlares(flaresData.data || []);
      setStorms(stormsData.data || []);
      setEvents(historical.data || []);
      setApiStatus('online');

      // ML Prediction
      const ml = await fetchMLPrediction(solar.data);
      if (ml) {
        setMlPrediction(ml);
        setMlStatus('online');
      } else {
        setMlStatus('offline');
      }

      setLastUpdate(new Date().toLocaleTimeString());
    } catch (e) {
      setApiStatus('offline');
      setMlStatus('offline');
      setSolarData({ sunspots: 142, solar_wind: 485.2, kp_index: 4, flux_density: 172.4 });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-cosmic-accent pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">🌞 CHIZHEVSKY LABS</h1>
          <p className="text-xs text-cosmic-gold uppercase tracking-widest font-mono mt-1">
            Cosmic Biology Intelligence Dashboard — Fase Moscú
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-2 py-1 text-[10px] font-bold border ${
            mlStatus === 'online' 
              ? 'bg-purple-950/40 text-purple-400 border-purple-500/30' 
              : 'bg-gray-950/40 text-gray-500 border-gray-500/30'
          }`}>
            <Brain size={12} />
            {mlStatus === 'online' ? 'ML ONLINE' : 'ML OFFLINE'}
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold border ${
            apiStatus === 'online' 
              ? 'bg-green-950/40 text-green-400 border-green-500/30' 
              : 'bg-yellow-950/40 text-yellow-400 border-yellow-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
            {apiStatus === 'online' ? 'NASA DONKI ONLINE' : 'MODO OFFLINE'}
          </div>
          {lastUpdate && (
            <span className="text-[10px] text-gray-500 font-mono">{lastUpdate}</span>
          )}
        </div>
      </div>

      {/* Row 1: KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <WidgetKPI icon={<Sun size={16} />} label="Manchas" value={solarData?.sunspots || '—'} unit="" color="gold" loading={loading} />
        <WidgetKPI icon={<Activity size={16} />} label="Índice Kp" value={solarData?.kp_index || '—'} unit="/9" color={solarData?.kp_index >= 5 ? 'red' : 'green'} loading={loading} />
        <WidgetKPI icon={<Zap size={16} />} label="Viento Solar" value={solarData?.solar_wind || '—'} unit="km/s" color="blue" loading={loading} />
        <WidgetKPI icon={<Radio size={16} />} label="Flujo F10.7" value={solarData?.flux_density || '—'} unit="sfu" color="purple" loading={loading} />
        <WidgetKPI 
          icon={<Brain size={16} />} 
          label="Excitabilidad ML" 
          value={mlPrediction?.predicted_excitability || '—'} 
          unit="/10" 
          color={mlPrediction?.predicted_excitability >= 8 ? 'red' : mlPrediction?.predicted_excitability >= 6 ? 'yellow' : 'green'} 
          loading={loading || mlStatus === 'offline'}
          subtitle={mlPrediction?.confidence || ''}
        />
      </div>

      {/* Row 2: NASA + ML */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Alerta NASA */}
        <div className={`p-4 border ${
          nasaData?.alert_level === 'ALTA' ? 'border-red-500 bg-red-950/20' :
          nasaData?.alert_level === 'MODERADA' ? 'border-yellow-500 bg-yellow-950/20' :
          'border-green-500/30 bg-green-950/10'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Satellite size={14} className="text-cosmic-gold" />
            <h3 className="text-[10px] font-bold uppercase text-white tracking-wider">NASA Alerta</h3>
          </div>
          <div className={`text-lg font-bold ${
            nasaData?.alert_level === 'ALTA' ? 'text-red-400' : nasaData?.alert_level === 'MODERADA' ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {nasaData?.alert_level || '—'}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">{nasaData?.description || 'Sin datos'}</p>
          <div className="flex gap-3 mt-2 text-[9px] text-gray-500 font-mono">
            <span>🔥 {nasaData?.total_flares_72h || 0}</span>
            <span>🌊 {nasaData?.total_cmes_72h || 0}</span>
            <span>🧭 {nasaData?.total_storms_72h || 0}</span>
          </div>
        </div>

        {/* ML Prediction */}
        <div className={`p-4 border ${
          mlPrediction?.predicted_excitability >= 8 ? 'border-red-500 bg-red-950/20' :
          mlPrediction?.predicted_excitability >= 6 ? 'border-yellow-500 bg-yellow-950/20' :
          'border-green-500/30 bg-green-950/10'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} className="text-purple-400" />
            <h3 className="text-[10px] font-bold uppercase text-white tracking-wider">Predicción ML</h3>
          </div>
          {mlPrediction ? (
            <>
              <div className={`text-3xl font-mono font-bold ${
                mlPrediction.predicted_excitability >= 8 ? 'text-red-400' :
                mlPrediction.predicted_excitability >= 6 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {mlPrediction.predicted_excitability}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">{mlPrediction.interpretation}</div>
              <div className="text-[9px] text-gray-500 mt-1">
                R² = {mlPrediction.model_info?.r2?.toFixed(2) || '—'}
              </div>
            </>
          ) : (
            <div className="text-[10px] text-gray-500">ML API no detectada (puerto 8001)</div>
          )}
        </div>

        {/* Erupciones */}
        <div className="p-4 border border-cosmic-accent bg-cosmic-panel/60">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-orange-400" />
            <h3 className="text-[10px] font-bold uppercase text-white tracking-wider">Flares</h3>
          </div>
          {flares.length > 0 ? flares.slice(0, 3).map((f: any, i: number) => (
            <div key={i} className="flex justify-between py-1 border-b border-cosmic-accent/20 text-[10px]">
              <span className="text-gray-300 font-mono">{f.begin_time?.split('T')[0]}</span>
              <span className={`font-bold ${f.class_type?.startsWith('X') ? 'text-red-400' : f.class_type?.startsWith('M') ? 'text-yellow-400' : 'text-green-400'}`}>
                {f.class_type}
              </span>
            </div>
          )) : <p className="text-[10px] text-gray-500 font-mono">Sin erupciones</p>}
        </div>

        {/* Tormentas */}
        <div className="p-4 border border-cosmic-accent bg-cosmic-panel/60">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={14} className="text-blue-400" />
            <h3 className="text-[10px] font-bold uppercase text-white tracking-wider">Tormentas</h3>
          </div>
          {storms.length > 0 ? storms.slice(0, 3).map((s: any, i: number) => (
            <div key={i} className="flex justify-between py-1 border-b border-cosmic-accent/20 text-[10px]">
              <span className="text-gray-300 font-mono">{s.start_time?.split('T')[0]}</span>
              <span className={`font-bold ${s.max_kp_index >= 7 ? 'text-red-400' : s.max_kp_index >= 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                Kp {s.max_kp_index}
              </span>
            </div>
          )) : <p className="text-[10px] text-gray-500 font-mono">Sin tormentas</p>}
        </div>
      </div>

      {/* Row 3: Histórico + Excitabilidad rápida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-cosmic-accent bg-cosmic-panel/60">
          <h3 className="text-xs font-bold uppercase text-white tracking-wider mb-3">📜 Eventos Históricos</h3>
          {events.slice(0, 5).map((e: any, i: number) => (
            <div key={i} className="flex justify-between text-[10px] font-mono py-1 border-b border-cosmic-accent/10">
              <span className="text-cosmic-gold font-bold w-12">{e.year}</span>
              <span className="text-gray-300 flex-1 truncate mx-2">{e.event}</span>
              <span className={`font-bold ${e.estimated_excitability >= 8.5 ? 'text-red-400' : 'text-green-400'}`}>{e.estimated_excitability}</span>
            </div>
          ))}
        </div>
        <QuickExcitability apiStatus={apiStatus} />
      </div>

      {/* Footer */}
      <div className="border-t border-cosmic-accent pt-3 flex justify-between items-center text-[9px] text-gray-600 font-mono">
        <span>ML: I_eb = f(sunspots, solar_wind, Kp, flux) | R² = 0.71</span>
        <span>Chizhevsky, A.L. (1924)</span>
      </div>
    </div>
  );
};

const WidgetKPI: React.FC<{
  icon: React.ReactNode; label: string; value: string | number; unit: string; color: string; loading: boolean; subtitle?: string;
}> = ({ icon, label, value, unit, color, loading, subtitle }) => (
  <div className="bg-cosmic-panel p-3 border border-cosmic-accent relative overflow-hidden group hover:border-cosmic-gold/30 transition-colors">
    <div className="absolute right-2 top-1 opacity-10 group-hover:opacity-20">{icon}</div>
    <div className="text-[9px] text-gray-400 uppercase">{label}</div>
    <div className={`text-xl font-mono font-bold text-${color}-400`}>{loading ? '...' : value}{unit}</div>
    {subtitle && <div className="text-[8px] text-gray-500">{subtitle}</div>}
  </div>
);

const QuickExcitability: React.FC<{ apiStatus: string }> = ({ apiStatus }) => {
  const [mood, setMood] = useState(7);
  const [result, setResult] = useState<any>(null);
  const handleQuickCalc = async () => {
    try {
      const res = await calculateExcitability({ birth_date: '1995-06-15', chronotype: 'Intermediate', mood_rating: mood });
      setResult(res.data);
    } catch (e) {
      const idx = Math.min(10, Math.max(1, (4/9)*5*1.0 + mood*0.3));
      setResult({ excitability_index: parseFloat(idx.toFixed(2)), alert_level: idx > 6 ? 'ALTA' : 'BAJA' });
    }
  };
  return (
    <div className="p-4 border border-cosmic-accent bg-cosmic-panel/60">
      <h3 className="text-xs font-bold uppercase text-white tracking-wider mb-3">🧮 Excitabilidad Rápida</h3>
      <div className="flex items-center gap-3">
        <input type="range" min="1" max="10" value={mood} onChange={(e) => setMood(parseInt(e.target.value))} className="flex-1 accent-cosmic-gold" />
        <span className="text-cosmic-gold font-bold text-sm w-8">{mood}</span>
        <button onClick={handleQuickCalc} className="bg-cosmic-gold text-cosmic-bg text-[10px] font-bold px-3 py-1.5 uppercase hover:bg-yellow-500">Calcular</button>
      </div>
      {result && (
        <div className="mt-3 flex items-center gap-3 text-xs">
          <span className={`text-2xl font-mono font-bold ${result.excitability_index > 6 ? 'text-red-400' : 'text-cosmic-gold'}`}>{result.excitability_index}</span>
          <span className={`px-2 py-0.5 text-[10px] font-bold border ${result.alert_level === 'ALTA' ? 'text-red-400 border-red-500/30' : 'text-green-400 border-green-500/30'}`}>{result.alert_level}</span>
        </div>
      )}
    </div>
  );
};
