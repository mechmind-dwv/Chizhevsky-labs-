"""
API de Predicción ML para Chizhevsky Labs
Expone el modelo entrenado como endpoint REST
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os
import json

app = FastAPI(
    title="Chizhevsky Labs ML API",
    description="Modelo de Predicción de Excitabilidad Biológica",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar modelo entrenado
model_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
model = joblib.load(os.path.join(model_dir, 'excitability_model.pkl'))
scaler = joblib.load(os.path.join(model_dir, 'scaler.pkl'))

with open(os.path.join(model_dir, 'metrics.json'), 'r') as f:
    metrics = json.load(f)

class SolarInput(BaseModel):
    sunspots: int = Field(..., ge=0, le=300, example=142)
    solar_wind: float = Field(..., ge=200, le=1000, example=485.2)
    kp_index: int = Field(..., ge=0, le=9, example=4)
    flux_density: float = Field(..., ge=50, le=300, example=172.4)

class PredictionResponse(BaseModel):
    predicted_excitability: float
    confidence: str
    input_data: dict
    model_info: dict
    interpretation: str

@app.get("/")
async def root():
    return {
        "name": "Chizhevsky Labs ML API",
        "model": metrics['best_model'],
        "r2_score": metrics['r2_score'],
        "features": ["sunspots", "solar_wind", "kp_index", "flux_density"]
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_excitability(data: SolarInput):
    """Predice el índice de excitabilidad biológica basado en datos solares."""
    try:
        features = np.array([[
            data.sunspots,
            data.solar_wind,
            data.kp_index,
            data.flux_density
        ]])
        
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        prediction = max(1.0, min(10.0, float(prediction)))
        
        # Interpretación
        if prediction >= 8.0:
            interpretation = "ALTA excitabilidad. Alta probabilidad de eventos de masas según Chizhevsky."
            confidence = "Alta"
        elif prediction >= 6.0:
            interpretation = "MODERADA excitabilidad. Condiciones favorables para actividad social elevada."
            confidence = "Media"
        elif prediction >= 4.0:
            interpretation = "BAJA excitabilidad. Periodo de estabilidad y baja actividad colectiva."
            confidence = "Media"
        else:
            interpretation = "MÍNIMA excitabilidad. Periodo de calma y recogimiento social."
            confidence = "Alta"
        
        return {
            "predicted_excitability": round(prediction, 2),
            "confidence": confidence,
            "input_data": {
                "sunspots": data.sunspots,
                "solar_wind": data.solar_wind,
                "kp_index": data.kp_index,
                "flux_density": data.flux_density
            },
            "model_info": {
                "name": metrics['best_model'],
                "r2_score": metrics['r2_score'],
                "mae": metrics['mae'],
                "feature_importance": metrics.get('feature_importance', {})
            },
            "interpretation": interpretation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy", "model": metrics['best_model']}
