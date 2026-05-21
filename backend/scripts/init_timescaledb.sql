-- Chizhevsky Labs — Inicialización TimescaleDB
-- Fase Moscú

-- Habilitar extensión TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Tabla de métricas solares (serie temporal)
CREATE TABLE IF NOT EXISTS solar_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sunspots INTEGER NOT NULL,
    solar_wind DOUBLE PRECISION NOT NULL,
    kp_index INTEGER NOT NULL,
    flux_density DOUBLE PRECISION NOT NULL
);

-- Convertir en hipertabla de TimescaleDB
SELECT create_hypertable('solar_metrics', 'timestamp', if_not_exists => TRUE);

-- Índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_solar_metrics_timestamp ON solar_metrics (timestamp DESC);

-- Tabla de eventos históricos
CREATE TABLE IF NOT EXISTS historical_events (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    epoch VARCHAR(100) NOT NULL,
    event VARCHAR(500) NOT NULL,
    solar_phase VARCHAR(50) NOT NULL,
    estimated_excitability DOUBLE PRECISION NOT NULL,
    description TEXT
);

-- Índice para búsquedas históricas
CREATE INDEX IF NOT EXISTS idx_historical_events_year ON historical_events (year);
CREATE INDEX IF NOT EXISTS idx_historical_events_solar_phase ON historical_events (solar_phase);
