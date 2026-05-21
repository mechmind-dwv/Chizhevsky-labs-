"""
Chizhevsky Labs — Modelo ML de Predicción de Excitabilidad Biológica

Basado en el trabajo de Alexander Chizhevsky (1924):
"Factores Físicos del Proceso Histórico"

Features:
- sunspots: Número de manchas solares (R)
- solar_wind: Velocidad del viento solar (km/s)
- kp_index: Índice planetario Kp (0-9)
- flux_density: Flujo de radio F10.7 (sfu)

Target:
- historical_excitability: Índice de excitabilidad histórica (1-10)
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
import joblib
import os

print("🌞 Chizhevsky Labs — Entrenamiento de Modelo ML")
print("=" * 50)

# Cargar dataset
data_path = os.path.join(os.path.dirname(__file__), 'data', 'chizhevsky_dataset.csv')
df = pd.read_csv(data_path)
print(f"\n📊 Dataset cargado: {len(df)} eventos históricos")
print(f"   Rango: {df['year'].min()} a {df['year'].max()}")
print(f"   Excitabilidad media: {df['historical_excitability'].mean():.2f}/10")

# Features y target
feature_cols = ['sunspots', 'solar_wind', 'kp_index', 'flux_density']
X = df[feature_cols]
y = df['historical_excitability']

print(f"\n🔬 Features: {feature_cols}")
print(f"🎯 Target: historical_excitability (1-10)")

# Split train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Escalar features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Entrenar múltiples modelos
models = {
    'RandomForest': RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42),
    'GradientBoosting': GradientBoostingRegressor(n_estimators=100, max_depth=3, random_state=42),
    'LinearRegression': LinearRegression()
}

results = {}
best_model = None
best_score = -1

for name, model in models.items():
    print(f"\n🧠 Entrenando {name}...")
    model.fit(X_train_scaled, y_train)
    
    y_pred = model.predict(X_test_scaled)
    
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='r2')
    
    results[name] = {
        'model': model,
        'mae': mae,
        'rmse': rmse,
        'r2': r2,
        'cv_mean': cv_scores.mean(),
        'cv_std': cv_scores.std()
    }
    
    print(f"   MAE: {mae:.3f} | RMSE: {rmse:.3f} | R²: {r2:.3f} | CV R²: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
    
    if r2 > best_score:
        best_score = r2
        best_model = name

print(f"\n🏆 Mejor modelo: {best_model} (R² = {best_score:.3f})")

# Guardar el mejor modelo
model_dir = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(model_dir, exist_ok=True)

best_model_obj = results[best_model]['model']
joblib.dump(best_model_obj, os.path.join(model_dir, 'excitability_model.pkl'))
joblib.dump(scaler, os.path.join(model_dir, 'scaler.pkl'))

print(f"\n✅ Modelo guardado en: {model_dir}/excitability_model.pkl")
print(f"✅ Scaler guardado en: {model_dir}/scaler.pkl")

# Feature importance (para RandomForest o GradientBoosting)
if hasattr(best_model_obj, 'feature_importances_'):
    print("\n📊 Importancia de Features:")
    importances = best_model_obj.feature_importances_
    for feat, imp in zip(feature_cols, importances):
        bar = '█' * int(imp * 50)
        print(f"   {feat}: {imp:.3f} {bar}")

# Predicción de ejemplo
print("\n🔮 Predicción de ejemplo:")
example = np.array([[180, 600, 9, 200]])  # Máximo solar
example_scaled = scaler.transform(example)
prediction = best_model_obj.predict(example_scaled)[0]
print(f"   Máximo solar (sunspots=180, wind=600, Kp=9, flux=200):")
print(f"   Excitabilidad predicha: {prediction:.2f}/10")

example_min = np.array([[35, 310, 1, 90]])  # Mínimo solar
example_min_scaled = scaler.transform(example_min)
prediction_min = best_model_obj.predict(example_min_scaled)[0]
print(f"   Mínimo solar (sunspots=35, wind=310, Kp=1, flux=90):")
print(f"   Excitabilidad predicha: {prediction_min:.2f}/10")

# Guardar métricas
import json
metrics = {
    'best_model': best_model,
    'r2_score': float(best_score),
    'mae': float(results[best_model]['mae']),
    'rmse': float(results[best_model]['rmse']),
    'cv_r2_mean': float(results[best_model]['cv_mean']),
    'feature_importance': {
        feat: float(imp) for feat, imp in zip(feature_cols, importances)
    } if hasattr(best_model_obj, 'feature_importances_') else {}
}
with open(os.path.join(model_dir, 'metrics.json'), 'w') as f:
    json.dump(metrics, f, indent=2)

print(f"\n📈 Métricas guardadas en: {model_dir}/metrics.json")
print("\n✅ Entrenamiento completado.")
print("🌞 'El Sol no solo ilumina — regula.' — A.L. Chizhevsky")
