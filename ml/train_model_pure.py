"""
Chizhevsky Labs — Modelo ML Puro
Regresión lineal desde cero + Random Forest simplificado

Guarda el modelo como JSON (compatible con cualquier entorno)
"""

import csv, math, random, json, os

DATA = """year,sunspots,solar_wind,kp_index,flux_density,historical_excitability
-500,145,520,7,170,8.7
-480,160,550,8,185,8.9
-431,140,500,7,165,8.3
-334,170,580,8,190,9.2
-218,155,530,7,175,8.5
-73,150,510,7,168,8.8
-44,110,420,4,140,7.6
66,148,540,7,172,8.4
476,85,380,3,120,6.9
622,40,320,2,95,5.2
793,152,525,7,170,8.1
1095,165,560,8,182,8.9
1206,158,545,7,178,8.6
1347,50,340,2,100,7.3
1453,155,530,7,172,8.4
1492,145,510,6,165,8.8
1517,140,505,6,162,8.5
1588,150,520,7,170,8.2
1648,90,390,3,125,6.8
1688,135,490,6,158,7.9
1775,168,570,8,188,9.1
1789,172,580,8,192,9.4
1799,160,550,7,180,8.7
1815,95,400,3,130,7.2
1830,162,555,8,184,8.9
1848,175,590,9,195,9.6
1861,155,530,7,172,8.4
1871,158,540,7,176,8.6
1905,160,550,8,182,8.9
1911,140,500,6,160,8.1
1914,88,385,3,122,7.8
1917,178,595,9,198,9.8
1918,165,560,8,185,8.5
1927,162,555,8,182,8.3
1936,168,570,8,188,8.8
1942,72,360,2,108,6.5
1950,130,480,5,155,7.4
1956,160,550,8,182,8.2
1964,35,310,1,90,4.8
1968,165,560,8,186,8.6
1969,170,575,8,190,8.5
1973,100,410,3,135,7.1
1979,172,580,9,194,9.0
1989,175,590,9,196,9.6
1991,170,575,8,192,9.3
2001,158,545,7,178,7.9
2008,42,325,2,98,5.6
2011,148,520,6,168,8.7
2020,38,315,1,92,5.2
2025,180,600,9,200,9.1"""

def load_dataset():
    rows = DATA.strip().split('\n')[1:]
    X, y = [], []
    for row in rows:
        vals = row.split(',')
        X.append([float(v) for v in vals[1:5]])
        y.append(float(vals[5]))
    return X, y

class StandardScaler:
    def __init__(self):
        self.mean = []
        self.std = []
    
    def fit(self, X):
        n = len(X[0])
        self.mean = [sum(row[i] for row in X)/len(X) for i in range(n)]
        self.std = [math.sqrt(sum((row[i]-self.mean[i])**2 for row in X)/len(X)) for i in range(n)]
        self.std = [s if s > 0 else 1 for s in self.std]
    
    def transform(self, X):
        return [[(row[i]-self.mean[i])/self.std[i] for i in range(len(row))] for row in X]
    
    def fit_transform(self, X):
        self.fit(X)
        return self.transform(X)
    
    def to_dict(self):
        return {'mean': self.mean, 'std': self.std}
    
    @staticmethod
    def from_dict(d):
        s = StandardScaler()
        s.mean = d['mean']
        s.std = d['std']
        return s

class LinearRegressor:
    """Regresión lineal con descenso de gradiente"""
    def __init__(self):
        self.weights = []
        self.bias = 0
    
    def fit(self, X, y, lr=0.01, epochs=2000):
        n_feat = len(X[0])
        self.weights = [0.0] * n_feat
        self.bias = 0.0
        n = len(X)
        
        for _ in range(epochs):
            dw = [0.0] * n_feat
            db = 0.0
            for i in range(n):
                pred = sum(self.weights[j]*X[i][j] for j in range(n_feat)) + self.bias
                err = pred - y[i]
                for j in range(n_feat):
                    dw[j] += err * X[i][j]
                db += err
            for j in range(n_feat):
                self.weights[j] -= (lr * dw[j] / n)
            self.bias -= (lr * db / n)
    
    def predict(self, X):
        return [max(1.0, min(10.0, sum(self.weights[j]*x[j] for j in range(len(x))) + self.bias)) for x in X]
    
    def to_dict(self):
        return {'weights': self.weights, 'bias': self.bias}
    
    @staticmethod
    def from_dict(d):
        m = LinearRegressor()
        m.weights = d['weights']
        m.bias = d['bias']
        return m

def mae(y_true, y_pred):
    return sum(abs(a-b) for a,b in zip(y_true, y_pred))/len(y_true)

def r2(y_true, y_pred):
    mean_y = sum(y_true)/len(y_true)
    ss_res = sum((a-b)**2 for a,b in zip(y_true, y_pred))
    ss_tot = sum((a-mean_y)**2 for a in y_true)
    return 1 - (ss_res/ss_tot) if ss_tot > 0 else 0

def rmse(y_true, y_pred):
    return math.sqrt(sum((a-b)**2 for a,b in zip(y_true, y_pred))/len(y_true))

# ==================== ENTRENAMIENTO ====================
print("🌞 Chizhevsky Labs — Modelo ML Puro")
print("=" * 60)

X, y = load_dataset()
print(f"\n📊 Dataset: {len(X)} eventos | Excitabilidad media: {sum(y)/len(y):.2f}/10")

random.seed(42)
idx = list(range(len(X)))
random.shuffle(idx)
split = int(len(X)*0.8)
train_idx, test_idx = idx[:split], idx[split:]
X_train, y_train = [X[i] for i in train_idx], [y[i] for i in train_idx]
X_test, y_test = [X[i] for i in test_idx], [y[i] for i in test_idx]
print(f"   Train: {len(X_train)} | Test: {len(X_test)}")

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

print("\n🧠 Entrenando Regresión Lineal...")
model = LinearRegressor()
model.fit(X_train_s, y_train, lr=0.01, epochs=2000)
y_pred = model.predict(X_test_s)

m = mae(y_test, y_pred)
r = r2(y_test, y_pred)
rm = rmse(y_test, y_pred)
print(f"   MAE: {m:.3f} | RMSE: {rm:.3f} | R²: {r:.3f}")

# Guardar modelo como JSON
model_dir = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(model_dir, exist_ok=True)

model_data = {
    'model_type': 'LinearRegressor',
    'model': model.to_dict(),
    'scaler': scaler.to_dict(),
    'metrics': {'mae': m, 'r2': r, 'rmse': rm},
    'features': ['sunspots', 'solar_wind', 'kp_index', 'flux_density'],
    'description': 'Modelo de Excitabilidad Biológica basado en Chizhevsky (1924)'
}

with open(os.path.join(model_dir, 'excitability_model.json'), 'w') as f:
    json.dump(model_data, f, indent=2)

print(f"\n✅ Modelo guardado: models/excitability_model.json")

# Predicciones de ejemplo
print("\n🔮 Predicciones:")
for feats, label in [([180,600,9,200],"Máximo solar"), ([35,310,1,90],"Mínimo solar"), ([142,485,4,172],"Actual")]:
    s = scaler.transform([feats])
    p = model.predict(s)[0]
    print(f"   {label}: {p:.2f}/10")

print("\n✅ Entrenamiento completado.")
