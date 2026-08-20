import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { type, space } from '../theme/tokens';
import { FadeSlideIn } from '../components/Motion';
import WeekBabyCard from '../components/dashboard/WeekBabyCard';
import MovementSummaryCard from '../components/dashboard/MovementSummaryCard';
import MoodMiniChart from '../components/dashboard/MoodMiniChart';
import VitalsCard from '../components/dashboard/VitalsCard';
import { DailyTipCard, QuickActions } from '../components/dashboard/DailyTipCard';
import { calculateCurrentWeek, getPregnancyInfoForWeek } from '../data/pregnancyData';
import { getDailyTip } from '../data/dailyTips';
import { getTodayKickCount, getSevenDayAvgKicks, getLast7DaysMoods } from '../lib/dataService';
import { computeWellnessScore, getMovementTrendInsight, getMoodTrendInsight } from '../utils/wellnessScore';

export default function DashboardScreen({ profile, userId, onNavigate, belt }) {
  const { colors } = useTheme();
  const [todayKicks, setTodayKicks] = useState(0);
  const [avgKicks, setAvgKicks] = useState(0);
  const [moods, setMoods] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const week = calculateCurrentWeek(profile?.due_date);
  const trimester = week ? (week <= 13 ? '1st' : week <= 27 ? '2nd' : '3rd') : '';
  const pregnancyInfo = week ? getPregnancyInfoForWeek(week) : null;
  const dailyTip = getDailyTip(week);

  const loadData = useCallback(async () => {
    if (!userId) return;
    try {
      const [today, avg, last7] = await Promise.all([
        getTodayKickCount(userId),
        getSevenDayAvgKicks(userId),
        getLast7DaysMoods(userId),
      ]);
      setTodayKicks(today);
      setAvgKicks(avg);
      setMoods(last7);
    } catch (err) {
      console.log('Dashboard load error:', err.message);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const wellness = computeWellnessScore({
    todayKicks,
    sevenDayAvgKicks: avgKicks,
    last7Moods: moods,
    todayCheckInFlags: null,
  });

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <FadeSlideIn delay={0}>
        <Text style={[type.caption, { color: colors.textMuted }]}>Good day,</Text>
        <Text style={[type.h1, { color: colors.text, marginBottom: space.lg }]}>
          {profile?.name || 'there'}
        </Text>
      </FadeSlideIn>

      <FadeSlideIn delay={60}>
        <WeekBabyCard
          week={week}
          trimester={trimester}
          size={pregnancyInfo?.size}
          note={pregnancyInfo?.note}
        />
      </FadeSlideIn>

      <FadeSlideIn delay={120}>
        <View style={styles.wellnessRow}>
          <View style={[styles.wellnessCard, { backgroundColor: colors.surface }]}>
            <Text style={[type.caption, { color: colors.textMuted }]}>WELLNESS SCORE</Text>
            <Text style={[type.display, { color: colors.primary, marginTop: 4 }]}>{wellness.overall}</Text>
            <Text style={[type.caption, { color: colors.textMuted, marginTop: 2 }]}>{wellness.label}</Text>
          </View>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={160}>
        <View style={styles.row}>
          <MovementSummaryCard todayCount={todayKicks} sevenDayAvg={avgKicks} />
        </View>
      </FadeSlideIn>

      {profile?.esp32_ip ? (
        <FadeSlideIn delay={200}>
          <VitalsCard
            connected={belt?.connected}
            heartRate={belt?.data?.heartRate}
            fingerDetected={belt?.data?.fingerDetected}
            alert={belt?.data?.alert}
          />
        </FadeSlideIn>
      ) : null}

      <FadeSlideIn delay={240}>
        <MoodMiniChart last7Days={moods} />
      </FadeSlideIn>

      <FadeSlideIn delay={280}>
        <DailyTipCard tip={dailyTip} />
      </FadeSlideIn>

      <FadeSlideIn delay={320}>
        <QuickActions
          onLogKicks={() => onNavigate('movement')}
          onCheckIn={() => onNavigate('checkin')}
          onLogMood={() => onNavigate('mood')}
        />
      </FadeSlideIn>

      <FadeSlideIn delay={360}>
        <View style={[styles.insightCard, { backgroundColor: colors.surfaceAlt }]}>
          <Text style={[type.caption, { color: colors.textMuted, marginBottom: 4 }]}>MOVEMENT INSIGHT</Text>
          <Text style={[type.body, { color: colors.text, lineHeight: 19 }]}>
            {getMovementTrendInsight(todayKicks, avgKicks)}
          </Text>
        </View>

        <View style={[styles.insightCard, { backgroundColor: colors.surfaceAlt, marginTop: space.md }]}>
          <Text style={[type.caption, { color: colors.textMuted, marginBottom: 4 }]}>MOOD INSIGHT</Text>
          <Text style={[type.body, { color: colors.text, lineHeight: 19 }]}>{getMoodTrendInsight(moods)}</Text>
        </View>
      </FadeSlideIn>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: space.lg, paddingBottom: 40 },
  wellnessRow: { marginBottom: space.md },
  wellnessCard: { borderRadius: 20, padding: space.lg },
  row: { flexDirection: 'row' },
  insightCard: { borderRadius: 16, padding: space.md, marginTop: space.md },
});
