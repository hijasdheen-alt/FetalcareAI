import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { type, space, radius, shadow } from '../../theme/tokens';
import { AnimatedPress } from '../Motion';
import Icon from '../Icon';

export function DailyTipCard({ tip }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.tipCard, { backgroundColor: colors.accent + '22', borderColor: colors.accent + '55' }]}>
      <View style={[styles.tipIconCircle, { backgroundColor: colors.accent }]}>
        <Icon name="bulb" size={16} color="#fff" />
      </View>
      <Text style={[type.body, { color: colors.text, flex: 1, marginLeft: space.md, lineHeight: 19 }]}>{tip}</Text>
    </View>
  );
}

export function QuickActions({ onLogKicks, onCheckIn, onLogMood }) {
  const { colors } = useTheme();
  const actions = [
    { key: 'kicks', label: 'Log Kicks', icon: 'kick', onPress: onLogKicks, color: colors.accentAlt },
    { key: 'checkin', label: 'Check-In', icon: 'check', onPress: onCheckIn, color: colors.primary },
    { key: 'mood', label: 'Log Mood', icon: 'heart', onPress: onLogMood, color: colors.danger },
  ];

  return (
    <View style={styles.actionsRow}>
      {actions.map((a) => (
        <AnimatedPress
          key={a.key}
          onPress={a.onPress}
          style={[styles.actionBtn, { backgroundColor: colors.surface }, shadow(colors.cardShadow)]}
        >
          <View style={[styles.actionIconCircle, { backgroundColor: a.color + '22' }]}>
            <Icon name={a.icon} size={20} color={a.color} />
          </View>
          <Text style={[type.caption, { color: colors.text, marginTop: space.xs }]}>{a.label}</Text>
        </AnimatedPress>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tipCard: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, borderWidth: 1, padding: space.md, marginTop: space.lg },
  tipIconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.lg },
  actionBtn: { flex: 1, alignItems: 'center', borderRadius: radius.lg, paddingVertical: space.md, marginHorizontal: 4 },
  actionIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
