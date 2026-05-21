export interface HistoricalEvent {
  id: number;
  year: number;
  epoch: string;
  event: string;
  solarPhase: 'Minima' | 'Ascending' | 'Maxima' | 'Descending';
  estimatedExcitability: number;
  description: string;
}

export interface SolarMetrics {
  sunspots: number;
  solarWind: number;
  kpIndex: number;
  fluxDensity: number;
}

export interface UserMetrics {
  birthDate: string;
  chronotype: 'Lark' | 'Owl' | 'Intermediate';
  moodRating: number;
}
