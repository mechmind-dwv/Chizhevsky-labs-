export interface HistoricalEvent {
  id: number;
  year: number;
  epoch: string;
  event: string;
  solarPhase: 'Minima' | 'Ascending' | 'Maxima' | 'Descending';
  estimatedExcitability: number; // Scale 1-10 Chizhevsky Factor
  description: string;
}

export interface SolarMetrics {
  sunspots: number;
  solarWind: number; // km/s
  kpIndex: number;
  fluxDensity: number;
}

export interface UserMetrics {
  birthDate: string;
  chronotype: 'Lark' | 'Owl' | 'Intermediate';
  moodRating: number;
}
