from fastapi import APIRouter, Query
from app.services.aerion_service import AerionService
from typing import Dict, Any

router = APIRouter(prefix="/api/aerion", tags=["aerion"])

aerion_service = AerionService()

@router.get("/simulate", response_model=Dict[str, Any])
async def simulate_aerion(
    mode: str = Query("tsiolkovsky", description="creative | recovery | tsiolkovsky")
):
    """Simula la densidad de aero-iones según el modo seleccionado."""
    result = aerion_service.simulate(mode)
    
    if "error" in result:
        return {
            "status": "error",
            "message": result["error"],
            "available_modes": result["available_modes"]
        }
    
    return {
        "status": "success",
        "data": result,
        "reference": "Chizhevsky, A.L. (1938) 'Aero-ionización en Medicina'"
    }
