import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SunIcon } from '../components/SunIcon';
import { SectionHeader } from '../components/SectionHeader';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { ACHIEVEMENTS } from '../data/constants';
import { useStore } from '../hooks/useStore';
import { getSolarCyclePhase } from '../utils/helpers';

export function ProfileScreen() {
  const { user, setUser, addAchievement } = useStore(s => ({
    user: s.user,
    setUser: s.setUser,
    addAchievement: s.addAchievement,
  }));

  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [editYear, setEditYear] = useState(false);
  const [yearInput, setYearInput] = useState(String(user.birthYear));

  const cyclePhase = getSolarCyclePhase(new Date().getFullYear());
  const userCyclePos = ((new Date().getFullYear() - user.birthYear) % 11) + 1;

  const handleSaveName = () => {
    setUser({ name: nameInput.trim() || user.name });
    setEditName(false);
  };

  const handleSaveYear = () => {
    const y = parseInt(yearInput);
    if (y > 1900 && y < new Date().getFullYear()) {
      setUser({ birthYear: y });
    } else {
      Alert.alert('Año inválido', 'Ingresa un año entre 1900 y el año actual.');
    }
    setEditYear(false);
  };

  const xpForLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100));
  const level = xpForLevel(user.totalXP);
  const levelProgress = (user.totalXP % (Math.pow(level + 1, 2) * 100)) / (Math.pow(level + 1, 2) * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Profile header */}
      <LinearGradient
        colors={['rgba(255,215,0,0.08)', 'transparent']}
        style={styles.profileHeader}
      >
        <SunIcon size={56} />
        <View style={styles.profileInfo}>
          {editName ? (
            <View style={styles.editRow}>
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                style={styles.nameInput}
                autoFocus
                placeholderTextColor={Colors.textMuted}
              />
              <TouchableOpacity onPress={handleSaveName}>
                <Text style={styles.saveBtn}>✓</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditName(true)} style={styles.nameRow}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.editHint}>✎</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.profileSub}>Helióbiólogo Nivel {level}</Text>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${levelProgress * 100}%` }]} />
          </View>
          <Text style={styles.xpLabel}>{user.totalXP} XP · Próximo nivel a {Math.pow(level + 1, 2) * 100} XP</Text>
        </View>
      </LinearGradient>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {[
          { label: 'RACHA', value: user.streak, unit: 'd', color: Colors.solar },
          { label: 'XP TOTAL', value: user.totalXP, unit: '', color: Colors.aerion },
          { label: 'LOGROS', value: user.achievements.length, unit: `/${ACHIEVEMENTS.length}`, color: Colors.chronos },
        ].map(s => (
          <View key={s.label} style={[styles.statChip, { borderColor: `${s.color}33` }]}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}<Text style={styles.statUnit}>{s.unit}</Text></Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Personal data */}
      <SectionHeader title="DATOS PERSONALES" color={Colors.solar} />
      <View style={styles.card}>
        {/* Birth year */}
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Año de nacimiento</Text>
          {editYear ? (
            <View style={styles.editRow}>
              <TextInput
                value={yearInput}
                onChangeText={setYearInput}
                style={styles.yearInput}
                keyboardType="numeric"
                autoFocus
              />
              <TouchableOpacity onPress={handleSaveYear}>
                <Text style={styles.saveBtn}>✓</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditYear(true)} style={styles.editableValue}>
              <Text style={styles.dataValue}>{user.birthYear}</Text>
              <Text style={styles.editHint}>✎</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Chronotype */}
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Cronotipo</Text>
          <Text style={styles.dataValue}>
            {{ madrugador: '🌅 Madrugador', intermedio: '🌤 Intermedio', nocturno: '🌙 Nocturno' }[user.chronotype]}
          </Text>
        </View>

        {/* Solar cycle position */}
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Posición en ciclo solar</Text>
          <Text style={[styles.dataValue, { color: Colors.solar }]}>Año {userCyclePos} de 11</Text>
        </View>

        {/* Mood logs */}
        <View style={[styles.dataRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.dataLabel}>Estados de ánimo registrados</Text>
          <Text style={[styles.dataValue, { color: Colors.chronos }]}>{user.moodLog.length} días</Text>
        </View>
      </View>

      {/* Achievements */}
      <SectionHeader title="LOGROS" color={Colors.solar} />
      <View style={styles.achievementsGrid}>
        {ACHIEVEMENTS.map(ach => {
          const unlocked = user.achievements.includes(ach.id);
          return (
            <View
              key={ach.id}
              style={[
                styles.achievementCard,
                unlocked ? styles.achievementUnlocked : styles.achievementLocked,
              ]}
            >
              <Text style={[styles.achievementIcon, !unlocked && styles.lockedIcon]}>
                {ach.icon}
              </Text>
              <Text style={[styles.achievementName, { color: unlocked ? Colors.solar : Colors.textMuted }]}>
                {ach.name}
              </Text>
              <Text style={styles.achievementDesc}>{ach.desc}</Text>
              <View style={[styles.xpBadge, { backgroundColor: unlocked ? 'rgba(255,215,0,0.15)' : Colors.bg3 }]}>
                <Text style={[styles.xpBadgeText, { color: unlocked ? Colors.solar : Colors.textMuted }]}>
                  {ach.xp} XP
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Ethics */}
      <SectionHeader title="ÉTICA Y TRANSPARENCIA" color={Colors.solar} />
      <View style={styles.ethicsCard}>
        {[
          { icon: '🔓', title: 'Algoritmos Open Source', desc: 'Todo el código de correlación solar es auditable en GitHub.' },
          { icon: '⚖', title: 'No Determinismo', desc: 'El Sol amplifica condiciones existentes — no causa ni predice el futuro individual.' },
          { icon: '🏛', title: 'Legado Chizhevsky', desc: '1% de ingresos al Chizhevsky Science Center, Kaluga, Rusia.' },
          { icon: '🩺', title: 'No sustituye medicina', desc: 'Esta app es informativa. Consulta siempre profesionales de salud.' },
        ].map(e => (
          <View key={e.title} style={styles.ethicsRow}>
            <Text style={styles.ethicsIcon}>{e.icon}</Text>
            <View style={styles.ethicsContent}>
              <Text style={styles.ethicsTitle}>{e.title}</Text>
              <Text style={styles.ethicsDesc}>{e.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        v1.0.0 · Chizhevsky Labs © 2025{'\n'}
        "Talló nuevos caminos en vastos campos inexplorados."{'\n'}— Int. Journal of Biometeorology, 1964
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg0 },
  content: { padding: Spacing.lg, paddingBottom: 80 },

  profileHeader: {
    flexDirection: 'row', gap: Spacing.lg, alignItems: 'center',
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.xl,
    borderWidth: 1, borderColor: Colors.solarBorder,
  },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  profileName: { color: Colors.textPrimary, fontSize: 20, fontFamily: 'Courier' },
  editHint: { color: Colors.textMuted, fontSize: 14 },
  profileSub: { color: Colors.solar, fontSize: 11, fontFamily: 'Courier', letterSpacing: 1, marginTop: 2 },
  xpBarBg: { height: 4, backgroundColor: Colors.bg3, borderRadius: 2, marginTop: Spacing.sm },
  xpBarFill: { height: '100%', backgroundColor: Colors.solar, borderRadius: 2 },
  xpLabel: { color: Colors.textMuted, fontSize: 9, fontFamily: 'Courier', marginTop: 4 },

  editRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  nameInput: {
    flex: 1, color: Colors.textPrimary, fontSize: 18, fontFamily: 'Courier',
    borderBottomWidth: 1, borderColor: Colors.solar, paddingBottom: 2,
  },
  yearInput: {
    color: Colors.textPrimary, fontSize: 15, fontFamily: 'Courier',
    borderBottomWidth: 1, borderColor: Colors.solar, paddingBottom: 2, width: 60,
  },
  saveBtn: { color: Colors.solar, fontSize: 20 },

  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  statChip: {
    flex: 1, backgroundColor: Colors.bg2, borderWidth: 1,
    borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center',
  },
  statValue: { fontSize: 22, fontFamily: 'Courier', fontWeight: 'bold' },
  statUnit: { fontSize: 12 },
  statLabel: { color: Colors.textMuted, fontSize: 8, fontFamily: 'Courier', letterSpacing: 1, marginTop: 3 },

  card: {
    backgroundColor: Colors.bg2, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginBottom: Spacing.xl,
  },
  dataRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderColor: Colors.border,
  },
  dataLabel: { color: Colors.textMuted, fontSize: 12, fontFamily: 'Courier' },
  dataValue: { color: Colors.textPrimary, fontSize: 13, fontFamily: 'Courier' },
  editableValue: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  achievementCard: {
    width: '47%', borderRadius: Radius.md, borderWidth: 1,
    padding: Spacing.md, alignItems: 'center',
  },
  achievementUnlocked: { backgroundColor: 'rgba(255,215,0,0.05)', borderColor: Colors.solarBorder },
  achievementLocked: { backgroundColor: Colors.bg2, borderColor: Colors.border },
  achievementIcon: { fontSize: 28, marginBottom: Spacing.xs },
  lockedIcon: { opacity: 0.3 },
  achievementName: { fontSize: 11, fontFamily: 'Courier', textAlign: 'center', marginBottom: 3, fontWeight: 'bold' },
  achievementDesc: { color: Colors.textMuted, fontSize: 9, fontFamily: 'Courier', textAlign: 'center', lineHeight: 13 },
  xpBadge: { marginTop: Spacing.sm, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  xpBadgeText: { fontSize: 9, fontFamily: 'Courier', letterSpacing: 1 },

  ethicsCard: {
    backgroundColor: Colors.bg2, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  ethicsRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  ethicsIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  ethicsContent: { flex: 1 },
  ethicsTitle: { color: Colors.textPrimary, fontSize: 12, fontFamily: 'Courier', fontWeight: 'bold' },
  ethicsDesc: { color: Colors.textMuted, fontSize: 11, fontFamily: 'Courier', marginTop: 2, lineHeight: 16 },

  footer: {
    color: Colors.textMuted, fontSize: 10, textAlign: 'center',
    fontFamily: 'Courier', lineHeight: 16, marginBottom: Spacing.lg,
  },
});
