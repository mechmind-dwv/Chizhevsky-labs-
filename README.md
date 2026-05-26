# ☀ CHIZHEVSKY LABS
### Cosmic Biology Intelligence Platform

> *"El Sol no solo ilumina — regula."*  
> — Alexander Leonidovich Chizhevsky (1897–1964)

---

## En honor a Chizhevsky

Alexander Leonidovich Chizhevsky fundó la **heliobiología** y la **aero-ionización**, anticipó la cronobiología moderna, y fue arrestado en 1942 por negarse a retractarse de sus teorías frente a Stalin. Pasó 8 años en el Gulag de Karaganda. Murió en 1964 con una lápida que lleva un sol grabado.

Esta plataforma es la digitalización de su visión silenciada.

---

## Los 4 Pilares Científicos

| Módulo | Disciplina | Fundador | Aplicación |
|--------|-----------|----------|------------|
| ☀ **HELIOS** | Heliobiología | Chizhevsky (1924) | Datos solares en tiempo real + Índice de Excitabilidad Biológica |
| ⚡ **AERION** | Aero-ionización | Chizhevsky (1918) | Control de iones terapéuticos + Chandelier IoT |
| 🦠 **ASTROVIR** | Astrovirología | Chizhevsky-Velkhover (1935) | Vigilancia epidemiológica cósmica |
| ⏱ **CHRONOS** | Cronobiología | Anticipada por Chizhevsky | Reloj biológico tricapa + Ventanas óptimas |

---

## Stack Tecnológico

```
Frontend:    React Native (Expo SDK 51) + TypeScript
Navigation:  React Navigation 6 (Stack + Bottom Tabs)
State:       Zustand
Data:        NOAA/SWPC API (fallback simulado)
Gráficos:    react-native-svg (custom components)
Animaciones: react-native-reanimated
Build:       EAS Build (Expo Application Services)
```

---

## Instalación Rápida

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI para builds (`npm install -g eas-cli`)

### Setup

```bash
# 1. Clonar
git clone https://github.com/tu-usuario/chizhevsky-labs.git
cd chizhevsky-labs

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm start            # Expo DevTools
npm run android      # Android emulator
npm run ios          # iOS simulator
npm run web          # Web browser
```

### Build APK (Android)

```bash
# Login en EAS
eas login

# Configurar proyecto (primera vez)
eas build:configure

# Build APK de preview (para distribuir internamente)
npm run build:apk
# o directamente:
eas build --platform android --profile preview

# Build bundle para Google Play (producción)
npm run build:android
# o:
eas build --platform android --profile production
```

### Build iOS

```bash
# Requiere cuenta Apple Developer
eas build --platform ios --profile preview
```

---

## Estructura del Proyecto

```
chizhevsky-labs/
├── App.tsx                          # Entry point
├── app.json                         # Expo config
├── eas.json                         # EAS Build profiles
├── package.json
├── tsconfig.json
├── babel.config.js
│
├── src/
│   ├── components/
│   │   ├── SunIcon.tsx              # Animated sun SVG
│   │   ├── CosmicClock.tsx          # Tricycle biological clock
│   │   ├── StatCard.tsx             # Reusable stat display
│   │   ├── SectionHeader.tsx        # Section titles
│   │   └── MiniBarChart.tsx         # Custom bar charts
│   │
│   ├── screens/
│   │   ├── LandingScreen.tsx        # Onboarding / landing
│   │   ├── HeliosScreen.tsx         # Solar intelligence module
│   │   ├── AerionScreen.tsx         # Aero-ionization module
│   │   ├── AstrovirScreen.tsx       # Epidemiological module
│   │   ├── ChronosScreen.tsx        # Chronobiology module
│   │   └── ProfileScreen.tsx        # User profile + achievements
│   │
│   ├── hooks/
│   │   ├── useSolarData.ts          # Real-time solar data (NOAA + simulation)
│   │   └── useStore.ts              # Zustand global state
│   │
│   ├── data/
│   │   └── constants.ts             # All static datasets
│   │
│   ├── utils/
│   │   └── helpers.ts               # EI calculation, lunar phase, etc.
│   │
│   ├── navigation/
│   │   └── index.tsx                # Stack + Tab navigation
│   │
│   └── theme/
│       └── index.ts                 # Design system tokens
│
└── assets/
    ├── fonts/
    ├── images/
    └── icons/
```

---

## Roadmap

### Fase 1: Kaluga (Año 1) ✅ MVP
- [x] 4 módulos científicos funcionales
- [x] Datos solares NOAA/SWPC con fallback simulado
- [x] Calculadora de Índice de Excitabilidad Biológica
- [x] Reloj biológico cósmico tricapa
- [x] Sistema de logros y gamificación
- [x] Build APK via EAS

### Fase 2: Moscú (Año 2) 🔧 En desarrollo
- [ ] Hardware Chandelier IoT (ionizador conectado)
- [ ] Base de datos epidemiológica propia (Efecto Chizhevsky-Velkhover)
- [ ] Partnerships con hospitales para ensayos clínicos
- [ ] Notificaciones push para tormentas solares
- [ ] Widget iOS/Android

### Fase 3: Cosmos (Año 3) 🚀 Visión
- [ ] Integración con datos satelitales directos
- [ ] Plataforma para astronautas
- [ ] Modelo predictivo de "excitabilidad social" (versión ética)
- [ ] API pública para investigadores

---

## Ética y Legado

1. **Transparencia total** — Todos los algoritmos de correlación solar son auditables y open-source
2. **No determinismo** — El Sol amplifica condiciones existentes; no predice ni determina el futuro
3. **No sustituye medicina** — Esta app es informativa; consulta siempre profesionales de salud
4. **Rehabilitación científica** — 1% de ingresos al [Chizhevsky Science Center](https://museum-kaluga.ru), Kaluga

---

## Contribuir

```bash
# Fork + clone
git checkout -b feature/mi-mejora
# Desarrolla tu feature
git commit -m "feat: descripción clara"
git push origin feature/mi-mejora
# Abre un Pull Request
```

---

## Licencia

MIT — Úsalo, mejóralo, y recuerda siempre al científico que lo inspiró.

---

> *"Talló nuevos caminos y enfoques para la vasta extensión de campos inexplorados."*  
> — International Journal of Biometeorology, obituario de Chizhevsky, 1964

☀ *Chizhevsky Labs — Sincronizando la biología con el cosmos desde 2025*
