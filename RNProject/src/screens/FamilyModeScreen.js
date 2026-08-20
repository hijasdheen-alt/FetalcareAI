import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { type, space, radius, shadow } from '../theme/tokens';
import { FadeSlideIn } from '../components/Motion';
import Icon from '../components/Icon';
import { calculateCurrentWeek, getPregnancyInfoForWeek } from '../data/pregnancyData';

export default function FamilyModeScreen({ profile, todayKicks, belt, onBack }) {
  const { colors } = useTheme();
  const week = calculateCurrentWeek(profile?.due_date);
  const info = week ? getPregnancyInfoForWeek(week) : null;

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[type.h1, { color: colors.text }]}>Family View</Text>
        <View style={{ width: 20 }} />
      </View>

      <Text style={[type.caption, { color: colors.textMuted, marginBottom: space.lg }]}>
        A gentle, read-only view for the people supporting {profile?.name || 'the mother'}.
      </Text>

      <FadeSlideIn delay={0}>
        <View style={[styles.card, { backgroundColor: colors.primaryDark }, shadow(colors.cardShadow)]}>
          <Text style={styles.weekBadge}>WEEK {week || '–'}</Text>
          <Text style={styles.devTitle}>This week, baby can hear sounds</Text>
          <Text style={styles.devText}>{info?.note || 'Every week brings new growth.'}</Text>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={70}>
        <View style={[styles.card, { backgroundColor: colors.surface }, shadow(colors.cardShadow)]}>
          <View style={styles.cardHeader}>
            <Icon name="bulb" size={18} color={colors.accent} />
            <Text style={[type.h3, { color: colors.text, marginLeft: space.sm }]}>Nutrition Tip</Text>
          </View>
          <Text style={[type.body, { color: colors.textMuted, lineHeight: 19, marginTop: space.xs }]}>
            She needs iron-rich food today - leafy greens, lentils, or lean protein can help.
          </Text>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={140}>
        <View style={[styles.card, { backgroundColor: colors.surface }, shadow(colors.cardShadow)]}>
          <View style={styles.cardHeader}>
            <Icon name="kick" size={18} color={colors.accentAlt} />
            <Text style={[type.h3, { color: colors.text, marginLeft: space.sm }]}>Movement Today</Text>
          </View>
          <Text style={[type.display, { color: colors.text, marginTop: space.xs }]}>{todayKicks ?? '--'}</Text>
          <Text style={[type.caption, { color: colors.textMuted }]}>kicks logged so far</Text>
        </View>
      </FadeSlideIn>

      {belt?.data && (
        <FadeSlideIn delay={210}>
          <View style={[styles.card, { backgroundColor: colors.surface }, shadow(colors.cardShadow)]}>
            <View style={styles.cardHeader}>
              <Icon name="heart" size={18} color={colors.danger} />
              <Text style={[type.h3, { color: colors.text, marginLeft: space.sm }]}>Heart Rate</Text>
            </View>
            <Text style={[type.display, { color: colors.text, marginTop: space.xs }]}>
              {belt.data.fingerDetected ? `${belt.data.heartRate} BPM` : '--'}
            </Text>
            <Text style={[type.caption, { color: colors.textMuted }]}>from the monitoring belt</Text>
          </View>
        </FadeSlideIn>
      )}

      <Text style={[type.caption, { color: colors.textMuted, textAlign: 'center', marginTop: space.md }]}>
        This is a preview of Family Mode. Live multi-person sharing isn't enabled yet.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: space.lg, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.sm },
  backBtn: { padding: 4 },
  card: { borderRadius: radius.lg, padding: space.lg, marginBottom: space.md },
  weekBadge: { ...type.micro, color: 'rgba(255,255,255,0.6)' },
  devTitle: { ...type.h2, color: '#fff', marginTop: space.xs },
  devText: { ...type.body, color: 'rgba(255,255,255,0.8)', marginTop: space.sm, lineHeight: 19 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
});
