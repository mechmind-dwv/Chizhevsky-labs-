from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import json, os, math

app = FastAPI(title="Chizhevsky Labs ML API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Cargar modelo desde JSON
model_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
with open(os.path.join(model_dir, 'excitability_model.json'), 'r') as f:
    model_data = json.load(f)

class StandardScaler:
    def __init__(self, mean, std):
        self.mean = mean
        self.std = std
    
    def transform(self, X):
        return [[(row[i]-self.mean[i])/self.std[i] for i in range(len(row))] for row in X]

class LinearRegressor:
    def __init__(self, weights, bias):
        self.weights = weights
        self.bias = bias
    
    def predict(self, X):
        return [max(1.0, min(10.0, sum(self.weights[j]*x[j] for j in range(len(x))) + self.bias)) for x in X]

# Reconstruir objetos
scaler_dict = model_data['scaler']
scaler = StandardScaler(mean=scaler_dict['mean'], std=scaler_dict['std'])

model_dict = model_data['model']
model = LinearRegressor(weights=model_dict['weights'], bias=model_dict['bias'])

metrics = model_data['metrics']

class SolarInput(BaseModel):
    sunspots: int = Field(..., ge=0, le=300, example=142)
    solar_wind: float = Field(..., ge=200, le=1000, example=485.2)
    kp_index: int = Field(..., ge=0, le=9, example=4)
    flux_density: float = Field(..., ge=50, le=300, example=172.4)

@app.get("/")
async def root():
    return {"name": "Chizhevsky Labs ML API", "model": model_data['model_type'], "r2": metrics['r2']}

@app.post("/predict")
async def predict(data: SolarInput):
    try:
        features = [[data.sunspots, data.solar_wind, data.kp_index, data.flux_density]]
        scaled = scaler.transform(features)
        pred = model.predict(scaled)[0]
        pred = max(1.0, min(10.0, float(pred)))
        
        if pred >= 8: interp, conf = "ALTA excitabilidad. Probables eventos de masas.", "Alta"
        elif pred >= 6: interp, conf = "MODERADA. Condiciones para actividad social elevada.", "Media"
        elif pred >= 4: interp, conf = "BAJA. Periodo de estabilidad.", "Media"
        else: interp, conf = "MÍNIMA. Calma y recogimiento social.", "Alta"
        
        return {
            "predicted_excitability": round(pred, 2),
            "confidence": conf,
            "interpretation": interp,
            "model_info": {"type": model_data['model_type'], "r2": metrics['r2'], "features": model_data['features']}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy", "model": model_data['model_type']}
