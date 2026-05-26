import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SectionHeader } from '../components/SectionHeader';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { REGIONAL_RISKS, PROTOCOLS } from '../data/constants';
import { useSolarData } from '../hooks/useSolarData';
import { getKpRiskLevel } from '../utils/helpers';

const TIMELINE_EVENTS = [
  { days: -3, label: 'Eyrupción solar clase X1.4', type: 'solar', severity: 'alta' },
  { days: -1, label: 'Onda de choque detectada', type: 'geomag', severity: 'moderada' },
  { days: 0, label: 'Tormenta Kp activa — MONITOREO', type: 'biológico', severity: 'activa' },
  { days: 2, label: 'Ventana post-tormenta', type: 'recuperación', severity: 'baja' },
  { days: 5, label: 'Predicción: nuevo máximo solar', type: 'predicción', severity: 'moderada' },
  { days: 9, label: 'Regreso a baseline geomagnético', type: 'predicción', severity: 'baja' },
];

const VELKHOVER_DATA = [
  { label: 'Ene', bacterMeta: 12, kp: 2.1 },
  { label: 'Feb', bacterMeta: 18, kp: 3.4 },
  { label: 'Mar', bacterMeta: 34, kp: 5.2 },
  { label: 'Abr', bacterMeta: 28, kp: 4.1 },
  { label: 'May', bacterMeta: 52, kp: 6.3 },
  { label: 'Jun', bacterMeta: 71, kp: 7.1 },
  { label: 'Jul', bacterMeta: 58, kp: 5.8 },
  { label: 'Ago', bacterMeta: 40, kp: 4.2 },
  { label: 'Sep', bacterMeta: 29, kp: 3.8 },
];

export function AstrovirScreen() {
  const solar = useSolarData();
  const kpStatus = getKpRiskLevel(solar.kp);
  const [expandedProtocol, setExpandedProtocol] = useState(false);

  const severityColors: Record<string, string> = {
    alta: Colors.danger,
    moderada: Colors.warning,
    activa: Colors.solar,
    baja: Colors.success,
  };

  const globalRisk = Math.min((solar.kp / 9), 1);
  const globalRiskPct = (globalRisk * 100).toFixed(0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Global Risk Banner */}
      <View style={[styles.riskBanner, { borderColor: `${kpStatus.color}44` }]}>
        <LinearGradient
          colors={[`${kpStatus.color}14`, `${kpStatus.color}04`]}
          style={styles.riskGrad}
        >
          <Text style={styles.riskSmall}>NIVEL DE RIESGO BIOLÓGICO GLOBAL</Text>
          <Text style={[styles.riskLevel, { color: kpStatus.color }]}>{kpStatus.level}</Text>
          <Text style={styles.riskDesc}>Kp-{solar.kp.toFixed(1)} · {kpStatus.desc}</Text>
          <Text style={styles.riskBasis}>Efecto Chizhevsky–Velkhover (1935)</Text>

          {/* Risk bar */}
          <View style={styles.riskBarBg}>
            <LinearGradient
              colors={['#4CAF50', '#FFA500', '#FF4444']}
              style={[styles.riskBarFill]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
            {/* Pointer */}
            <View style={[styles.riskPointer, { left: `${globalRisk * 100}%` as any }]}>
              <View style={[styles.riskPointerDot, { backgroundColor: kpStatus.color }]} />
            </View>
          </View>
          <View style={styles.riskBarLabels}>
            <Text style={styles.riskBarLabel}>Tranquilo</Text>
            <Text style={styles.riskBarLabel}>Moderado</Text>
            <Text style={styles.riskBarLabel}>Severo</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Regional map */}
      <SectionHeader title="MAPA DE RIESGO REGIONAL" color={Colors.astrovir} badge="SIMULADO" />
      <View style={styles.card}>
        {REGIONAL_RISKS.sort((a, b) => b.risk - a.risk).map((r, i) => {
          const rColor = r.risk > 0.7 ? Colors.danger : r.risk > 0.5 ? Colors.warning : Colors.success;
          return (
            <View key={i} style={styles.regionRow}>
              <Text style={styles.regionName}>{r.name}</Text>
              <View style={styles.regionBarBg}>
                <View style={[styles.regionBarFill, { width: `${r.risk * 100}%`, backgroundColor: rColor }]} />
              </View>
              <Text style={[styles.regionPct, { color: rColor }]}>{(r.risk * 100).toFixed(0)}%</Text>
              <Text style={styles.regionPop}>{r.pop}</Text>
            </View>
          );
        })}
        <Text style={styles.cardNote}>
          Riesgo calculado por latitud geomagnética + densidad poblacional + estación del año.
        </Text>
      </View>

      {/* Timeline */}
      <SectionHeader title="LÍNEA DE TIEMPO — ALERTAS Y PREDICCIONES" color={Colors.astrovir} />
      <View style={styles.card}>
        {TIMELINE_EVENTS.map((ev, i) => {
          const evColor = severityColors[ev.severity] || Colors.textMuted;
          const isToday = ev.days === 0;
          return (
            <View key={i} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <Text style={[styles.timelineDayLabel, isToday && { color: Colors.solar }]}>
                  {isToday ? 'HOY' : ev.days > 0 ? `+${ev.days}d` : `${ev.days}d`}
                </Text>
              </View>
              <View style={styles.timelineDotCol}>
                <View style={[
                  styles.timelineDot,
                  { backgroundColor: evColor },
                  isToday && { shadowColor: evColor, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4 },
                ]} />
                {i < TIMELINE_EVENTS.length - 1 && <View style={styles.timelineConnector} />}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineLabel, isToday && { color: Colors.textPrimary }]}>
                  {ev.label}
                </Text>
                <Text style={[styles.timelineType, { color: evColor }]}>
                  {ev.type} · riesgo {ev.severity}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Velkhover effect chart */}
      <SectionHeader title="EFECTO CHIZHEVSKY–VELKHOVER" color={Colors.astrovir} />
      <View style={styles.card}>
        <Text style={styles.velkhoverDesc}>
          Correlación entre metacromasia bacteriana y actividad solar (1935).{'\n'}
          Las bacterias cambian de comportamiento durante tormentas geomagnéticas.
        </Text>
        <View style={styles.dualChart}>
          {/* Bars: bacterial meta */}
          <View style={styles.dualChartLeft}>
            <Text style={[styles.dualLabel, { color: Colors.astrovir }]}>Meta bacteriana</Text>
            <View style={styles.miniBarRow}>
              {VELKHOVER_DATA.map((d, i) => (
                <View key={i} style={styles.miniBarCol}>
                  <View style={[styles.miniBar, {
                    height: `${(d.bacterMeta / 80) * 100}%`,
                    backgroundColor: Colors.astrovir,
                    opacity: 0.3 + 0.7 * (d.bacterMeta / 80),
                  }]} />
                </View>
              ))}
            </View>
          </View>
          {/* Bars: kp index */}
          <View style={styles.dualChartRight}>
            <Text style={[styles.dualLabel, { color: Colors.solar }]}>Kp-index</Text>
            <View style={styles.miniBarRow}>
              {VELKHOVER_DATA.map((d, i) => (
                <View key={i} style={styles.miniBarCol}>
                  <View style={[styles.miniBar, {
                    height: `${(d.kp / 9) * 100}%`,
                    backgroundColor: Colors.solar,
                    opacity: 0.3 + 0.7 * (d.kp / 9),
                  }]} />
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.velkhoverLabels}>
          {VELKHOVER_DATA.map((d, i) => (
            <Text key={i} style={styles.velkhoverLabelText}>{d.label.slice(0, 1)}</Text>
          ))}
        </View>
        <Text style={styles.cardNote}>
          Correlación r=0.79 según datos originales de Chizhevsky–Velkhover [SIMULADO].
        </Text>
      </View>

      {/* Immunization protocol */}
      <SectionHeader title="PROTOCOLO DE INMUNIZACIÓN CÓSMICA" color={Colors.astrovir} />
      <View style={styles.card}>
        {PROTOCOLS.slice(0, expandedProtocol ? PROTOCOLS.length : 3).map((p, i) => (
          <View key={i} style={styles.protocolRow}>
            <View style={styles.protocolBullet} />
            <Text style={styles.protocolText}>{p}</Text>
          </View>
        ))}
        <TouchableOpacity
          onPress={() => setExpandedProtocol(v => !v)}
          style={styles.expandBtn}
        >
          <Text style={styles.expandBtnText}>
            {expandedProtocol ? '↑ Mostrar menos' : `↓ Ver todos los protocolos (${PROTOCOLS.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Science note */}
      <View style={styles.scienceCard}>
        <Text style={styles.scienceTitle}>🔬 LA CIENCIA · ASTROVIROLOGÍA</Text>
        <Text style={styles.scienceText}>
          En 1935, Chizhevsky y Velkhover documentaron que ciertas bacterias cambian su
          comportamiento (metacromasia) durante variaciones en el campo geomagnético causadas
          por actividad solar.{'\n\n'}
          Esta correlación sugiere que los microorganismos poseen sensores magnéticos primitivos.
          Investigaciones modernas en magnetorecepciones biológicas continúan explorando
          este efecto.{'\n\n'}
          <Text style={{ color: Colors.warning }}>⚠ Limitación ética:</Text> Esta app no predice
          epidemias. Muestra correlaciones históricas documentadas. No reemplaza autoridades
          sanitarias ni consejo médico profesional.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg0 },
  content: { padding: Spacing.lg, paddingBottom: 80 },

  // Risk banner
  riskBanner: { borderWidth: 1, borderRadius: Radius.lg, overflow: 'hidden', marginBottom: Spacing.xl },
  riskGrad: { padding: Spacing.lg },
  riskSmall: { color: Colors.textMuted, fontSize: 9, letterSpacing: 2, fontFamily: 'Courier', textAlign: 'center' },
  riskLevel: { fontSize: 44, fontFamily: 'Courier', fontWeight: 'bold', textAlign: 'center', lineHeight: 52 },
  riskDesc: { color: Colors.textSecondary, fontSize: 12, textAlign: 'center', fontFamily: 'Courier' },
  riskBasis: { color: Colors.textMuted, fontSize: 10, textAlign: 'center', fontFamily: 'Courier', marginBottom: Spacing.md },
  riskBarBg: {
    height: 8, backgroundColor: Colors.bg3, borderRadius: 4,
    overflow: 'visible', position: 'relative', marginTop: Spacing.sm,
  },
  riskBarFill: { position: 'absolute', inset: 0, borderRadius: 4 },
  riskPointer: { position: 'absolute', top: -4, marginLeft: -6 },
  riskPointerDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: Colors.bg0 },
  riskBarLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  riskBarLabel: { color: Colors.textMuted, fontSize: 8, fontFamily: 'Courier' },

  // Cards
  card: {
    backgroundColor: Colors.bg2, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginBottom: Spacing.xl,
  },
  cardNote: { color: Colors.textMuted, fontSize: 10, fontFamily: 'Courier', marginTop: Spacing.sm, lineHeight: 15 },

  // Regional
  regionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 10 },
  regionName: { color: Colors.textSecondary, fontSize: 11, fontFamily: 'Courier', width: 90 },
  regionBarBg: { flex: 1, height: 5, backgroundColor: Colors.bg3, borderRadius: 3 },
  regionBarFill: { height: '100%', borderRadius: 3 },
  regionPct: { fontFamily: 'Courier', fontSize: 11, width: 32, textAlign: 'right' },
  regionPop: { color: Colors.textMuted, fontSize: 9, fontFamily: 'Courier', width: 50 },

  // Timeline
  timelineRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: 0 },
  timelineLeft: { width: 36 },
  timelineDayLabel: { color: Colors.textMuted, fontFamily: 'Courier', fontSize: 10, paddingTop: 2 },
  timelineDotCol: { alignItems: 'center', width: 14 },
  timelineDot: { width: 9, height: 9, borderRadius: 5, marginTop: 3 },
  timelineConnector: { flex: 1, width: 1, backgroundColor: Colors.border, marginTop: 3, minHeight: 18 },
  timelineContent: { flex: 1, paddingBottom: Spacing.md },
  timelineLabel: { color: Colors.textSecondary, fontSize: 13, fontFamily: 'Courier' },
  timelineType: { fontSize: 10, fontFamily: 'Courier', marginTop: 2 },

  // Velkhover dual chart
  velkhoverDesc: { color: Colors.textMuted, fontSize: 11, fontFamily: 'Courier', lineHeight: 17, marginBottom: Spacing.md },
  dualChart: { flexDirection: 'row', gap: Spacing.md, height: 80 },
  dualChartLeft: { flex: 1 },
  dualChartRight: { flex: 1 },
  dualLabel: { fontSize: 9, fontFamily: 'Courier', letterSpacing: 1, marginBottom: 6 },
  miniBarRow: { flexDirection: 'row', alignItems: 'flex-end', height: 52, gap: 2 },
  miniBarCol: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  miniBar: { width: '100%', borderRadius: 1, minHeight: 2 },
  velkhoverLabels: { flexDirection: 'row', marginTop: 4, gap: 2 },
  velkhoverLabelText: { flex: 1, textAlign: 'center', fontSize: 7, color: Colors.textMuted, fontFamily: 'Courier' },

  // Protocol
  protocolRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: 10, alignItems: 'flex-start' },
  protocolBullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.astrovir, marginTop: 5, flexShrink: 0 },
  protocolText: { flex: 1, color: Colors.textSecondary, fontSize: 12, fontFamily: 'Courier', lineHeight: 18 },
  expandBtn: { alignItems: 'center', paddingTop: Spacing.sm },
  expandBtnText: { color: Colors.astrovir, fontSize: 12, fontFamily: 'Courier' },

  // Science
  scienceCard: {
    backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, padding: Spacing.lg,
  },
  scienceTitle: { color: Colors.solar, fontSize: Typography.xs, letterSpacing: 2, fontFamily: 'Courier', marginBottom: Spacing.sm },
  scienceText: { color: Colors.textMuted, fontSize: 12, lineHeight: 18, fontFamily: 'Courier' },
});
