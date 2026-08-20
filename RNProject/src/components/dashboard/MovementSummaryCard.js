import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { type, space, radius, shadow } from '../../theme/tokens';
import Icon from '../Icon';

export default function MovementSummaryCard({ todayCount, sevenDayAvg }) {
  const { colors } = useTheme();
  const isLow = sevenDayAvg > 0 && todayCount < sevenDayAvg * 0.7;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }, shadow(colors.cardShadow)]}>
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: colors.accentAlt + '33' }]}>
          <Icon name="kick" size={20} color={colors.accentAlt} />
        </View>
        <Text style={[type.caption, { color: colors.textMuted, marginLeft: space.sm }]}>TODAY'S KICKS</Text>
      </View>

      <Text style={[type.display, { color: colors.text, marginTop: space.sm }]}>{todayCount}</Text>

      <Text style={[type.caption, { color: isLow ? colors.danger : colors.textMuted, marginTop: 4 }]}>
        {sevenDayAvg > 0
          ? `7-day average: ${sevenDayAvg.toFixed(1)}${isLow ? ' - lower than usual' : ''}`
          : 'Start logging to see your average'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: radius.lg, padding: space.lg },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
