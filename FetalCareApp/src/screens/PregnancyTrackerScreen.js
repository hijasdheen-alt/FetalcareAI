import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { calculateCurrentWeek, getPregnancyInfoForWeek } from '../data/pregnancyData';

export default function PregnancyTrackerScreen({ profile }) {
  const { colors } = useTheme();
  const week = calculateCurrentWeek(profile?.dueDate);

  if (!week) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        <Text style={[styles.emptyText, { color: colors.subtext }]}>
          Add your due date in your profile to see your week-by-week pregnancy tracker.
        </Text>
      </View>
    );
  }

  const info = getPregnancyInfoForWeek(week);
  const trimester = week <= 13 ? '1st' : week <= 27 ? '2nd' : '3rd';

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
        <Text style={styles.weekLabel}>Week</Text>
        <Text style={styles.weekNumber}>{week}</Text>
        <Text style={styles.trimester}>{trimester} Trimester</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={styles.sizeEmoji}>🍼</Text>
        <Text style={[styles.sizeTitle, { color: colors.text }]}>
          Your baby is about the size of {info.size}
        </Text>
        <Text style={[styles.sizeNote, { color: colors.subtext }]}>{info.note}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Due Date</Text>
        <Text style={[styles.cardValue, { color: colors.subtext }]}>
          {profile?.dueDate || 'Not set'}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Weeks Remaining</Text>
        <Text style={[styles.cardValue, { color: colors.subtext }]}>
          {Math.max(40 - week, 0)} weeks to go (approx.)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  emptyText: { fontSize: 14, textAlign: 'center', marginTop: 60, paddingHorizontal: 24, lineHeight: 20 },
  heroCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16 },
  weekLabel: { color: '#ede9fe', fontSize: 13, fontWeight: '600' },
  weekNumber: { color: '#fff', fontSize: 48, fontWeight: '900' },
  trimester: { color: '#ede9fe', fontSize: 13, fontWeight: '600', marginTop: 4 },
  card: { borderRadius: 14, padding: 18, marginBottom: 12, alignItems: 'center' },
  sizeEmoji: { fontSize: 32, marginBottom: 8 },
  sizeTitle: { fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  sizeNote: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  cardTitle: { fontSize: 13, fontWeight: '700', alignSelf: 'flex-start', marginBottom: 4 },
  cardValue: { fontSize: 14, alignSelf: 'flex-start' },
});
