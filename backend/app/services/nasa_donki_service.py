import requests
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

class NASADONKIService:
    BASE_URL = "https://api.nasa.gov/DONKI"
    
    def __init__(self, api_key: str = "DEMO_KEY"):
        self.api_key = api_key
        self.session = requests.Session()
    
    def _get(self, endpoint: str, start_date: str = None, end_date: str = None) -> List[Dict]:
        if not start_date:
            start_date = (datetime.utcnow() - timedelta(days=7)).strftime("%Y-%m-%d")
        if not end_date:
            end_date = datetime.utcnow().strftime("%Y-%m-%d")
        url = f"{self.BASE_URL}/{endpoint}"
        params = {"startDate": start_date, "endDate": end_date, "api_key": self.api_key}
        try:
            response = self.session.get(url, params=params, timeout=15)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"[NASA DONKI] Error en {endpoint}: {e}")
            return []
    
    def get_cme_events(self, days: int = 7) -> List[Dict]:
        start = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
        data = self._get("CME", start_date=start)
        events = []
        for cme in data[:20]:
            linked = cme.get("linkedEvents")
            events.append({
                "activity_id": cme.get("activityID", ""),
                "start_time": cme.get("startTime", ""),
                "source_location": cme.get("sourceLocation", "Desconocida"),
                "instruments": [i.get("displayName", "") for i in (cme.get("instruments") or [])],
                "linked_events": len(linked) if linked else 0,
                "catalog": cme.get("catalog", "")
            })
        return events
    
    def get_solar_flares(self, days: int = 7) -> List[Dict]:
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
                "active_region": flare.get("activeRegionNum")
            })
        return events
    
    def get_geomagnetic_storms(self, days: int = 7) -> List[Dict]:
        start = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
        data = self._get("GST", start_date=start)
        events = []
        for gst in data[:20]:
            kp_list = gst.get("allKpIndex") or []
            max_kp = max([k.get("kpIndex", 0) for k in kp_list]) if kp_list else 0
            events.append({
                "gst_id": gst.get("gstID", ""),
                "start_time": gst.get("startTime", ""),
                "max_kp_index": max_kp,
                "all_kp_indices": [{"time": k.get("observedTime", ""), "value": k.get("kpIndex", 0)} for k in kp_list],
                "linked_events": len(gst.get("linkedEvents") or [])
            })
        return events
    
    def get_space_weather_summary(self) -> Dict[str, Any]:
        flares = self.get_solar_flares(days=3)
        cmes = self.get_cme_events(days=3)
        storms = self.get_geomagnetic_storms(days=3)
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
            "data_source": "NASA DONKI API (datos reales)"
        }

nasa_donki = NASADONKIService()
