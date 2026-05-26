import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SectionHeader } from '../components/SectionHeader';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { AERION_MODES } from '../data/constants';
import { clamp } from '../utils/helpers';
import { useStore } from '../hooks/useStore';

const ION_COMPARISONS = [
  { label: 'Ciudad', ions: 100 },
  { label: 'Interior', ions: 500 },
  { label: 'Bosque', ions: 25000 },
  { label: 'Cascada', ions: 50000 },
];

export function AerionScreen() {
  const { aerionMode, setAerionMode } = useStore(s => ({
    aerionMode: s.aerionMode,
    setAerionMode: s.setAerionMode,
  }));

  const [ions, setIons] = useState(AERION_MODES[aerionMode].ions);
  const barAnim = useRef(new Animated.Value(0)).current;

  const mode = AERION_MODES[aerionMode];

  useEffect(() => {
    const targetIons = AERION_MODES[aerionMode].ions;
    const interval = setInterval(() => {
      setIons(prev => {
        const drift = Math.floor(Math.random() * 400 - 200);
        return clamp(prev + drift, 100, 50000);
      });
    }, 2000);

    // Animate bar to new target
    Animated.timing(barAnim, {
      toValue: targetIons / 50000,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    return () => clearInterval(interval);
  }, [aerionMode]);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const maxIons = 50000;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Mode selector */}
      <SectionHeader title="MODO DE IONIZACIÓN" color={Colors.aerion} />
      <View style={styles.modeGrid}>
        {Object.values(AERION_MODES).map(m => (
          <TouchableOpacity
            key={m.id}
            onPress={() => setAerionMode(m.id as any)}
            activeOpacity={0.8}
            style={[
              styles.modeCard,
              { borderColor: aerionMode === m.id ? m.color : Colors.border },
              aerionMode === m.id && { backgroundColor: m.bg },
            ]}
          >
            <Text style={styles.modeIcon}>{m.icon}</Text>
            <Text style={[styles.modeName, { color: aerionMode === m.id ? m.color : Colors.textMuted }]}>
              {m.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Density meter */}
      <View style={[styles.meterCard, { borderColor: `${mode.color}33` }]}>
        <LinearGradient
          colors={[`${mode.color}08`, 'transparent']}
          style={styles.meterGrad}
        >
          <SectionHeader title="DENSIDAD DE IONES — EN VIVO" color={mode.color} badge="SIMULADO" />

          <View style={styles.ionReadout}>
            <Text style={[styles.ionValue, { color: mode.color }]}>
              {ions.toLocaleString('es-ES')}
            </Text>
            <Text style={styles.ionUnit}>iones/cm³</Text>
          </View>

          {/* Gauge */}
          <View style={styles.gaugeContainer}>
            {/* Natural range indicator */}
            <View style={[styles.gaugeNaturalRange, {
              left: `${(1000 / maxIons) * 100}%`,
              right: `${100 - (maxIons / maxIons) * 100}%`,
            }]} />
            <Animated.View style={[styles.gaugeFill, { width: barWidth, backgroundColor: mode.color }]} />
          </View>
          <View style={styles.gaugeLabels}>
            <Text style={styles.gaugeLabel}>0</Text>
            <Text style={styles.gaugeLabel}>Natural: 1k–50k iones/cm³</Text>
            <Text style={styles.gaugeLabel}>50k</Text>
          </View>

          {/* Comparisons */}
          <View style={styles.comparisons}>
            {ION_COMPARISONS.map(c => (
              <View key={c.label} style={styles.compItem}>
                <View style={styles.compBarContainer}>
                  <View style={[styles.compBar, {
                    height: `${(c.ions / maxIons) * 100}%`,
                    backgroundColor: c.label === 'Tu ambiente' ? mode.color : Colors.bg3,
                    minHeight: 2,
                  }]} />
                </View>
                <Text style={styles.compLabel}>{c.label}</Text>
              </View>
            ))}
            {/* Current */}
            <View style={styles.compItem}>
              <View style={styles.compBarContainer}>
                <View style={[styles.compBar, {
                  height: `${(ions / maxIons) * 100}%`,
                  backgroundColor: mode.color,
                  minHeight: 2,
                }]} />
              </View>
              <Text style={[styles.compLabel, { color: mode.color }]}>Tú ahora</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Mode description */}
      <View style={[styles.descCard, { borderColor: `${mode.color}22` }]}>
        <Text style={[styles.descTitle, { color: mode.color }]}>{mode.icon}  {mode.name}</Text>
        <Text style={styles.descText}>{mode.desc}</Text>
        <View style={styles.effectsGrid}>
          {mode.effects.map(e => (
            <View key={e} style={[styles.effectChip, { borderColor: `${mode.color}33` }]}>
              <Text style={[styles.effectText, { color: mode.color }]}>{e}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* IoT placeholder */}
      <View style={styles.iotCard}>
        <Text style={styles.iotTitle}>🔌 CHANDELIER IOT</Text>
        <Text style={styles.iotDesc}>
          El hardware Chandelier se conectará aquí para control real del ionizador.{'\n'}
          Disponible en Fase 2 — Plan Tsiolkovsky.
        </Text>
        <View style={styles.iotBadge}>
          <Text style={styles.iotBadgeText}>PRÓXIMAMENTE</Text>
        </View>
      </View>

      {/* Science note */}
      <View style={styles.scienceCard}>
        <Text style={styles.scienceTitle}>🔬 LA CIENCIA</Text>
        <Text style={styles.scienceText}>
          Chizhevsky descubrió en 1918 que los iones negativos del aire mejoran la
          excitabilidad biológica, la circulación y el estado de ánimo. Su "Lámpara de
          Chizhevsky" generaba campos electroestáticos que ionizaban el aire de manera similar
          a como ocurre naturalmente en bosques y cascadas.{'\n\n'}
          Limitación: los efectos varían por individuo. Esta app no reemplaza consejo médico.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg0 },
  content: { padding: Spacing.lg, paddingBottom: 80 },
  modeGrid: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  modeCard: {
    flex: 1, backgroundColor: Colors.bg2, borderWidth: 1,
    borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center',
  },
  modeIcon: { fontSize: 24, marginBottom: Spacing.xs },
  modeName: { fontSize: 9, letterSpacing: 1, textAlign: 'center', fontFamily: 'Courier' },
  meterCard: {
    borderWidth: 1, borderRadius: Radius.lg, overflow: 'hidden', marginBottom: Spacing.xl,
  },
  meterGrad: { padding: Spacing.lg },
  ionReadout: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm, marginBottom: Spacing.lg },
  ionValue: { fontSize: 44, fontFamily: 'Courier', fontWeight: 'bold' },
  ionUnit: { color: Colors.textMuted, fontSize: Typography.md, fontFamily: 'Courier' },
  gaugeContainer: {
    height: 16, backgroundColor: Colors.bg3, borderRadius: 8,
    overflow: 'hidden', position: 'relative',
  },
  gaugeNaturalRange: {
    position: 'absolute', top: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  gaugeFill: { height: '100%', borderRadius: 8 },
  gaugeLabels: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 4,
  },
  gaugeLabel: { color: Colors.textMuted, fontSize: 8, fontFamily: 'Courier' },
  comparisons: {
    flexDirection: 'row', alignItems: 'flex-end', height: 60, gap: 8, marginTop: Spacing.lg,
  },
  compItem: { flex: 1, alignItems: 'center' },
  compBarContainer: { height: 52, width: '100%', justifyContent: 'flex-end' },
  compBar: { width: '100%', borderRadius: 2 },
  compLabel: { color: Colors.textMuted, fontSize: 8, marginTop: 4, fontFamily: 'Courier', textAlign: 'center' },
  descCard: {
    backgroundColor: Colors.bg2, borderWidth: 1, borderRadius: Radius.md,
    padding: Spacing.lg, marginBottom: Spacing.xl,
  },
  descTitle: { fontSize: Typography.md, fontFamily: 'Courier', marginBottom: Spacing.sm },
  descText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20, fontFamily: 'Courier' },
  effectsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.md },
  effectChip: {
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
    borderRadius: Radius.full, borderWidth: 1,
  },
  effectText: { fontSize: 11, fontFamily: 'Courier' },
  iotCard: {
    backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.solarBorder,
    borderRadius: Radius.md, padding: Spacing.lg, marginBottom: Spacing.xl, alignItems: 'center',
  },
  iotTitle: { color: Colors.solar, fontSize: Typography.sm, letterSpacing: 2, fontFamily: 'Courier', marginBottom: Spacing.sm },
  iotDesc: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', fontFamily: 'Courier', lineHeight: 18 },
  iotBadge: {
    marginTop: Spacing.md, backgroundColor: Colors.solarDim, borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs, borderWidth: 1, borderColor: Colors.solarBorder,
  },
  iotBadgeText: { color: Colors.solar, fontSize: 10, letterSpacing: 2, fontFamily: 'Courier' },
  scienceCard: {
    backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, padding: Spacing.lg,
  },
  scienceTitle: { color: Colors.solar, fontSize: Typography.xs, letterSpacing: 2, fontFamily: 'Courier', marginBottom: Spacing.sm },
  scienceText: { color: Colors.textMuted, fontSize: 12, lineHeight: 18, fontFamily: 'Courier' },
});
