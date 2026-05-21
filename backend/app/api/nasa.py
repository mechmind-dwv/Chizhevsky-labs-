from fastapi import APIRouter, Query
from app.services.nasa_donki_service import nasa_donki
from typing import Optional

router = APIRouter(prefix="/api/nasa", tags=["nasa"])

@router.get("/space-weather")
async def get_space_weather():
    """Resumen del clima espacial actual desde NASA DONKI."""
    return {
        "status": "success",
        "data": nasa_donki.get_space_weather_summary()
    }

@router.get("/cme")
async def get_cme_events(days: int = Query(7, ge=1, le=30)):
    """Eyecciones de Masa Coronal (CME) recientes."""
    events = nasa_donki.get_cme_events(days=days)
    return {
        "status": "success",
        "total": len(events),
        "days": days,
        "data": events,
        "source": "NASA DONKI CME Endpoint" [citation:5]
    }

@router.get("/flares")
async def get_solar_flares(days: int = Query(7, ge=1, le=30)):
    """Erupciones solares recientes con clasificación (A, B, C, M, X)."""
    events = nasa_donki.get_solar_flares(days=days)
    return {
        "status": "success",
        "total": len(events),
        "days": days,
        "data": events,
        "source": "NASA DONKI FLR Endpoint" [citation:5]
    }

@router.get("/geomagnetic-storms")
async def get_geomagnetic_storms(days: int = Query(7, ge=1, le=30)):
    """Tormentas geomagnéticas recientes con índice Kp."""
    events = nasa_donki.get_geomagnetic_storms(days=days)
    return {
        "status": "success",
        "total": len(events),
        "days": days,
        "data": events,
        "source": "NASA DONKI GST Endpoint" [citation:5]
    }
