# Chizhevsky Labs — Cosmic Biology Intelligence Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0--beta-gold.svg)]()
[![Phase](https://img.shields.io/badge/phase-Moscú-red.svg)]()

> "La vida en la Tierra es el resultado de la dinámica del cosmos." — Alexander L. Chizhevsky (1897-1964)

**Chizhevsky Labs** es una plataforma avanzada de inteligencia biológica y heliobiología que resucita y digitaliza las cuatro disciplinas fundamentales diseñadas por el científico soviético Alexander Chizhevsky.

---

## 🚀 Guía de Instalación Rápida

### Requisitos Previos
- Docker y Docker Compose instalados globalmente.
- Node.js v20 o superior (en caso de ejecución nativa).

### Despliegue Mediante Docker (Stack Completo — Fase Moscú)

```bash
docker compose up --build
```

Esto levanta:

· Frontend React + TypeScript + Tailwind: http://localhost:5173
· Backend FastAPI + Python 3.12: http://localhost:8000
· API Docs Swagger: http://localhost:8000/docs
· TimescaleDB PostgreSQL + series temporales: localhost:5432

---

🛠️ Arquitectura Técnica

Frontend

· React.js con TypeScript
· Vite como bundler
· Tailwind CSS con tema cósmico
· Lucide React para iconografía

Backend (Fase Moscú)

· FastAPI — API REST asíncrona
· SQLAlchemy + asyncpg — ORM para PostgreSQL
· TimescaleDB — Base de datos de series temporales
· NOAA SWPC — Datos solares en tiempo real
· httpx — Cliente HTTP asíncrono

APIs Disponibles

Endpoint Método Descripción
/api/solar/current GET Métricas solares NOAA en tiempo real
/api/solar/historical GET 50 eventos históricos de Chizhevsky
/api/excitability/ POST Calculadora de Excitabilidad Biológica
/api/aerion/simulate GET Simulador de aero-ionización
/docs GET Documentación Swagger/OpenAPI
/health GET Health check

---

🧪 Cálculo del Índice de Excitabilidad Biológica

I_{eb} = \left(\frac{Kp}{9} \times 5 \times \alpha_{crono}\right) + (mood \times 0.3)

Donde:

· Kp: Índice planetario de perturbación geomagnética (0-9)
· α_crono: Factor de susceptibilidad (Lark=0.9, Intermediate=1.0, Owl=1.2)
· mood: Estado de ánimo subjetivo (1-10)

Referencia: Chizhevsky, A.L. (1924) "Factores Físicos del Proceso Histórico"

---

📊 Módulos

Módulo Estado Descripción
HELIOS ✅ Operativo Monitoreo solar, KPIs, calculadora de excitabilidad
AERION ✅ Operativo Simulador de aero-ionización con 3 modos
ASTROVIR 🔄 En desarrollo Vigilancia epidemiológica cósmica
CHRONOS ✅ Operativo Reloj biológico tricapa, ventanas de excitabilidad

---

🗺️ Roadmap

1. Fase Kaluga (Completada) ✅ — Frontend interactivo, calculadoras estáticas
2. Fase Moscú (Actual) 🔄 — Backend FastAPI, TimescaleDB, datos NOAA reales
3. Fase Cosmos (Futuro) 🌌 — IoT para ionizadores físicos, predicción social ética

---

📚 Documentación

· Bases Científicas
· Compromiso Ético
· API Docs

---

⚖️ Ética y Legado

Chizhevsky fue arrestado en 1942 por negarse a retractarse de sus teorías. Pasó 8 años en el Gulag de Karaganda. En Chizhevsky Labs:

1. Transparencia total: Algoritmos auditables y open-source
2. No determinismo: El Sol amplifica, no causa
3. Rehabilitación científica: 1% de ingresos al Chizhevsky Science Center en Kaluga

---

"Talló nuevos caminos y enfoques para la vasta extensión de campos inexplorados."
— International Journal of Biometeorology, obituario de Chizhevsky
