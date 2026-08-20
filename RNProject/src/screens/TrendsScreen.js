import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import SimpleLineChart from '../components/SimpleLineChart';
import SimpleBarChart from '../components/SimpleBarChart';
import Icon from '../components/Icon';
import { space } from '../theme/tokens';
import { FadeSlideIn } from '../components/Motion';

export default function TrendsScreen({ readingHistory }) {
  const { colors } = useTheme();

  // Most recent 20 entries, oldest to newest for a left-to-right timeline
  const recent = [...readingHistory].slice(0, 20).reverse();

  const heartRateData = recent.map((r) => r.heartRate).filter((v) => v != null);

  const kickBarData = recent.slice(-8).map((r, i) => ({
    label: r.time?.split(':').slice(0, 2).join(':') || `#${i}`,
    value: r.kickCount,
  }));

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <FadeSlideIn delay={0}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Trends</Text>
      </FadeSlideIn>

      <FadeSlideIn delay={60}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.titleRow}>
            <Icon name="heart" size={16} color={colors.danger} />
            <Text style={[styles.cardTitle, { color: colors.text, marginLeft: space.xs }]}>
              Heart Rate (last 20 readings)
            </Text>
          </View>
          <SimpleLineChart data={heartRateData} color={colors.danger} textColor={colors.textMuted} />
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={120}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.titleRow}>
            <Icon name="kick" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text, marginLeft: space.xs }]}>
              Kick Count (recent readings)
            </Text>
          </View>
          <SimpleBarChart data={kickBarData} color={colors.primary} textColor={colors.textMuted} />
        </View>
      </FadeSlideIn>

      {readingHistory.length === 0 && (
        <Text style={[styles.emptyNote, { color: colors.textMuted }]}>
          No data yet - once your belt starts sending readings, trends will appear here.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  pageTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
  card: { borderRadius: 14, padding: 16, marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700' },
  emptyNote: { fontSize: 13, textAlign: 'center', marginTop: 20, lineHeight: 18 },
});
