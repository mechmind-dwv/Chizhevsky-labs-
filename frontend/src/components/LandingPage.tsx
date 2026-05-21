import React from 'react';
import { ArrowRight, Star, Layers, Activity } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-24">
      <section className="text-center space-y-6 relative py-20 border border-cosmic-accent bg-gradient-to-b from-cosmic-panel to-cosmic-bg p-8 shadow-2xl">
        <div className="absolute top-4 left-4 text-[11px] text-cosmic-gold/50 font-bold uppercase tracking-widest">LABORATORIO DE HELIOBIOLOGÍA DE KALUGA</div>
        <div className="text-6xl md:text-8xl text-center font-bold tracking-tighter text-white animate-pulse">☀️</div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white uppercase">
          CHIZHEVSKY LABS
        </h1>
        <p className="text-xl text-cosmic-gold font-bold tracking-widest uppercase max-w-2xl mx-auto">
          "El Sol no solo ilumina — regula."
        </p>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          Ecosistema analítico avanzado basado en los postulados de Alexander Chizhevsky. Vigilancia biológica cuántica de los ciclos solares y su impacto en la biosfera.
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
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-b border-cosmic-gold/30 inline-block pb-2">
            Cronología del Fundador (1897 - 1964)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { year: "1897", title: "Nacimiento en Grodno", desc: "Nace Alexander Leonidovich Chizhevsky, pionero interdisciplinario absoluto." },
            { year: "1915", title: "Teoría Heliobiológica", desc: "Inicia observaciones sistemáticas correlacionando manchas solares con brotes de cólera y agitación social." },
            { year: "1924", title: "Tratado Fundamental", desc: "Publica 'Factores Físicos del Proceso Histórico', sentando bases de la astrovirología." },
            { year: "1939", title: "Aero-ionización", desc: "Nombrado Director del Laboratorio Central de Aero-ionización de la Unión Soviética." }
          ].map((evt, idx) => (
            <div key={idx} className="bg-cosmic-panel p-4 border-l-4 border-cosmic-gold relative">
              <div className="text-2xl font-bold text-cosmic-gold font-mono mb-1">{evt.year}</div>
              <div className="text-sm font-bold text-white mb-2 uppercase">{evt.title}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{evt.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-b border-cosmic-gold/30 inline-block pb-2">
            Los Cuatro Pilares Científicos
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-cosmic-accent p-6 bg-cosmic-panel/60">
            <h3 className="text-lg font-bold text-cosmic-gold mb-2 flex items-center gap-2">☀️ HELIOBIOLOGÍA</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Modelado matemático del ciclo de Schwabe (11 años). Estudiamos de qué manera el flujo electromagnético del sol actúa como un disparador o catalizador de los sistemas nerviosos centrales a escala macro-poblacional.
            </p>
          </div>
          <div className="border border-cosmic-accent p-6 bg-cosmic-panel/60">
            <h3 className="text-lg font-bold text-cosmic-gold mb-2 flex items-center gap-2">⚡ AERO-IONIZACIÓN</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Modificación cuántica ambiental mediante la dispersión controlada de aero-iones cargados negativamente. Replicamos las densidades ionosféricas óptimas de bosques prístinos para mitigar la fatiga celular.
            </p>
          </div>
          <div className="border border-cosmic-accent p-6 bg-cosmic-panel/60">
            <h3 className="text-lg font-bold text-cosmic-gold mb-2 flex items-center gap-2">🦠 ASTROVIROLOGÍA</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Mapeo de mutaciones y brotes patogénicos vinculados a eyecciones de masa coronal (CME). Analizamos la barrera geomagnética terrestre como un filtro variable para la estabilidad de agentes biológicos.
            </p>
          </div>
          <div className="border border-cosmic-accent p-6 bg-cosmic-panel/60">
            <h3 className="text-lg font-bold text-cosmic-gold mb-2 flex items-center gap-2">⏳ CRONOBIOLOGÍA</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              La unificación de los relojes circadianos autónomos con los ritmos orbitales cosmológicos. Sincronización metabólica fina basada en el entrelazamiento de frecuencias bio-solares.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-b border-cosmic-gold/30 inline-block pb-2">
            Niveles de Infraestructura Operativa
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Nivel 1: KALUGA", price: "Libre", desc: "Acceso básico a los índices históricos de Chizhevsky, feeds públicos de NOAA SWPC y calculadora estática de excitabilidad." },
            { name: "Nivel 2: TSIOLKOVSKY", price: "$45 / mes", desc: "Predicciones de astrovirología avanzadas, simulación de aero-iones en tiempo real e integraciones con hardware de monitoreo circadiano." },
            { name: "Nivel 3: CHIZHEVSKY LABS COMPLETE", price: "Custom Enterprise", desc: "Controlador IoT para clústeres de aero-ionización industriales, API directa de TimescaleDB con flujos crudos geomagnéticos y análisis predictivo macro-histórico." }
          ].map((tier, idx) => (
            <div key={idx} className="border border-cosmic-accent bg-cosmic-panel p-6 flex flex-col justify-between text-center relative">
              {idx === 2 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cosmic-gold text-cosmic-bg text-[10px] font-bold px-3 py-0.5 tracking-widest uppercase">Recomendado</div>}
              <div>
                <div className="text-xs font-bold text-gray-500 tracking-widest mb-1">{tier.name}</div>
                <div className="text-3xl font-mono text-cosmic-gold font-bold my-4">{tier.price}</div>
                <p className="text-xs text-gray-400 leading-relaxed">{tier.desc}</p>
              </div>
              <button onClick={onEnter} className="mt-6 w-full py-2 bg-cosmic-accent hover:bg-cosmic-accent/80 text-white font-bold text-xs uppercase tracking-wider transition-colors">
                Desplegar Stack
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
