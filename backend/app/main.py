from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.solar import router as solar_router
from app.api.excitability import router as excitability_router
from app.api.aerion import router as aerion_router
from app.api.nasa import router as nasa_router
from app.db.init_db import init_database
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🌞 Chizhevsky Labs Backend — Fase Moscú")
    print("🔗 Inicializando base de datos...")
    init_database()
    print("✅ Backend listo.")
    yield
    print("🛑 Apagando backend...")

app = FastAPI(
    title="Chizhevsky Labs API",
    description="Cosmic Biology Intelligence Platform con NASA DONKI",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(solar_router)
app.include_router(excitability_router)
app.include_router(aerion_router)
app.include_router(nasa_router)

@app.get("/")
async def root():
    return {
        "name": "Chizhevsky Labs API",
        "version": "1.0.0",
        "phase": "Moscú",
        "docs": "/docs",
        "status": "operational",
        "founder": "Alexander Leonidovich Chizhevsky (1897-1964)",
        "quote": "El Sol no solo ilumina — regula.",
        "nasa_donki": "/api/nasa/space-weather"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": "2026-05-21"}
