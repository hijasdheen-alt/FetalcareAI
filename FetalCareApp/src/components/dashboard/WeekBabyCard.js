import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { type, space, radius, shadow } from '../../theme/tokens';
import Icon from '../Icon';

export default function WeekBabyCard({ week, trimester, size, note }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.primaryDark }, shadow(colors.cardShadow)]}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.weekLabel}>WEEK {week || '–'}</Text>
          <Text style={styles.trimester}>{trimester} trimester</Text>
        </View>
        <View style={styles.iconBadge}>
          <Icon name="baby" size={22} color="#fff" />
        </View>
      </View>

      <Text style={styles.sizeText}>
        Your baby is about the size of{'\n'}
        <Text style={styles.sizeHighlight}>{size || 'growing beautifully'}</Text>
      </Text>

      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, padding: space.xl, marginBottom: space.lg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  weekLabel: { ...type.micro, color: 'rgba(255,255,255,0.6)' },
  trimester: { ...type.h3, color: '#fff', marginTop: 2 },
  iconBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  sizeText: { ...type.h2, color: '#fff', marginTop: space.lg, lineHeight: 24 },
  sizeHighlight: { color: '#F3B8CB' },
  note: { ...type.body, color: 'rgba(255,255,255,0.75)', marginTop: space.md, lineHeight: 19 },
});
