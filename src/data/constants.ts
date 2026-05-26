// ─── CHIZHEVSKY LABS — Static Data ──────────────────────────────────────────

export const CHIZHEVSKY_QUOTES = [
  'El Sol no solo ilumina — regula.',
  'La vida de la Tierra, en toda su diversidad, está subordinada a los impulsos de la actividad solar.',
  'Somos hijos del Sol. Llevamos su ritmo en cada célula.',
  'Los ciclos cósmicos no son fatalismo. Son el compás del universo.',
  'La biósfera respira al ritmo de las manchas solares.',
  'El cosmos y el hombre no son extraños: son la misma ecuación.',
];

export const CHIZHEVSKY_TIMELINE = [
  { year: '1897', event: 'Nace en Schigrý, Imperio Ruso' },
  { year: '1915', event: 'Descubre correlación solar–epidemias' },
  { year: '1918', event: 'Funda la Aero-ionización terapéutica' },
  { year: '1924', event: 'Publica "La influencia física del Sol en la Tierra"' },
  { year: '1935', event: 'Efecto Chizhevsky–Velkhover descubierto' },
  { year: '1942', event: 'Arrestado — se niega a retractarse ante Stalin' },
  { year: '1950', event: 'Liberado del Gulag de Karaganda' },
  { year: '1958', event: 'Rehabilitación científica parcial' },
  { year: '1964', event: 'Muere en Moscú. Lápida grabada con un sol ☀' },
];

export const HISTORICAL_EVENTS = [
  { year: -430, event: 'Peste de Atenas', phase: 9, ei: 8.7, region: 'Grecia' },
  { year: 541, event: 'Plaga de Justiniano', phase: 10, ei: 9.0, region: 'Imperio Bizantino' },
  { year: 1347, event: 'Inicio de la Peste Negra', phase: 7, ei: 9.1, region: 'Europa' },
  { year: 1453, event: 'Caída de Constantinopla', phase: 11, ei: 8.5, region: 'Oriente Medio' },
  { year: 1618, event: 'Guerra de los 30 años', phase: 11, ei: 8.9, region: 'Europa Central' },
  { year: 1789, event: 'Revolución Francesa', phase: 10, ei: 9.4, region: 'Francia' },
  { year: 1848, event: 'Primavera de los Pueblos', phase: 11, ei: 9.2, region: 'Europa' },
  { year: 1871, event: 'Comuna de París', phase: 9, ei: 8.3, region: 'Francia' },
  { year: 1905, event: 'Revolución Rusa 1905', phase: 10, ei: 8.8, region: 'Rusia' },
  { year: 1917, event: 'Revolución de Octubre', phase: 11, ei: 9.6, region: 'Rusia' },
  { year: 1929, event: 'Gran Depresión', phase: 8, ei: 7.9, region: 'EEUU' },
  { year: 1939, event: 'Segunda Guerra Mundial', phase: 11, ei: 9.3, region: 'Global' },
  { year: 1957, event: 'Sputnik — carrera espacial', phase: 10, ei: 8.6, region: 'Global' },
  { year: 1968, event: 'Revoluciones estudiantiles globales', phase: 10, ei: 8.5, region: 'Global' },
  { year: 1989, event: 'Caída del Muro de Berlín', phase: 11, ei: 9.1, region: 'Europa' },
  { year: 2001, event: 'Torres Gemelas & anthrax', phase: 11, ei: 8.8, region: 'EEUU' },
  { year: 2008, event: 'Crisis financiera global', phase: 9, ei: 8.0, region: 'Global' },
  { year: 2011, event: 'Primavera Árabe', phase: 11, ei: 9.0, region: 'Oriente Medio' },
  { year: 2019, event: 'Protestas globales simultáneas', phase: 9, ei: 8.2, region: 'Global' },
  { year: 2020, event: 'Pandemia COVID-19', phase: 8, ei: 8.3, region: 'Global' },
];

export const SOLAR_DATA_MONTHS = [
  { month: 'Ene', spots: 45, kp: 2.1, wind: 380 },
  { month: 'Feb', spots: 52, kp: 3.4, wind: 420 },
  { month: 'Mar', spots: 78, kp: 5.2, wind: 510 },
  { month: 'Abr', spots: 91, kp: 4.1, wind: 480 },
  { month: 'May', spots: 110, kp: 6.3, wind: 560 },
  { month: 'Jun', spots: 124, kp: 7.1, wind: 620 },
  { month: 'Jul', spots: 138, kp: 5.8, wind: 590 },
  { month: 'Ago', spots: 115, kp: 4.2, wind: 470 },
  { month: 'Sep', spots: 98, kp: 3.8, wind: 440 },
  { month: 'Oct', spots: 87, kp: 2.9, wind: 395 },
  { month: 'Nov', spots: 63, kp: 2.4, wind: 360 },
  { month: 'Dic', spots: 48, kp: 1.9, wind: 340 },
];

export const AERION_MODES = {
  creativa: {
    id: 'creativa',
    name: 'Revolución Creativa',
    icon: '🔥',
    ions: 35000,
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.06)',
    desc: 'Alto flujo de iones negativos para máxima productividad, creatividad y circulación cerebral aumentada.',
    effects: ['↑ Serotonina', '↑ Flujo sanguíneo cerebral', '↑ Concentración', '↑ Creatividad'],
  },
  recovery: {
    id: 'recovery',
    name: 'Gulag Recovery',
    icon: '❄️',
    ions: 8000,
    color: '#00BFFF',
    bg: 'rgba(0,191,255,0.05)',
    desc: 'Iones positivos para calma profunda, recuperación sistémica y sueño de calidad.',
    effects: ['↓ Cortisol', '↑ Parasimpático', '↑ Calidad del sueño', '↓ Inflamación'],
  },
  cosmos: {
    id: 'cosmos',
    name: 'Modo Tsiolkovsky',
    icon: '🚀',
    ions: 22000,
    color: '#9B59B6',
    bg: 'rgba(155,89,182,0.05)',
    desc: 'Ciclos alternados de ionización que sincronizan ritmos biológicos con frecuencias cósmicas.',
    effects: ['⟳ Ritmo circadiano', '↑ Adaptabilidad', '↑ Resiliencia', '⟳ Ciclos ultradian'],
  },
};

export const REGIONAL_RISKS = [
  { name: 'Ártico', latApprox: 80, risk: 0.89, pop: 'Baja' },
  { name: 'Europa Norte', latApprox: 65, risk: 0.72, pop: 'Media' },
  { name: 'Rusia', latApprox: 60, risk: 0.68, pop: 'Alta' },
  { name: 'Asia Este', latApprox: 35, risk: 0.61, pop: 'Muy Alta' },
  { name: 'América Norte', latApprox: 50, risk: 0.55, pop: 'Alta' },
  { name: 'América Latina', latApprox: -10, risk: 0.38, pop: 'Alta' },
  { name: 'África', latApprox: 0, risk: 0.32, pop: 'Alta' },
  { name: 'Oceanía', latApprox: -30, risk: 0.29, pop: 'Baja' },
];

export const OPTIMAL_WINDOWS = [
  { date: '2025-06-14', type: 'creatividad', icon: '🎨', score: 9.2 },
  { date: '2025-06-16', type: 'negociación', icon: '🤝', score: 8.7 },
  { date: '2025-06-18', type: 'ejercicio', icon: '🏃', score: 9.5 },
  { date: '2025-06-20', type: 'descanso', icon: '😴', score: 7.1 },
  { date: '2025-06-22', type: 'creatividad', icon: '🎨', score: 8.9 },
  { date: '2025-06-24', type: 'negociación', icon: '🤝', score: 9.0 },
  { date: '2025-06-27', type: 'ejercicio', icon: '🏃', score: 8.4 },
  { date: '2025-06-29', type: 'descanso', icon: '😴', score: 7.6 },
];

export const ACHIEVEMENTS = [
  { id: 'primera_tormenta', name: 'Primera Tormenta', icon: '⚡', desc: 'Registraste tu primera tormenta geomagnética', xp: 100 },
  { id: 'cronoviajero', name: 'Cronoviajero', icon: '⏱', desc: '7 días de sincronización consecutiva', xp: 250 },
  { id: 'guardian_ciclo', name: 'Guardián del Ciclo', icon: '☀', desc: 'Monitoreaste un ciclo solar completo de 11 años', xp: 1000 },
  { id: 'ion_maestro', name: 'Ion Maestro', icon: '⚗', desc: 'Configuraste los 3 modos de ionización', xp: 150 },
  { id: 'kaluga_spirit', name: 'Espíritu Kaluga', icon: '🏛', desc: '30 días usando la plataforma', xp: 500 },
  { id: 'heliobiologo', name: 'Helióbiólogo Junior', icon: '🔬', desc: 'Calculaste tu EI biológico 10 veces', xp: 200 },
];

export const PROTOCOLS = [
  'Suplementar vitamina D 3 días antes de eventos solares mayores (Kp > 7)',
  'Aumentar ingesta antioxidante (vitamina C, E, selenio) durante tormentas geomagnéticas',
  'Evitar procedimientos quirúrgicos electivos durante Kp > 6',
  'Reforzar descanso 24–48h post-tormenta geomagnética intensa',
  'Mantener hidratación elevada durante máximos solares',
  'Revisar medicación sensible a flujo iónico (anticoagulantes) con tu médico',
];
