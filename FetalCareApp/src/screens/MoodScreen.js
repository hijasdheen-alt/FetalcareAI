import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { type, space, radius, shadow, moodColors } from '../theme/tokens';
import { FadeSlideIn, AnimatedPress, Pop } from '../components/Motion';
import Icon from '../components/Icon';
import MoodMiniChart from '../components/dashboard/MoodMiniChart';
import { logMood, getLast7DaysMoods } from '../lib/dataService';
import { getMoodTrendInsight } from '../utils/wellnessScore';

const MOODS = [
  { key: 'happy', label: 'Happy', color: moodColors.happy },
  { key: 'calm', label: 'Calm', color: moodColors.calm },
  { key: 'anxious', label: 'Anxious', color: moodColors.anxious },
  { key: 'stressed', label: 'Stressed', color: moodColors.stressed },
];

export default function MoodScreen({ userId, onBack, onOpenBreathing }) {
  const { colors } = useTheme();
  const [last7, setLast7] = useState([]);
  const [selected, setSelected] = useState(null);

  const loadMoods = async () => {
    try {
      setLast7(await getLast7DaysMoods(userId));
    } catch (err) {
      console.log('Mood load error:', err.message);
    }
  };

  useEffect(() => {
    loadMoods();
  }, [userId]);

  const handleSelect = async (moodKey) => {
    setSelected(moodKey);
    try {
      await logMood(userId, moodKey);
      await loadMoods();
    } catch (err) {
      console.log('Log mood error:', err.message);
    }
  };

  const concerningCount = last7.filter((m) => m.mood === 'anxious' || m.mood === 'stressed').length;
  const showSupport = concerningCount >= 3;

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[type.h1, { color: colors.text }]}>Mood</Text>
        <View style={{ width: 20 }} />
      </View>

      <Text style={[type.h3, { color: colors.text, marginBottom: space.md }]}>How are you feeling today?</Text>

      <View style={styles.moodRow}>
        {MOODS.map((m) => {
          const isSelected = selected === m.key;
          return (
            <AnimatedPress
              key={m.key}
              onPress={() => handleSelect(m.key)}
              scaleTo={0.9}
              style={[
                styles.moodBtn,
                { backgroundColor: colors.surface },
                isSelected && { borderWidth: 2, borderColor: m.color },
              ]}
            >
              <View style={styles.dotWrap}>
                <View style={[styles.moodDot, { backgroundColor: m.color }]} />
                <Pop trigger={isSelected} style={styles.checkBadge}>
                  <View style={[styles.checkCircle, { backgroundColor: colors.surface, borderColor: m.color }]}>
                    <Icon name="check" size={10} color={m.color} />
                  </View>
                </Pop>
              </View>
              <Text style={[type.caption, { color: colors.text, marginTop: space.xs }]}>{m.label}</Text>
            </AnimatedPress>
          );
        })}
      </View>

      <FadeSlideIn delay={60}>
        <MoodMiniChart last7Days={last7} />
      </FadeSlideIn>

      <FadeSlideIn delay={120}>
        <View style={[styles.insightCard, { backgroundColor: colors.surfaceAlt }]}>
          <Text style={[type.body, { color: colors.text, lineHeight: 19 }]}>{getMoodTrendInsight(last7)}</Text>
        </View>
      </FadeSlideIn>

      {showSupport && (
        <FadeSlideIn delay={180}>
          <View style={[styles.supportCard, { backgroundColor: colors.primaryDark }]}>
            <Text style={styles.supportTitle}>A gentle suggestion</Text>
            <Text style={styles.supportText}>
              A few tougher days in a row is worth some extra care. A short breathing exercise can
              help in the moment, and talking to someone you trust matters too.
            </Text>
            <TouchableOpacity style={[styles.breathingBtn, { backgroundColor: colors.accent }]} onPress={onOpenBreathing}>
              <Text style={styles.breathingBtnText}>Start Breathing Exercise</Text>
            </TouchableOpacity>
          </View>
        </FadeSlideIn>
      )}

      {!showSupport && (
        <FadeSlideIn delay={180}>
          <TouchableOpacity style={[styles.breathingLink, { backgroundColor: colors.surface }]} onPress={onOpenBreathing}>
            <Icon name="flower" size={18} color={colors.accentAlt} />
            <Text style={[type.bodyBold, { color: colors.text, marginLeft: space.sm }]}>Try a breathing exercise</Text>
          </TouchableOpacity>
        </FadeSlideIn>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: space.lg, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.lg },
  backBtn: { padding: 4 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.lg },
  moodBtn: { flex: 1, alignItems: 'center', borderRadius: radius.lg, paddingVertical: space.md, marginHorizontal: 4 },
  dotWrap: { width: 28, height: 28 },
  moodDot: { width: 28, height: 28, borderRadius: 14 },
  checkBadge: { position: 'absolute', bottom: -4, right: -6 },
  checkCircle: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  insightCard: { borderRadius: radius.lg, padding: space.md, marginTop: space.md },
  supportCard: { borderRadius: radius.lg, padding: space.lg, marginTop: space.lg },
  supportTitle: { ...type.h3, color: '#fff', marginBottom: space.xs },
  supportText: { ...type.body, color: 'rgba(255,255,255,0.85)', lineHeight: 19 },
  breathingBtn: { borderRadius: radius.md, paddingVertical: 12, alignItems: 'center', marginTop: space.md },
  breathingBtnText: { color: '#2B1B2E', fontWeight: '700', fontSize: 13 },
  breathingLink: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, padding: space.md, marginTop: space.lg },
});
