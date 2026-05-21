from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.solar import router as solar_router
from app.api.excitability import router as excitability_router
from app.api.aerion import router as aerion_router
from app.db.init_db import init_database
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Inicializa la base de datos al arrancar."""
    print("🌞 Chizhevsky Labs Backend — Fase Moscú")
    print("🔗 Inicializando conexión a TimescaleDB...")
    init_database()
    print("✅ Backend listo.")
    yield
    print("🛑 Apagando backend...")

app = FastAPI(
    title="Chizhevsky Labs API",
    description="""Cosmic Biology Intelligence Platform
    
## Módulos disponibles:
- **HELIOS**: Monitoreo de ciclos solares y su impacto biológico
- **AERION**: Control de aero-ionización terapéutica
- **ASTROVIR**: Vigilancia epidemiológica cósmica (próximamente)
- **CHRONOS**: Sincronización de ritmos biológicos con ciclos cósmicos

Basado en el trabajo de Alexander Leonidovich Chizhevsky (1897-1964).
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
app.include_router(solar_router)
app.include_router(excitability_router)
app.include_router(aerion_router)

@app.get("/")
async def root():
    return {
        "name": "Chizhevsky Labs API",
        "version": "1.0.0",
        "phase": "Moscú",
        "docs": "/docs",
        "status": "operational",
        "founder": "Alexander Leonidovich Chizhevsky (1897-1964)",
        "quote": "El Sol no solo ilumina — regula."
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": "2026-05-21"}
