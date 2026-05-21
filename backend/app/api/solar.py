from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.models.historical_event import HistoricalEvent
from app.models.solar_metrics import SolarMetrics
from app.services.noaa_service import NOAAService
from typing import List, Dict, Any
from datetime import datetime

router = APIRouter(prefix="/api/solar", tags=["solar"])
noaa_service = NOAAService()

@router.get("/current", response_model=Dict[str, Any])
async def get_current_solar_metrics():
    """Obtiene métricas solares actuales de NOAA SWPC."""
    metrics = await noaa_service.get_solar_metrics()
    return {
        "status": "success",
        "timestamp": datetime.utcnow().isoformat(),
        "data": metrics,
        "source": "NOAA Space Weather Prediction Center [SIMULADO PARCIAL]"
    }

@router.get("/historical", response_model=Dict[str, Any])
async def get_historical_events(
    db: AsyncSession = Depends(get_db),
    limit: int = 50,
    offset: int = 0,
    solar_phase: str = None
):
    """Obtiene eventos históricos de la base de datos de Chizhevsky."""
    query = select(HistoricalEvent)
    
    if solar_phase:
        query = query.where(HistoricalEvent.solar_phase == solar_phase)
    
    query = query.order_by(HistoricalEvent.year).offset(offset).limit(limit)
    result = await db.execute(query)
    events = result.scalars().all()
    
    return {
        "status": "success",
        "total": len(events),
        "limit": limit,
        "offset": offset,
        "data": [
            {
                "id": e.id,
                "year": e.year,
                "epoch": e.epoch,
                "event": e.event,
                "solar_phase": e.solar_phase,
                "estimated_excitability": e.estimated_excitability,
                "description": e.description
            }
            for e in events
        ],
        "reference": "Chizhevsky, A.L. (1924) 'Factores Físicos del Proceso Histórico'"
    }
