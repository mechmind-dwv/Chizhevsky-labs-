// ─── CHIZHEVSKY LABS — Utility Functions ────────────────────────────────────

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Calcula el Índice de Excitabilidad Biológica de Chizhevsky.
 * Basado en: fase del ciclo solar, cronotipo y estado de ánimo.
 * @param birthYear - Año de nacimiento del usuario
 * @param chronotype - 'madrugador' | 'intermedio' | 'nocturno'
 * @param mood - Estado de ánimo actual (1–10)
 * @param kpIndex - Índice geomagnético Kp actual (0–9)
 */
export function calcExcitabilityIndex(
  birthYear: number,
  chronotype: 'madrugador' | 'intermedio' | 'nocturno',
  mood: number,
  kpIndex: number
): number {
  const currentYear = new Date().getFullYear();
  // Posición en el ciclo solar de 11 años desde el nacimiento
  const cyclePos = ((currentYear - birthYear) % 11) + 1;

  const chronoModifiers = {
    madrugador: 0.88,
    intermedio: 1.0,
    nocturno: 1.12,
  };
  const chronoMod = chronoModifiers[chronotype];

  // Fórmula Chizhevsky-adaptada:
  // EI = (Kp_weight * Kp + cycle_weight * cyclePos + mood_weight * mood) * chronoMod
  const raw = (kpIndex * 0.4 + cyclePos * 0.3 + mood * 0.3) * chronoMod;
  return clamp(parseFloat(raw.toFixed(2)), 1.0, 10.0);
}

export function getEIDescription(ei: number): { text: string; color: string; icon: string } {
  if (ei >= 8.5) return {
    text: 'Excitabilidad Máxima — ventana de potencial óptimo',
    color: '#FFD700',
    icon: '⚡',
  };
  if (ei >= 7.0) return {
    text: 'Alta excitabilidad — aprovecha el impulso cósmico',
    color: '#FFA500',
    icon: '🌤',
  };
  if (ei >= 5.0) return {
    text: 'Excitabilidad moderada — ritmo constante y estable',
    color: '#4CAF50',
    icon: '🌱',
  };
  return {
    text: 'Fase de recuperación — conserva y restaura energía',
    color: '#00BFFF',
    icon: '🌙',
  };
}

export function getKpRiskLevel(kp: number): { level: string; color: string; desc: string } {
  if (kp > 7) return { level: 'SEVERO', color: '#FF4444', desc: 'Tormenta geomagnética intensa' };
  if (kp > 5) return { level: 'MODERADO', color: '#FFA500', desc: 'Tormenta geomagnética moderada' };
  if (kp > 3) return { level: 'BAJO', color: '#FFD700', desc: 'Actividad geomagnética elevada' };
  return { level: 'TRANQUILO', color: '#4CAF50', desc: 'Actividad solar normal' };
}

export function getSolarCyclePhase(year: number): number {
  // Ciclo solar 25 comenzó ~2019. Duración media: 11 años.
  const cycleStart = 2019;
  return ((year - cycleStart) % 11) + 1;
}

export function getLunarPhase(date: Date): { phase: number; name: string; icon: string } {
  // Algoritmo simplificado de fase lunar
  const synodicMonth = 29.53058867;
  const knownNewMoon = new Date('2024-01-11').getTime();
  const elapsed = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phase = ((elapsed % synodicMonth) / synodicMonth);

  if (phase < 0.03 || phase > 0.97) return { phase, name: 'Luna Nueva', icon: '🌑' };
  if (phase < 0.22) return { phase, name: 'Creciente', icon: '🌒' };
  if (phase < 0.28) return { phase, name: 'Cuarto Creciente', icon: '🌓' };
  if (phase < 0.47) return { phase, name: 'Gibosa Creciente', icon: '🌔' };
  if (phase < 0.53) return { phase, name: 'Luna Llena', icon: '🌕' };
  if (phase < 0.72) return { phase, name: 'Gibosa Menguante', icon: '🌖' };
  if (phase < 0.78) return { phase, name: 'Cuarto Menguante', icon: '🌗' };
  return { phase, name: 'Menguante', icon: '🌘' };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Simula variación en tiempo real de datos solares
export function simulateSolarFluctuation(
  base: { spots: number; kp: number; wind: number },
  seed: number
): { spots: number; kp: number; wind: number } {
  const t = seed * 0.1;
  return {
    spots: Math.round(base.spots + Math.sin(t) * 8 + Math.cos(t * 2.3) * 4),
    kp: parseFloat(clamp(base.kp + Math.sin(t * 0.7) * 0.5, 0, 9).toFixed(1)),
    wind: Math.round(base.wind + Math.sin(t * 1.4) * 25 + Math.cos(t) * 15),
  };
}
