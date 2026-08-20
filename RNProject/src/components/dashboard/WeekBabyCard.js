import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { type, space, radius, shadow } from '../../theme/tokens';
import Icon from '../Icon';

export default function WeekBabyCard({ week, trimester, size, note }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.peach }, shadow(colors.cardShadow)]}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.weekLabel, { color: colors.textMuted }]}>WEEK {week || '–'}</Text>
          <Text style={[styles.trimester, { color: colors.text }]}>{trimester} trimester</Text>
        </View>
        <View style={[styles.iconBadge, { backgroundColor: colors.surface }]}>
          <Icon name="baby" size={22} color={colors.primary} />
        </View>
      </View>

      <Text style={[styles.sizeText, { color: colors.text }]}>
        Your baby is about the size of{'\n'}
        <Text style={[styles.sizeHighlight, { color: colors.primary }]}>{size || 'growing beautifully'}</Text>
      </Text>

      {note ? <Text style={[styles.note, { color: colors.textMuted }]}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, padding: space.xl, marginBottom: space.lg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  weekLabel: { ...type.micro },
  trimester: { ...type.h3, marginTop: 2 },
  iconBadge: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  sizeText: { ...type.h2, marginTop: space.lg, lineHeight: 24 },
  sizeHighlight: { fontWeight: '700' },
  note: { ...type.body, marginTop: space.md, lineHeight: 19 },
});
