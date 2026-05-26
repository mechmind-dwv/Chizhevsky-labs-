import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatCard } from '../components/StatCard';
import { SectionHeader } from '../components/SectionHeader';
import { MiniBarChart } from '../components/MiniBarChart';
import { useSolarData } from '../hooks/useSolarData';
import { useStore } from '../hooks/useStore';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { HISTORICAL_EVENTS, SOLAR_DATA_MONTHS } from '../data/constants';
import {
  calcExcitabilityIndex, getEIDescription, getKpRiskLevel,
  getSolarCyclePhase,
} from '../utils/helpers';

export function HeliosScreen() {
  const solar = useSolarData();
  const { user, setUser } = useStore(s => ({ user: s.user, setUser: s.setUser }));
  const [chronotype, setChronotype] = useState<'madrugador' | 'intermedio' | 'nocturno'>(user.chronotype);
  const [mood, setMood] = useState(7);
  const [ei, setEI] = useState<number | null>(null);
  const [eiCalced, setEICalced] = useState(false);

  const kpStatus = getKpRiskLevel(solar.kp);
  const cyclePhase = getSolarCyclePhase(new Date().getFullYear());

  const handleCalcEI = () => {
    const result = calcExcitabilityIndex(user.birthYear, chronotype, mood, solar.kp);
    setEI(result);
    setEICalced(true);
    setUser({ chronotype });
  };

  const eiDesc = ei ? getEIDescription(ei) : null;

  const chartData = SOLAR_DATA_MONTHS.map(m => ({ label: m.month.slice(0, 1), value: m.spots }));

  const CHRONOTYPES = [
    { id: 'madrugador' as const, label: '🌅 Madrugador' },
    { id: 'intermedio' as const, label: '🌤 Intermedio' },
    { id: 'nocturno' as const, label: '🌙 Nocturno' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Live solar stats */}
      <SectionHeader
        title="ACTIVIDAD SOLAR — TIEMPO REAL"
        badge={solar.isSimulated ? 'SIMULADO' : 'NOAA LIVE'}
        color={Colors.helios}
      />
      <View style={styles.statsRow}>
        <StatCard label="MANCHAS SOLARES" value={solar.spots} color={Colors.helios} />
        <StatCard label="KP-INDEX" value={solar.kp.toFixed(1)} color={kpStatus.color} badge={kpStatus.level} />
        <StatCard label="VIENTO SOLAR" value={solar.wind} unit="km/s" color={Colors.info} />
      </View>

      {/* Storm alert */}
      {solar.stormAlert && (
        <View style={[styles.alertBanner, { borderColor: `${Colors.danger}55` }]}>
          <LinearGradient colors={['rgba(255,68,68,0.12)', 'rgba(255,68,68,0.04)']} style={styles.alertGrad}>
            <Text style={styles.alertText}>⚠ TORMENTA GEOMAGNÉTICA ACTIVA — Kp {solar.kp.toFixed(1)}</Text>
            <Text style={styles.alertSub}>Evita decisiones de alto riesgo. Refuerza tu protocolo inmunológico.</Text>
          </LinearGradient>
        </View>
      )}

      {/* Solar cycle */}
      <SectionHeader title="CICLO SOLAR 25 — POSICIÓN ACTUAL" color={Colors.helios} />
      <View style={styles.card}>
        <View style={styles.cycleRow}>
          {Array.from({ length: 11 }, (_, i) => (
            <View key={i} style={[
              styles.cycleTick,
              i + 1 === cyclePhase && styles.cycleTickActive,
            ]}>
              <Text style={[styles.cycleNum, i + 1 === cyclePhase && { color: Colors.solar }]}>
                {i + 1}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.cycleLabel}>Año {cyclePhase} de 11 · Ciclo solar en progreso</Text>
      </View>

      {/* Chart */}
      <SectionHeader title="MANCHAS SOLARES — 2025" color={Colors.helios} />
      <View style={styles.card}>
        <MiniBarChart data={chartData} color={Colors.helios} height={70} />
      </View>

      {/* EI Calculator */}
      <SectionHeader title="CALCULADORA — ÍNDICE DE EXCITABILIDAD BIOLÓGICA" color={Colors.helios} />
      <View style={styles.card}>

        {/* Chronotype selector */}
        <Text style={styles.inputLabel}>CRONOTIPO</Text>
        <View style={styles.chronoRow}>
          {CHRONOTYPES.map(c => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setChronotype(c.id)}
              style={[styles.chronoBtn, chronotype === c.id && styles.chronoBtnActive]}
            >
              <Text style={[styles.chronoText, chronotype === c.id && { color: Colors.solar }]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mood slider (simple row) */}
        <Text style={styles.inputLabel}>ESTADO DE ÁNIMO HOY: {mood}/10</Text>
        <View style={styles.moodRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
            <TouchableOpacity
              key={v}
              onPress={() => setMood(v)}
              style={[styles.moodBtn, mood === v && styles.moodBtnActive]}
            >
              <Text style={[styles.moodNum, mood === v && { color: Colors.solar }]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleCalcEI} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.calcBtn}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Text style={styles.calcBtnText}>CALCULAR MI ÍNDICE</Text>
          </LinearGradient>
        </TouchableOpacity>

        {eiCalced && eiDesc && (
          <View style={[styles.eiResult, { borderColor: `${eiDesc.color}44` }]}>
            <Text style={styles.eiLabel}>ÍNDICE DE EXCITABILIDAD BIOLÓGICA</Text>
            <Text style={[styles.eiValue, { color: eiDesc.color }]}>{ei}</Text>
            <Text style={styles.eiDesc}>{eiDesc.icon}  {eiDesc.text}</Text>
          </View>
        )}
      </View>

      {/* Historical events */}
      <SectionHeader title="HISTORIOMETRÍA — CORRELACIÓN SOLAR" color={Colors.helios} />
      <View style={styles.card}>
        {HISTORICAL_EVENTS.slice(0, 10).map((ev, i) => {
          const barColor = ev.ei > 9 ? Colors.danger : ev.ei > 8 ? Colors.warning : Colors.solar;
          return (
            <View key={i} style={styles.eventRow}>
              <Text style={styles.eventYear}>
                {ev.year < 0 ? `${Math.abs(ev.year)}aC` : ev.year}
              </Text>
              <View style={styles.eventBar}>
                <View style={[styles.eventBarFill, { width: `${(ev.ei / 10) * 100}%`, backgroundColor: barColor }]} />
              </View>
              <Text style={styles.eventName} numberOfLines={1}>{ev.event}</Text>
              <Text style={[styles.eventEI, { color: barColor }]}>{ev.ei}</Text>
            </View>
          );
        })}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg0 },
  content: { padding: Spacing.lg, paddingBottom: 80 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  alertBanner: { marginBottom: Spacing.xl, borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden' },
  alertGrad: { padding: Spacing.md },
  alertText: { color: Colors.danger, fontSize: Typography.sm, fontFamily: 'Courier', fontWeight: 'bold' },
  alertSub: { color: Colors.textMuted, fontSize: Typography.xs, marginTop: 4, fontFamily: 'Courier' },
  card: {
    backgroundColor: Colors.bg2, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginBottom: Spacing.xl,
  },
  cycleRow: { flexDirection: 'row', gap: 4, marginBottom: Spacing.sm },
  cycleTick: {
    flex: 1, height: 28, backgroundColor: Colors.bg3,
    borderRadius: 4, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'transparent',
  },
  cycleTickActive: {
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderColor: Colors.solarBorder,
  },
  cycleNum: { color: Colors.textMuted, fontSize: 10, fontFamily: 'Courier' },
  cycleLabel: { color: Colors.textMuted, fontSize: Typography.xs, fontFamily: 'Courier', textAlign: 'center' },
  inputLabel: {
    color: Colors.textMuted, fontSize: Typography.xs,
    letterSpacing: 1.5, fontFamily: 'Courier', marginBottom: Spacing.sm,
  },
  chronoRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  chronoBtn: {
    flex: 1, backgroundColor: Colors.bg3,
    borderRadius: Radius.sm, padding: Spacing.sm,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  chronoBtnActive: { borderColor: Colors.solarBorder, backgroundColor: Colors.solarDim },
  chronoText: { color: Colors.textMuted, fontSize: 11, fontFamily: 'Courier' },
  moodRow: { flexDirection: 'row', gap: 4, marginBottom: Spacing.md },
  moodBtn: {
    flex: 1, height: 32, backgroundColor: Colors.bg3,
    borderRadius: 4, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  moodBtnActive: { borderColor: Colors.solarBorder, backgroundColor: Colors.solarDim },
  moodNum: { color: Colors.textMuted, fontSize: 11, fontFamily: 'Courier' },
  calcBtn: { borderRadius: Radius.full, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm },
  calcBtnText: { color: '#000', fontWeight: 'bold', letterSpacing: 2, fontSize: 12, fontFamily: 'Courier' },
  eiResult: {
    marginTop: Spacing.lg, borderRadius: Radius.md, borderWidth: 1,
    padding: Spacing.lg, alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.04)',
  },
  eiLabel: { color: Colors.textMuted, fontSize: 9, letterSpacing: 2, fontFamily: 'Courier' },
  eiValue: { fontSize: 52, fontFamily: 'Courier', fontWeight: 'bold', lineHeight: 60 },
  eiDesc: { color: Colors.textSecondary, fontSize: 12, textAlign: 'center', fontFamily: 'Courier', marginTop: 4 },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 10 },
  eventYear: { color: Colors.solar, fontFamily: 'Courier', fontSize: 11, width: 44, opacity: 0.7 },
  eventBar: { width: 60, height: 4, backgroundColor: Colors.bg3, borderRadius: 2 },
  eventBarFill: { height: '100%', borderRadius: 2 },
  eventName: { flex: 1, color: Colors.textSecondary, fontSize: 11, fontFamily: 'Courier' },
  eventEI: { fontFamily: 'Courier', fontSize: 10, width: 28 },
});
