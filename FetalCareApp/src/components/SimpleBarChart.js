import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// data: array of { label, value }
export default function SimpleBarChart({ data, color = '#7c3aed', maxHeight = 120, textColor = '#111827' }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      <View style={[styles.barsRow, { height: maxHeight + 20 }]}>
        {data.map((d, i) => {
          const barHeight = Math.max((d.value / maxValue) * maxHeight, 2);
          return (
            <View key={i} style={styles.barColumn}>
              <Text style={[styles.valueLabel, { color: textColor }]}>{d.value}</Text>
              <View style={[styles.bar, { height: barHeight, backgroundColor: color }]} />
            </View>
          );
        })}
      </View>
      <View style={styles.labelsRow}>
        {data.map((d, i) => (
          <Text key={i} style={[styles.axisLabel, { color: textColor }]} numberOfLines={1}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' },
  barColumn: { alignItems: 'center', flex: 1 },
  bar: { width: 14, borderRadius: 4 },
  valueLabel: { fontSize: 9, marginBottom: 4, opacity: 0.7 },
  labelsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 6 },
  axisLabel: { fontSize: 9, flex: 1, textAlign: 'center', opacity: 0.6 },
});
