import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CosmicClock } from '../components/CosmicClock';
import { SectionHeader } from '../components/SectionHeader';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { OPTIMAL_WINDOWS } from '../data/constants';
import { getLunarPhase, getDayOfYear, getSolarCyclePhase } from '../utils/helpers';
import { useStore } from '../hooks/useStore';

const MOOD_LABELS = ['😞', '😔', '😐', '🙂', '😊', '😄', '⚡', '🔥', '🌟', '☀'];

export function ChronosScreen() {
  const { user, logMood } = useStore(s => ({ user: s.user, logMood: s.logMood }));
  const [now, setNow] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodLogged, setMoodLogged] = useState(false);

  // Live clock tick
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours() + now.getMinutes() / 60;
  const dayOfYear = getDayOfYear(now);
  const lunarDay = dayOfYear % 29.5;
  const solarYear = getSolarCyclePhase(now.getFullYear()) - 1 + dayOfYear / 365;
  const lunarPhase = getLunarPhase(now);

  const handleLogMood = () => {
    if (selectedMood == null) return;
    logMood(selectedMood);
    setMoodLogged(true);
  };

  // Build last 30 days of mood data (simulated if empty)
  const moodHistory = user.moodLog.length > 0
    ? user.moodLog.slice(-14)
    : Array.from({ length: 14 }, (_, i) => ({
        date: '',
        value: 4 + Math.sin(i * 0.8) * 3 + Math.random(),
      }));

  const moodMax = Math.max(...moodHistory.map(m => m.value));

  const windowTypeColors: Record<string, string> = {
    creatividad: '#9B59B6',
    negociación: Colors.success,
    ejercicio: Colors.aerion,
    descanso: Colors.chronos,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Cosmic Clock */}
      <SectionHeader title="RELOJ BIOLÓGICO CÓSMICO — TRICAPA" color={Colors.chronos} />
      <View style={styles.clockCard}>
        <CosmicClock size={260} solarYear={solarYear} lunarDay={lunarDay} hourOfDay={hour} />

        {/* Ring legend */}
        <View style={styles.clockLegend}>
          {[
            { color: Colors.solar, label: 'Solar', sub: `Año ${Math.ceil(solarYear + 1)} / 11` },
            { color: '#C0C0C0', label: 'Lunar', sub: lunarPhase.name },
            { color: Colors.chronos, label: 'Circadiano', sub: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}` },
          ].map(l => (
            <View key={l.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: l.color }]} />
              <View>
                <Text style={[styles.legendLabel, { color: l.color }]}>{l.label}</Text>
                <Text style={styles.legendSub}>{l.sub}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Live cosmic status */}
      <View style={styles.cosmicRow}>
        <View style={[styles.cosmicChip, { borderColor: `${Colors.solar}33` }]}>
          <Text style={styles.cosmicChipIcon}>☀</Text>
          <Text style={styles.cosmicChipLabel}>Ciclo Solar</Text>
          <Text style={[styles.cosmicChipValue, { color: Colors.solar }]}>Año {Math.ceil(solarYear + 1)}/11</Text>
        </View>
        <View style={[styles.cosmicChip, { borderColor: 'rgba(192,192,192,0.3)' }]}>
          <Text style={styles.cosmicChipIcon}>{lunarPhase.icon}</Text>
          <Text style={styles.cosmicChipLabel}>Luna</Text>
          <Text style={[styles.cosmicChipValue, { color: '#C0C0C0' }]}>{lunarPhase.name}</Text>
        </View>
        <View style={[styles.cosmicChip, { borderColor: `${Colors.chronos}33` }]}>
          <Text style={styles.cosmicChipIcon}>🌐</Text>
          <Text style={styles.cosmicChipLabel}>Día del año</Text>
          <Text style={[styles.cosmicChipValue, { color: Colors.chronos }]}>{dayOfYear}/365</Text>
        </View>
      </View>

      {/* Mood logger */}
      <SectionHeader title="REGISTRO DE ESTADO DE ÁNIMO" color={Colors.chronos} />
      <View style={styles.card}>
        {moodLogged ? (
          <View style={styles.moodLoggedContainer}>
            <Text style={styles.moodLoggedIcon}>✓</Text>
            <Text style={styles.moodLoggedText}>Registrado — {MOOD_LABELS[(selectedMood ?? 5) - 1]}</Text>
            <TouchableOpacity onPress={() => setMoodLogged(false)}>
              <Text style={styles.moodResetText}>Cambiar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.moodQuestion}>¿Cómo te sientes hoy?</Text>
            <View style={styles.moodGrid}>
              {MOOD_LABELS.map((emoji, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedMood(i + 1)}
                  style={[
                    styles.moodBtn,
                    selectedMood === i + 1 && styles.moodBtnActive,
                  ]}
                >
                  <Text style={styles.moodEmoji}>{emoji}</Text>
                  <Text style={[styles.moodNum, selectedMood === i + 1 && { color: Colors.chronos }]}>
                    {i + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={handleLogMood}
              disabled={selectedMood == null}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={selectedMood != null ? ['#00BFFF', '#0080AA'] : [Colors.bg3, Colors.bg3]}
                style={styles.logBtn}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.logBtnText, selectedMood == null && { color: Colors.textMuted }]}>
                  REGISTRAR
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Mood sparkline */}
      <SectionHeader title="HISTORIAL — ÚLTIMOS 14 DÍAS" color={Colors.chronos} />
      <View style={styles.card}>
        <View style={styles.sparkRow}>
          {moodHistory.map((m, i) => (
            <View key={i} style={styles.sparkCol}>
              <View style={styles.sparkBarContainer}>
                <View style={[styles.sparkBar, {
                  height: `${(m.value / moodMax) * 100}%`,
                  backgroundColor: m.value >= 7 ? Colors.solar : m.value >= 5 ? Colors.chronos : Colors.textMuted,
                }]} />
              </View>
              <Text style={styles.sparkLabel}>{i % 2 === 0 ? `${14 - i}d` : ''}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.cardNote}>
          {user.moodLog.length === 0
            ? 'Datos simulados — registra tu primer estado de ánimo arriba.'
            : `${user.moodLog.length} días registrados · Media: ${(user.moodLog.reduce((s, m) => s + m.value, 0) / user.moodLog.length).toFixed(1)}/10`}
        </Text>
      </View>

      {/* Optimal windows */}
      <SectionHeader title="VENTANAS DE EXCITABILIDAD MÁXIMA" color={Colors.chronos} />
      <View style={styles.card}>
        {OPTIMAL_WINDOWS.map((w, i) => {
          const wColor = windowTypeColors[w.type] || Colors.solar;
          const isHigh = w.score >= 9;
          return (
            <View key={i} style={[styles.windowRow, isHigh && styles.windowRowHighlight]}>
              <Text style={styles.windowIcon}>{w.icon}</Text>
              <View style={styles.windowInfo}>
                <Text style={styles.windowDate}>{w.date}</Text>
                <Text style={[styles.windowType, { color: wColor }]}>
                  {w.type.charAt(0).toUpperCase() + w.type.slice(1)}
                </Text>
              </View>
              <View style={styles.windowScoreContainer}>
                <Text style={[styles.windowScore, { color: isHigh ? Colors.solar : Colors.textSecondary }]}>
                  {w.score}
                </Text>
                <Text style={styles.windowScoreMax}>/10</Text>
              </View>
              {isHigh && (
                <View style={styles.optimalBadge}>
                  <Text style={styles.optimalBadgeText}>ÓPTIMO</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Streak / gamification */}
      <SectionHeader title="SINCRONIZACIÓN CÓSMICA" color={Colors.chronos} />
      <View style={[styles.card, styles.streakCard]}>
        <LinearGradient
          colors={['rgba(0,191,255,0.06)', 'transparent']}
          style={styles.streakGrad}
        >
          <Text style={styles.streakNumber}>{user.streak}</Text>
          <Text style={styles.streakLabel}>días consecutivos</Text>
          <Text style={styles.streakSub}>Racha de sincronización cósmica ☀</Text>
          <View style={styles.streakDots}>
            {Array.from({ length: 7 }, (_, i) => (
              <View
                key={i}
                style={[styles.streakDot, i < (user.streak % 7) && styles.streakDotActive]}
              />
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* Science note */}
      <View style={styles.scienceCard}>
        <Text style={styles.scienceTitle}>🔬 LA CIENCIA · CRONOBIOLOGÍA</Text>
        <Text style={styles.scienceText}>
          Chizhevsky anticipó la cronobiología moderna al demostrar que los ritmos biológicos
          humanos no existen en aislamiento cósmico. Los ciclos circadianos de 24h están
          regulados por la luz solar; los ciclos mensuales correlacionan con el campo lunar;
          los ciclos de 11 años reflejan la actividad solar.{'\n\n'}
          El reloj tricapa visualiza la superposición de estos tres ritmos en tiempo real,
          ofreciendo una perspectiva que ninguna app de bienestar convencional contempla.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg0 },
  content: { padding: Spacing.lg, paddingBottom: 80 },

  clockCard: {
    backgroundColor: Colors.bg2, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: `${Colors.chronos}22`,
    padding: Spacing.md, alignItems: 'center', marginBottom: Spacing.xl,
  },
  clockLegend: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11, fontFamily: 'Courier', fontWeight: 'bold' },
  legendSub: { color: Colors.textMuted, fontSize: 9, fontFamily: 'Courier' },

  cosmicRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  cosmicChip: {
    flex: 1, backgroundColor: Colors.bg2, borderWidth: 1,
    borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center',
  },
  cosmicChipIcon: { fontSize: 18, marginBottom: 2 },
  cosmicChipLabel: { color: Colors.textMuted, fontSize: 8, fontFamily: 'Courier', letterSpacing: 1 },
  cosmicChipValue: { fontSize: 10, fontFamily: 'Courier', fontWeight: 'bold', textAlign: 'center', marginTop: 2 },

  card: {
    backgroundColor: Colors.bg2, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginBottom: Spacing.xl,
  },
  cardNote: { color: Colors.textMuted, fontSize: 10, fontFamily: 'Courier', marginTop: Spacing.sm },

  // Mood logger
  moodQuestion: { color: Colors.textSecondary, fontSize: 14, fontFamily: 'Courier', marginBottom: Spacing.md, textAlign: 'center' },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: Spacing.md },
  moodBtn: {
    width: 44, height: 52, backgroundColor: Colors.bg3,
    borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  moodBtnActive: { borderColor: Colors.chronos, backgroundColor: 'rgba(0,191,255,0.1)' },
  moodEmoji: { fontSize: 18 },
  moodNum: { color: Colors.textMuted, fontSize: 9, fontFamily: 'Courier', marginTop: 2 },
  logBtn: { borderRadius: Radius.full, padding: Spacing.md, alignItems: 'center' },
  logBtnText: { color: '#000', fontWeight: 'bold', letterSpacing: 2, fontSize: 12, fontFamily: 'Courier' },
  moodLoggedContainer: { alignItems: 'center', paddingVertical: Spacing.md },
  moodLoggedIcon: { fontSize: 32, color: Colors.chronos, fontFamily: 'Courier' },
  moodLoggedText: { color: Colors.textSecondary, fontSize: 14, fontFamily: 'Courier', marginTop: Spacing.xs },
  moodResetText: { color: Colors.chronos, fontSize: 11, fontFamily: 'Courier', marginTop: Spacing.sm },

  // Sparkline
  sparkRow: { flexDirection: 'row', alignItems: 'flex-end', height: 64, gap: 3 },
  sparkCol: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  sparkBarContainer: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  sparkBar: { width: '100%', borderRadius: 2, minHeight: 2 },
  sparkLabel: { color: Colors.textMuted, fontSize: 7, fontFamily: 'Courier', marginTop: 2 },

  // Windows
  windowRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    padding: Spacing.sm, borderRadius: Radius.sm,
    marginBottom: Spacing.xs,
  },
  windowRowHighlight: { backgroundColor: 'rgba(255,215,0,0.04)' },
  windowIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  windowInfo: { flex: 1 },
  windowDate: { color: Colors.textSecondary, fontSize: 12, fontFamily: 'Courier' },
  windowType: { fontSize: 10, fontFamily: 'Courier' },
  windowScoreContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 1 },
  windowScore: { fontSize: 20, fontFamily: 'Courier', fontWeight: 'bold' },
  windowScoreMax: { color: Colors.textMuted, fontSize: 10, fontFamily: 'Courier' },
  optimalBadge: {
    backgroundColor: 'rgba(255,215,0,0.12)', borderRadius: 4,
    paddingHorizontal: 5, paddingVertical: 2,
    borderWidth: 1, borderColor: Colors.solarBorder,
  },
  optimalBadgeText: { color: Colors.solar, fontSize: 7, fontFamily: 'Courier', letterSpacing: 1 },

  // Streak
  streakCard: { padding: 0, overflow: 'hidden' },
  streakGrad: { padding: Spacing.xl, alignItems: 'center' },
  streakNumber: { color: Colors.chronos, fontSize: 56, fontFamily: 'Courier', fontWeight: 'bold', lineHeight: 60 },
  streakLabel: { color: Colors.textSecondary, fontSize: Typography.md, fontFamily: 'Courier' },
  streakSub: { color: Colors.textMuted, fontSize: 11, fontFamily: 'Courier', marginTop: 4 },
  streakDots: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  streakDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border },
  streakDotActive: { backgroundColor: Colors.chronos, borderColor: Colors.chronos },

  // Science
  scienceCard: {
    backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, padding: Spacing.lg,
  },
  scienceTitle: { color: Colors.solar, fontSize: Typography.xs, letterSpacing: 2, fontFamily: 'Courier', marginBottom: Spacing.sm },
  scienceText: { color: Colors.textMuted, fontSize: 12, lineHeight: 18, fontFamily: 'Courier' },
});
