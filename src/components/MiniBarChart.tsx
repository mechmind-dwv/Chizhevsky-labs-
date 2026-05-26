import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme';

interface DataPoint {
  label: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  color?: string;
  height?: number;
  showLabels?: boolean;
}

export function MiniBarChart({ data, color = Colors.solar, height = 60, showLabels = true }: Props) {
  const max = Math.max(...data.map(d => d.value));

  return (
    <View style={{ height: height + (showLabels ? 16 : 0) }}>
      <View style={[styles.barsRow, { height }]}>
        {data.map((d, i) => (
          <View key={i} style={styles.barCol}>
            <View style={[styles.barFill, {
              height: `${(d.value / max) * 100}%`,
              backgroundColor: color,
              opacity: 0.3 + 0.7 * (d.value / max),
            }]} />
          </View>
        ))}
      </View>
      {showLabels && (
        <View style={styles.labelsRow}>
          {data.map((d, i) => (
            <Text key={i} style={styles.label}>{d.label}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  barCol: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 2,
    minHeight: 2,
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 7,
    color: Colors.textMuted,
    fontFamily: 'Courier',
  },
});
