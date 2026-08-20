import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// data: array of numbers (e.g. heart rate readings, oldest to newest)
export default function SimpleLineChart({ data, color = '#dc2626', height = 100, textColor = '#111827' }) {
  const validData = data.filter((v) => typeof v === 'number' && !isNaN(v));

  if (validData.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text style={{ color: textColor, opacity: 0.5, fontSize: 12 }}>No data yet</Text>
      </View>
    );
  }

  const max = Math.max(...validData);
  const min = Math.min(...validData);
  const range = max - min || 1;

  return (
    <View style={styles.container}>
      <View style={styles.chartRow}>
        <View style={styles.yAxis}>
          <Text style={[styles.axisText, { color: textColor }]}>{max}</Text>
          <Text style={[styles.axisText, { color: textColor }]}>{min}</Text>
        </View>

        <View style={[styles.plotArea, { height }]}>
          {validData.map((value, i) => {
            const normalizedHeight = ((value - min) / range) * (height - 16) + 4;
            return (
              <View key={i} style={styles.pointColumn}>
                <View
                  style={[
                    styles.point,
                    {
                      backgroundColor: color,
                      marginBottom: normalizedHeight - 4,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  emptyContainer: { justifyContent: 'center', alignItems: 'center' },
  chartRow: { flexDirection: 'row' },
  yAxis: { justifyContent: 'space-between', marginRight: 6, width: 30 },
  axisText: { fontSize: 9, opacity: 0.6 },
  plotArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  pointColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  point: { width: 6, height: 6, borderRadius: 3 },
});
