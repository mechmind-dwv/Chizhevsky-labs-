# Chizhevsky Labs — Cosmic Biology Intelligence Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0--beta-gold.svg)]()

> "La vida en la Tierra es el resultado de la dinámica del cosmos." — Alexander L. Chizhevsky (1897-1964)

**Chizhevsky Labs** es una plataforma avanzada de inteligencia biológica cuántica y heliobiología que resucita y digitaliza las cuatro disciplinas fundamentales diseñadas por el genio e investigador soviético Alexander Chizhevsky. La aplicación monitoriza de forma predictiva los efectos del clima espacial (Space Weather) sobre la biosfera y el tejido social humano.

---

## 🚀 Guía de Instalación Rápida

### Requisitos Previos
- Docker y Docker Compose instalados globalmente.
- Node.js v20 o superior (en caso de ejecución nativa).

### Despliegue Mediante Docker (Stack Completo)
Para levantar el ecosistema completo (Frontend en React, Servidor TimescaleDB de series de tiempo e infraestructura de red con variables de entorno precargadas) ejecuta el siguiente comando en la raíz del repositorio:

```bash
docker-compose up --build
```

Una vez finalizado el proceso de orquestación, abre tu navegador en:
👉 http://localhost:5173

🛠️ Arquitectura Técnica de la Plataforma

· Frontend: React.js con TypeScript, empaquetado ultra-rápido mediante Vite y estilizado industrial Constructivista usando Tailwind CSS.
· Base de Datos de Tiempo Real: PostgreSQL + TimescaleDB para ingesta paralela de series cronológicas de viento solar.
· APIs de Referencia: Integración modular con el NOAA Space Weather Prediction Center.

🗺️ Roadmap de Evolución Cósmica

1. Fase Kaluga (Actual): Lanzamiento del Core del Frontend interactivo, calculadoras estáticas e índices simulados de afectación cortical.
2. Fase Moscú: Integración de los modelos predictivos en Python (FastAPI) para el procesamiento bio-geomagnético en vivo.
3. Fase Cosmos: Pasarela IoT completa para control de aero-ionizadores físicos en tiempo real.
