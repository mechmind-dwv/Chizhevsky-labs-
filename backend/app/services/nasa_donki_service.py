"""
Servicio de integración con NASA DONKI API.
Obtiene datos REALES de actividad solar: CME, Flares, Tormentas Geomagnéticas.

DOCUMENTACIÓN OFICIAL:
- https://ccmc.gsfc.nasa.gov/tools/DONKI/ [citation:5]
- https://api.nasa.gov/

EJEMPLOS DE ENDPOINTS:
- CME:  https://api.nasa.gov/DONKI/CME?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=DEMO_KEY
- FLR:  https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=DEMO_KEY
- GST:  https://api.nasa.gov/DONKI/GST?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=DEMO_KEY
"""

import requests
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

class NASADONKIService:
    """Cliente para NASA DONKI API — Datos reales de clima espacial."""
    
    BASE_URL = "https://api.nasa.gov/DONKI"
    
    def __init__(self, api_key: str = "DEMO_KEY"):
        self.api_key = api_key
        self.session = requests.Session()
    
    def _get(self, endpoint: str, start_date: str = None, end_date: str = None) -> List[Dict]:
        """Hace una petición GET a DONKI."""
        if not start_date:
            start_date = (datetime.utcnow() - timedelta(days=7)).strftime("%Y-%m-%d")
        if not end_date:
            end_date = datetime.utcnow().strftime("%Y-%m-%d")
        
        url = f"{self.BASE_URL}/{endpoint}"
        params = {
            "startDate": start_date,
            "endDate": end_date,
            "api_key": self.api_key
        }
        
        try:
            response = self.session.get(url, params=params, timeout=15)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"[NASA DONKI] Error en {endpoint}: {e}")
            return []
    
    def get_cme_events(self, days: int = 7) -> List[Dict]:
        """Obtiene eyecciones de masa coronal (CME) recientes.
        
        Las CME son explosiones de plasma y campo magnético desde la corona solar.
        Pueden causar tormentas geomagnéticas en la Tierra.
        """
        start = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
        data = self._get("CME", start_date=start)
        
        events = []
        for cme in data[:20]:  # Limitar a 20 más recientes
            events.append({
                "activity_id": cme.get("activityID", ""),
                "start_time": cme.get("startTime", ""),
                "source_location": cme.get("sourceLocation", "Desconocida"),
                "instruments": [i.get("displayName", "") for i in cme.get("instruments", [])],
                "linked_events": len(cme.get("linkedEvents", [])),
                "catalog": cme.get("catalog", "")
            })
        return events
    
    def get_solar_flares(self, days: int = 7) -> List[Dict]:
        """Obtiene erupciones solares (Solar Flares) recientes.
        
        Clasificación: A, B, C, M, X (siendo X las más intensas).
        Las clases M y X pueden afectar comunicaciones y satélites [citation:5].
        """
        start = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
        data = self._get("FLR", start_date=start)
        
        events = []
        for flare in data[:20]:
            events.append({
                "flare_id": flare.get("flrID", ""),
                "class_type": flare.get("classType", ""),
                "begin_time": flare.get("beginTime", ""),
                "peak_time": flare.get("peakTime", ""),
                "source_location": flare.get("sourceLocation", "Desconocida"),
                "active_region": flare.get("activeRegionNum", None)
            })
        return events
    
    def get_geomagnetic_storms(self, days: int = 7) -> List[Dict]:
        """Obtiene tormentas geomagnéticas recientes.
        
        Índice Kp: 0-9. Kp > 5 indica tormenta geomagnética.
        Chizhevsky correlacionó Kp alto con excitabilidad biológica [citation:10].
        """
        start = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
        data = self._get("GST", start_date=start)
        
        events = []
        for gst in data[:20]:
            kp_list = gst.get("allKpIndex", [])
            max_kp = max([k.get("kpIndex", 0) for k in kp_list]) if kp_list else 0
            
            events.append({
                "gst_id": gst.get("gstID", ""),
                "start_time": gst.get("startTime", ""),
                "max_kp_index": max_kp,
                "all_kp_indices": [{"time": k.get("observedTime", ""), "value": k.get("kpIndex", 0)} for k in kp_list],
                "linked_events": len(gst.get("linkedEvents", []))
            })
        return events
    
    def get_space_weather_summary(self) -> Dict[str, Any]:
        """Obtiene un resumen completo del clima espacial actual."""
        flares = self.get_solar_flares(days=3)
        cmes = self.get_cme_events(days=3)
        storms = self.get_geomagnetic_storms(days=3)
        
        # Determinar nivel de alerta
        active_flares = [f for f in flares if f["class_type"] in ["M", "X"]]
        active_storms = [s for s in storms if s["max_kp_index"] >= 5]
        
        if active_flares and active_storms:
            alert_level = "ALTA"
            description = "Tormenta geomagnética activa con erupciones clase M/X"
        elif active_flares or active_storms:
            alert_level = "MODERADA"
            description = "Actividad solar elevada detectada"
        else:
            alert_level = "BAJA"
            description = "Clima espacial tranquilo"
        
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "alert_level": alert_level,
            "description": description,
            "active_flares": active_flares,
            "active_cmes": len(cmes),
            "active_storms": active_storms,
            "total_flares_72h": len(flares),
            "total_cmes_72h": len(cmes),
            "total_storms_72h": len(storms),
            "data_source": "NASA DONKI API (datos reales)" [citation:5]
        }


# Singleton
nasa_donki = NASADONKIService()
