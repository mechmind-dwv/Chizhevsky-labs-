// ─── CHIZHEVSKY LABS — Design System ────────────────────────────────────────
// Inspired by: NASA data dashboards × Soviet Constructivism × Dark matter

export const Colors = {
  // Backgrounds
  bg0: '#0a0a0f',       // Deep space — main background
  bg1: '#0f0f1a',       // Panels
  bg2: '#141425',       // Cards
  bg3: '#1a1a30',       // Elevated cards
  bgOverlay: 'rgba(0,0,0,0.6)',

  // Solar palette
  solar: '#FFD700',
  solarDim: 'rgba(255,215,0,0.15)',
  solarBorder: 'rgba(255,215,0,0.2)',
  solarGlow: 'rgba(255,215,0,0.4)',
  solarDark: '#FFA500',

  // Module accent colors
  helios: '#FFD700',    // Solar gold
  aerion: '#FF6B35',    // Ion orange
  astrovir: '#FF4455',  // Bio red
  chronos: '#00BFFF',   // Circadian blue

  // Semantic
  danger: '#FF4444',
  warning: '#FFA500',
  success: '#4CAF50',
  info: '#00BFFF',

  // Text
  textPrimary: '#F5F5DC',    // Warm white
  textSecondary: '#AAAAAA',
  textMuted: '#666666',
  textDisabled: '#444444',

  // Borders
  border: 'rgba(255,255,255,0.06)',
  borderSolar: 'rgba(255,215,0,0.15)',
};

export const Typography = {
  // Display — monospaced for data readouts
  mono: 'Courier',

  // Sizes
  xs: 9,
  sm: 11,
  base: 13,
  md: 15,
  lg: 18,
  xl: 24,
  xxl: 32,
  display: 48,

  // Letter spacing
  spaced: 2,
  wide: 3,
  widest: 5,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 999,
};

export const Shadow = {
  solar: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
};

export default { Colors, Typography, Spacing, Radius, Shadow };
