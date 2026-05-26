import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  color?: string;
  badge?: string;
}

export function SectionHeader({ title, subtitle, color = Colors.solar, badge }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.title, { color }]}>{title}</Text>
        {badge && (
          <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: `${color}44` }]}>
            <Text style={[styles.badgeText, { color }]}>{badge}</Text>
          </View>
        )}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  title: {
    fontSize: Typography.xs,
    letterSpacing: 2.5,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 8,
    letterSpacing: 1,
    fontFamily: 'Courier',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    marginTop: 3,
    fontFamily: 'Courier',
  },
});
