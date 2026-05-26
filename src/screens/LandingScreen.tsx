import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SunIcon } from '../components/SunIcon';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { CHIZHEVSKY_QUOTES, CHIZHEVSKY_TIMELINE } from '../data/constants';
import { useStore } from '../hooks/useStore';

const { width } = Dimensions.get('window');

const DISCIPLINES = [
  { id: 'helios', icon: '☀', name: 'HELIOS', sub: 'Inteligencia Solar', color: Colors.helios },
  { id: 'aerion', icon: '⚡', name: 'AERION', sub: 'Aero-ionización', color: Colors.aerion },
  { id: 'astrovir', icon: '🦠', name: 'ASTROVIR', sub: 'Vigilancia Epidémica', color: Colors.astrovir },
  { id: 'chronos', icon: '⏱', name: 'CHRONOS', sub: 'Sincronización Biológica', color: Colors.chronos },
];

const PRICING = [
  { tier: 'KALUGA', price: 'Gratis', color: '#888', features: ['Datos solares básicos', 'Cronotipo personal'] },
  { tier: 'TSIOLKOVSKY', price: '$9.99/mes', color: Colors.solar, features: ['Predicciones personalizadas', 'Control ionizador IoT'] },
  { tier: 'CHIZHEVSKY', price: '$29.99/mes', color: Colors.aerion, features: ['Astro-vigilancia completa', 'Consultas especializadas'] },
];

export function LandingScreen({ navigation }: any) {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const sunScale = useRef(new Animated.Value(1)).current;
  const setUser = useStore(s => s.setUser);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIdx(i => (i + 1) % CHIZHEVSKY_QUOTES.length);
    }, 4500);

    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(sunScale, { toValue: 1.12, duration: 2200, useNativeDriver: true }),
        Animated.timing(sunScale, { toValue: 1.0, duration: 2200, useNativeDriver: true }),
      ])
    );
    pulseAnim.start();

    return () => { clearInterval(quoteTimer); pulseAnim.stop(); };
  }, []);

  const handleEnter = () => {
    setUser({ onboarded: true });
    navigation.replace('Main');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['rgba(255,215,0,0.06)', 'transparent']}
        style={styles.topGlow}
        start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
      />

      {/* Sun */}
      <Animated.View style={[styles.sunContainer, { transform: [{ scale: sunScale }] }]}>
        <SunIcon size={80} />
      </Animated.View>

      {/* Title */}
      <Text style={styles.label}>CHIZHEVSKY LABS</Text>
      <Text style={styles.title}>Cosmic Biology{'\n'}
        <Text style={styles.titleAccent}>Intelligence Platform</Text>
      </Text>

      {/* Quote */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>"{CHIZHEVSKY_QUOTES[quoteIdx]}"</Text>
      </View>

      {/* Disciplines */}
      <Text style={styles.sectionLabel}>LAS 4 DISCIPLINAS</Text>
      <View style={styles.disciplinesGrid}>
        {DISCIPLINES.map(d => (
          <View key={d.id} style={[styles.disciplineCard, { borderColor: `${d.color}33` }]}>
            <Text style={styles.disciplineIcon}>{d.icon}</Text>
            <Text style={[styles.disciplineName, { color: d.color }]}>{d.name}</Text>
            <Text style={styles.disciplineSub}>{d.sub}</Text>
          </View>
        ))}
      </View>

      {/* Timeline */}
      <Text style={styles.sectionLabel}>ALEXANDER L. CHIZHEVSKY — 1897–1964</Text>
      <View style={styles.timeline}>
        {CHIZHEVSKY_TIMELINE.map((t, i) => (
          <View key={i} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <Text style={styles.timelineYear}>{t.year}</Text>
            </View>
            <View style={styles.timelineDotCol}>
              <View style={styles.timelineDot} />
              {i < CHIZHEVSKY_TIMELINE.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineRight}>
              <Text style={styles.timelineEvent}>{t.event}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Pricing */}
      <Text style={styles.sectionLabel}>PLANES</Text>
      {PRICING.map(p => (
        <View key={p.tier} style={[styles.pricingCard, { borderColor: `${p.color}33` }]}>
          <View style={styles.pricingHeader}>
            <Text style={[styles.pricingTier, { color: p.color }]}>{p.tier}</Text>
            <Text style={styles.pricingPrice}>{p.price}</Text>
          </View>
          {p.features.map(f => (
            <Text key={f} style={styles.pricingFeature}>◦  {f}</Text>
          ))}
        </View>
      ))}

      {/* CTA */}
      <TouchableOpacity onPress={handleEnter} activeOpacity={0.85}>
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.cta}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        >
          <Text style={styles.ctaText}>☀  SINCRONIZARTE CON EL COSMOS</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.footer}>
        1% de ingresos al Chizhevsky Science Center, Kaluga, Rusia
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg0 },
  content: { paddingBottom: 60, paddingHorizontal: Spacing.lg },
  topGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 300,
  },
  sunContainer: {
    alignSelf: 'center',
    marginTop: Spacing.xxxl,
    marginBottom: Spacing.xl,
  },
  label: {
    color: Colors.solar, fontSize: Typography.xs, letterSpacing: 6,
    textAlign: 'center', opacity: 0.7, fontFamily: 'Courier',
    marginBottom: Spacing.sm,
  },
  title: {
    color: Colors.textPrimary, fontSize: 32, textAlign: 'center',
    lineHeight: 38, marginBottom: Spacing.xl,
    fontFamily: 'Courier',
  },
  titleAccent: { color: Colors.solar },
  quoteContainer: {
    backgroundColor: Colors.bg2, borderRadius: Radius.md,
    padding: Spacing.lg, marginBottom: Spacing.xl,
    borderWidth: 1, borderColor: Colors.borderSolar,
  },
  quote: {
    color: Colors.textSecondary, fontSize: Typography.md, fontStyle: 'italic',
    textAlign: 'center', lineHeight: 22,
    fontFamily: 'Courier',
  },
  sectionLabel: {
    color: Colors.solar, fontSize: Typography.xs, letterSpacing: 3,
    marginBottom: Spacing.md, marginTop: Spacing.xl,
    fontFamily: 'Courier',
  },
  disciplinesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  disciplineCard: {
    width: (width - Spacing.lg * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.bg2,
    borderWidth: 1, borderRadius: Radius.md,
    padding: Spacing.md,
  },
  disciplineIcon: { fontSize: 24, marginBottom: Spacing.xs },
  disciplineName: { fontSize: Typography.sm, letterSpacing: 1.5, fontFamily: 'Courier', fontWeight: 'bold' },
  disciplineSub: { color: Colors.textMuted, fontSize: Typography.xs, marginTop: 3, fontFamily: 'Courier' },
  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', gap: Spacing.sm },
  timelineLeft: { width: 44 },
  timelineYear: { color: Colors.solar, fontSize: 12, fontFamily: 'Courier', paddingTop: 2 },
  timelineDotCol: { alignItems: 'center', width: 16 },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.solar, marginTop: 4 },
  timelineLine: { flex: 1, width: 1, backgroundColor: 'rgba(255,215,0,0.2)', marginTop: 2, minHeight: 20 },
  timelineRight: { flex: 1, paddingBottom: Spacing.md },
  timelineEvent: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18, fontFamily: 'Courier' },
  pricingCard: {
    backgroundColor: Colors.bg2, borderWidth: 1, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.sm,
  },
  pricingHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  pricingTier: { fontSize: Typography.xs, letterSpacing: 2, fontFamily: 'Courier', fontWeight: 'bold' },
  pricingPrice: { color: Colors.textPrimary, fontSize: 15, fontFamily: 'Courier' },
  pricingFeature: { color: Colors.textMuted, fontSize: 12, fontFamily: 'Courier', marginBottom: 3 },
  cta: {
    borderRadius: Radius.full, padding: Spacing.lg,
    alignItems: 'center', marginTop: Spacing.xl,
  },
  ctaText: { color: '#000', fontWeight: 'bold', letterSpacing: 2, fontSize: 13, fontFamily: 'Courier' },
  footer: {
    color: Colors.textMuted, fontSize: 10, textAlign: 'center',
    marginTop: Spacing.lg, fontFamily: 'Courier', lineHeight: 15,
  },
});
