import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function DashboardCard({ label, value, unit, danger, icon }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: danger ? colors.dangerBg : colors.card },
        danger && { borderWidth: 1, borderColor: colors.danger },
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.label, { color: colors.subtext }]}>{label}</Text>
      <Text style={[styles.value, { color: danger ? colors.danger : colors.text }]}>
        {value}
        {unit ? <Text style={[styles.unit, { color: colors.subtext }]}> {unit}</Text> : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icon: { fontSize: 22, marginBottom: 6 },
  label: { fontSize: 12, marginBottom: 4, fontWeight: '600' },
  value: { fontSize: 24, fontWeight: '800' },
  unit: { fontSize: 13, fontWeight: '500' },
});
