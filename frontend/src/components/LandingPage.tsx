import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-24">
      <section className="text-center space-y-6 relative py-20 border border-cosmic-accent bg-gradient-to-b from-cosmic-panel to-cosmic-bg p-8 shadow-2xl">
        <div className="absolute top-4 left-4 text-[11px] text-cosmic-gold/50 font-bold uppercase tracking-widest">LABORATORIO DE HELIOBIOLOGÍA DE KALUGA</div>
        <div className="text-6xl md:text-8xl text-center font-bold tracking-tighter text-white animate-pulse">☀️</div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white uppercase">CHIZHEVSKY LABS</h1>
        <p className="text-xl text-cosmic-gold font-bold tracking-widest uppercase max-w-2xl mx-auto">"El Sol no solo ilumina — regula."</p>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          Ecosistema analítico avanzado basado en los postulados de Alexander Chizhevsky.
        </p>
        <div className="pt-6">
          <button 
            onClick={onEnter}
            className="bg-cosmic-gold hover:bg-yellow-500 text-cosmic-bg font-bold text-sm px-8 py-4 uppercase tracking-widest transition-transform transform hover:scale-105 inline-flex items-center gap-2"
          >
            Iniciar Monitorización Cósmica <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-b border-cosmic-gold/30 inline-block pb-2">Cronología del Fundador (1897 - 1964)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { year: "1897", title: "Nacimiento en Grodno", desc: "Nace Alexander Leonidovich Chizhevsky." },
            { year: "1915", title: "Teoría Heliobiológica", desc: "Observaciones de manchas solares y brotes de cólera." },
            { year: "1924", title: "Tratado Fundamental", desc: "Factores Físicos del Proceso Histórico." },
            { year: "1939", title: "Aero-ionización", desc: "Director del Laboratorio Central de Aero-ionización." }
          ].map((evt, idx) => (
            <div key={idx} className="bg-cosmic-panel p-4 border-l-4 border-cosmic-gold">
              <div className="text-2xl font-bold text-cosmic-gold font-mono mb-1">{evt.year}</div>
              <div className="text-sm font-bold text-white mb-2 uppercase">{evt.title}</div>
              <div className="text-xs text-gray-400">{evt.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-b border-cosmic-gold/30 inline-block pb-2">Los Cuatro Pilares Científicos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: "☀️", title: "HELIOBIOLOGÍA", desc: "Modelado del ciclo de Schwabe (11 años) y su impacto en sistemas nerviosos a escala macro-poblacional." },
            { icon: "⚡", title: "AERO-IONIZACIÓN", desc: "Dispersión controlada de aero-iones negativos. Densidades óptimas de bosques prístinos." },
            { icon: "🦠", title: "ASTROVIROLOGÍA", desc: "Mapeo de mutaciones patogénicas vinculadas a eyecciones de masa coronal (CME)." },
            { icon: "⏳", title: "CRONOBIOLOGÍA", desc: "Unificación de relojes circadianos con ritmos orbitales cosmológicos." }
          ].map((p, idx) => (
            <div key={idx} className="border border-cosmic-accent p-6 bg-cosmic-panel/60">
              <h3 className="text-lg font-bold text-cosmic-gold mb-2">{p.icon} {p.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-b border-cosmic-gold/30 inline-block pb-2">Niveles de Infraestructura</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Nivel 1: KALUGA", price: "Libre", desc: "Datos históricos, feeds NOAA SWPC y calculadora estática." },
            { name: "Nivel 2: TSIOLKOVSKY", price: "$45/mes", desc: "Predicciones avanzadas, simulación de aero-iones en tiempo real." },
            { name: "Nivel 3: CHIZHEVSKY COMPLETE", price: "Enterprise", desc: "Controlador IoT industrial, API TimescaleDB, análisis predictivo." }
          ].map((tier, idx) => (
            <div key={idx} className="border border-cosmic-accent bg-cosmic-panel p-6 flex flex-col justify-between text-center relative">
              {idx === 2 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cosmic-gold text-cosmic-bg text-[10px] font-bold px-3 py-0.5 uppercase">Recomendado</div>}
              <div>
                <div className="text-xs font-bold text-gray-500 tracking-widest mb-1">{tier.name}</div>
                <div className="text-3xl font-mono text-cosmic-gold font-bold my-4">{tier.price}</div>
                <p className="text-xs text-gray-400">{tier.desc}</p>
              </div>
              <button onClick={onEnter} className="mt-6 w-full py-2 bg-cosmic-accent hover:bg-cosmic-accent/80 text-white font-bold text-xs uppercase tracking-wider">Desplegar Stack</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
