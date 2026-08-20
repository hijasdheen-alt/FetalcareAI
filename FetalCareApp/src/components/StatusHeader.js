import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusHeader({ connected }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Fetal Care AI</Text>
        <Text style={styles.subtitle}>Smart Pregnancy Monitoring Belt</Text>
      </View>

      <View style={styles.statusPill(connected)}>
        <View style={styles.dot(connected)} />
        <Text style={styles.statusText}>{connected ? 'Connected' : 'Offline'}</Text>
      </View>
    </View>
  );
}

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#4c1d95',
  },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 12, color: '#ddd6fe', marginTop: 2 },
  statusPill: (connected) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: connected ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  }),
  dot: (connected) => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: connected ? '#22c55e' : '#ef4444',
    marginRight: 6,
  }),
  statusText: StyleSheet.flatten({ color: '#fff', fontSize: 12, fontWeight: '600' }),
};
