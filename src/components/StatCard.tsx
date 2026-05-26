import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  badge?: string;
}

export function StatCard({ label, value, unit, color = Colors.solar, size = 'md', badge }: Props) {
  const valueSizes = { sm: 20, md: 28, lg: 40 };

  return (
    <View style={[styles.card, { borderColor: `${color}33` }]}>
      {badge && (
        <View style={[styles.badge, { backgroundColor: `${color}22` }]}>
          <Text style={[styles.badgeText, { color }]}>{badge}</Text>
        </View>
      )}
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color, fontSize: valueSizes[size] }]}>
          {value}
        </Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.bg2,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 8,
    letterSpacing: 1,
    fontFamily: 'Courier',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  value: {
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  unit: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    fontFamily: 'Courier',
    marginBottom: 2,
  },
  label: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    letterSpacing: 1,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Courier',
  },
});
