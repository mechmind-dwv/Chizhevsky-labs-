import httpx
from app.core.config import settings
from typing import Dict, Any
import random

class NOAAService:
    """Servicio de integración con NOAA Space Weather Prediction Center.
    
    [SIMULADO PARCIALMENTE] Los datos de manchas solares y viento solar
    se obtienen de la API real de NOAA. El índice Kp se calcula con un
    modelo simplificado basado en la velocidad del viento solar.
    """
    
    def __init__(self):
        self.base_url = settings.NOAA_SWPC_URL
    
    async def get_solar_metrics(self) -> Dict[str, Any]:
        """Obtiene métricas solares actuales de NOAA SWPC."""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Obtener número de manchas solares (real)
                sunspots_response = await client.get(
                    f"{self.base_url}sunspot/sunspot_observed_in_solar_cycle.json"
                )
                sunspots_data = sunspots_response.json()
                
                # Obtener viento solar (real)
                wind_response = await client.get(
                    f"{self.base_url}products/geospace/geospace_propagating_solar_wind.json"
                )
                wind_data = wind_response.json()
                
                # Extraer valores
                sunspots = self._extract_sunspots(sunspots_data)
                solar_wind = self._extract_solar_wind(wind_data)
                kp_index = self._calculate_kp(solar_wind)
                flux_density = self._extract_flux_density(sunspots_data)
                
                return {
                    "sunspots": sunspots,
                    "solar_wind": round(solar_wind, 1),
                    "kp_index": kp_index,
                    "flux_density": round(flux_density, 1)
                }
        except Exception as e:
            print(f"[NOAA] Error obteniendo datos: {e}. Usando simulación.")
            return self._simulate_solar_metrics()
    
    def _extract_sunspots(self, data: list) -> int:
        """Extrae el número de manchas solares más reciente."""
        if data and len(data) > 0:
            return data[-1].get("sunspot_number", 142)
        return 142
    
    def _extract_solar_wind(self, data: dict) -> float:
        """Extrae la velocidad del viento solar."""
        if data and "speed" in data:
            return float(data["speed"])
        return 485.2
    
    def _extract_flux_density(self, data: list) -> float:
        """Extrae o estima el flujo de radio F10.7."""
        if data and len(data) > 0:
            return data[-1].get("f10.7", 172.4)
        return 172.4
    
    def _calculate_kp(self, solar_wind: float) -> int:
        """Calcula el índice Kp estimado basado en velocidad del viento solar.
        
        Fórmula simplificada [SIMULADO]:
        - viento < 350 km/s → Kp 0-2
        - viento 350-500 km/s → Kp 3-4
        - viento 500-700 km/s → Kp 5-7
        - viento > 700 km/s → Kp 8-9
        """
        if solar_wind < 350:
            return random.randint(0, 2)
        elif solar_wind < 500:
            return random.randint(3, 4)
        elif solar_wind < 700:
            return random.randint(5, 7)
        else:
            return random.randint(8, 9)
    
    def _simulate_solar_metrics(self) -> Dict[str, Any]:
        """Genera datos simulados cuando NOAA no está disponible."""
        return {
            "sunspots": random.randint(80, 200),
            "solar_wind": round(random.uniform(350, 650), 1),
            "kp_index": random.randint(2, 5),
            "flux_density": round(random.uniform(140, 200), 1)
        }
