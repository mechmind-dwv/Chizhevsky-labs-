// ─── CHIZHEVSKY LABS — useSolarData Hook ────────────────────────────────────
// Fetches real data from NOAA/SWPC. Falls back to simulation if offline.

import { useState, useEffect, useRef, useCallback } from 'react';
import { simulateSolarFluctuation } from '../utils/helpers';

export interface SolarData {
  spots: number;
  kp: number;
  kpForecast: number[];
  wind: number;          // km/s
  windDensity: number;   // protons/cm³
  xrayFlux: number;      // watts/m²
  lastUpdated: Date;
  isSimulated: boolean;
  stormAlert: boolean;
}

const BASE_SIMULATED: SolarData = {
  spots: 127,
  kp: 4.8,
  kpForecast: [4.8, 5.2, 3.9, 3.1, 4.4, 5.7, 4.2],
  wind: 523,
  windDensity: 8.4,
  xrayFlux: 1.2e-6,
  lastUpdated: new Date(),
  isSimulated: true,
  stormAlert: false,
};

export function useSolarData(refreshMs = 30000): SolarData & { refresh: () => void } {
  const [data, setData] = useState<SolarData>(BASE_SIMULATED);
  const tickRef = useRef(0);

  const fetchReal = useCallback(async () => {
    try {
      // NOAA SWPC real-time endpoints
      const [kpRes, windRes, spotsRes] = await Promise.allSettled([
        fetch('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json'),
        fetch('https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json'),
        fetch('https://services.swpc.noaa.gov/json/sunspot_regions.json'),
      ]);

      let kp = BASE_SIMULATED.kp;
      let wind = BASE_SIMULATED.wind;
      let windDensity = BASE_SIMULATED.windDensity;
      let spots = BASE_SIMULATED.spots;
      let isSimulated = true;

      if (kpRes.status === 'fulfilled' && kpRes.value.ok) {
        const kpData = await kpRes.value.json();
        const latest = kpData[kpData.length - 1];
        if (latest?.kp_index != null) {
          kp = parseFloat(latest.kp_index);
          isSimulated = false;
        }
      }

      if (windRes.status === 'fulfilled' && windRes.value.ok) {
        const wData = await windRes.value.json();
        const latest = wData[wData.length - 1];
        if (latest?.proton_speed) wind = parseFloat(latest.proton_speed);
        if (latest?.proton_density) windDensity = parseFloat(latest.proton_density);
      }

      if (spotsRes.status === 'fulfilled' && spotsRes.value.ok) {
        const sData = await spotsRes.value.json();
        if (Array.isArray(sData)) spots = sData.length * 3; // approximate
      }

      setData(prev => ({
        ...prev,
        kp,
        wind,
        windDensity,
        spots,
        lastUpdated: new Date(),
        isSimulated,
        stormAlert: kp > 5,
      }));
    } catch {
      // Network error — use simulation
      tickRef.current += 1;
      setData(prev => ({
        ...simulateSolarFluctuation(prev, tickRef.current),
        kpForecast: prev.kpForecast,
        windDensity: prev.windDensity,
        xrayFlux: prev.xrayFlux,
        lastUpdated: new Date(),
        isSimulated: true,
        stormAlert: prev.kp > 5,
      }));
    }
  }, []);

  useEffect(() => {
    fetchReal();
    const interval = setInterval(() => {
      tickRef.current += 1;
      // Simulate micro-fluctuations between real fetches
      setData(prev => ({
        ...prev,
        ...simulateSolarFluctuation(prev, tickRef.current),
        lastUpdated: new Date(),
      }));
    }, 3000);

    const realInterval = setInterval(fetchReal, refreshMs);

    return () => {
      clearInterval(interval);
      clearInterval(realInterval);
    };
  }, [fetchReal, refreshMs]);

  return { ...data, refresh: fetchReal };
}
