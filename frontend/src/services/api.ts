const API_URL = 'http://localhost:8000';

export async function fetchSolarCurrent() {
  const res = await fetch(`${API_URL}/api/solar/current`);
  if (!res.ok) throw new Error('Error fetching solar data');
  return res.json();
}

export async function fetchHistoricalEvents(limit = 10, solarPhase?: string) {
  let url = `${API_URL}/api/solar/historical?limit=${limit}`;
  if (solarPhase) url += `&solar_phase=${solarPhase}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error fetching historical events');
  return res.json();
}

export async function calculateExcitability(data: {
  birth_date: string;
  chronotype: string;
  mood_rating: number;
}) {
  const res = await fetch(`${API_URL}/api/excitability/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error calculating excitability');
  return res.json();
}

export async function simulateAerion(mode = 'tsiolkovsky') {
  const res = await fetch(`${API_URL}/api/aerion/simulate?mode=${mode}`);
  if (!res.ok) throw new Error('Error simulating aerion');
  return res.json();
}
