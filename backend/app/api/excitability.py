from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.excitability_service import ExcitabilityService
from app.services.noaa_service import NOAAService
from typing import Dict, Any

router = APIRouter(prefix="/api/excitability", tags=["excitability"])

class ExcitabilityRequest(BaseModel):
    birth_date: str = Field(..., example="1995-06-15", description="Fecha de nacimiento (YYYY-MM-DD)")
    chronotype: str = Field(..., example="Intermediate", description="Lark | Intermediate | Owl")
    mood_rating: int = Field(..., ge=1, le=10, example=7, description="Estado de ánimo (1-10)")

class ExcitabilityResponse(BaseModel):
    status: str
    data: Dict[str, Any]

excitability_service = ExcitabilityService()
noaa_service = NOAAService()

@router.post("/", response_model=Dict[str, Any])
async def calculate_excitability(request: ExcitabilityRequest):
    """Calcula el Índice de Excitabilidad Biológica de Chizhevsky."""
    # Validar cronotipo
    valid_chronotypes = ["Lark", "Intermediate", "Owl"]
    if request.chronotype not in valid_chronotypes:
        raise HTTPException(
            status_code=400,
            detail=f"Cronotipo inválido. Debe ser: {', '.join(valid_chronotypes)}"
        )
    
    # Obtener Kp actual
    try:
        solar_data = await noaa_service.get_solar_metrics()
        kp_index = solar_data["kp_index"]
    except:
        kp_index = 4  # Valor por defecto
    
    # Calcular índice
    result = excitability_service.calculate(
        birth_date=request.birth_date,
        chronotype=request.chronotype,
        mood_rating=request.mood_rating,
        kp_index=kp_index
    )
    
    return {
        "status": "success",
        "data": result,
        "input": {
            "birth_date": request.birth_date,
            "chronotype": request.chronotype,
            "mood_rating": request.mood_rating,
            "current_kp": kp_index
        }
    }
