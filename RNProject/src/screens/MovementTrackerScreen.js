import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { type, space, radius, shadow } from '../theme/tokens';
import { FadeSlideIn, AnimatedPress, PulseRing, useBumpAnim } from '../components/Motion';
import Icon from '../components/Icon';
import SimpleLineChart from '../components/SimpleLineChart';
import { logKick, getTodayKickCount, getSevenDayAvgKicks, getKickCountsForLastNDays } from '../lib/dataService';

export default function MovementTrackerScreen({ userId, onBack }) {
  const { colors } = useTheme();
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [avg7Day, setAvg7Day] = useState(0);
  const [history14, setHistory14] = useState([]);
  const timerRef = useRef(null);
  const tapScale = useRef(new Animated.Value(1)).current;
  const countBump = useBumpAnim(sessionCount);

  const loadStats = async () => {
    if (!userId) return;
    try {
      const [today, avg, days] = await Promise.all([
        getTodayKickCount(userId),
        getSevenDayAvgKicks(userId),
        getKickCountsForLastNDays(userId, 14),
      ]);
      setTodayTotal(today);
      setAvg7Day(avg);
      setHistory14(days);
    } catch (err) {
      console.log('Movement stats error:', err.message);
    }
  };

  useEffect(() => {
    loadStats();
  }, [userId]);

  const startSession = () => {
    setSessionActive(true);
    setSessionCount(0);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };

  const endSession = () => {
    setSessionActive(false);
    clearInterval(timerRef.current);
  };

  const handleTap = async () => {
    if (!sessionActive) startSession();
    setSessionCount((c) => c + 1);
    setTodayTotal((t) => t + 1);

    Animated.sequence([
      Animated.spring(tapScale, { toValue: 0.9, useNativeDriver: true, speed: 60, bounciness: 10 }),
      Animated.spring(tapScale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 12 }),
    ]).start();

    try {
      await logKick(userId);
    } catch (err) {
      console.log('Log kick failed:', err.message);
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const isLow = avg7Day > 0 && todayTotal < avg7Day * 0.7;
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[type.h1, { color: colors.text }]}>Movement</Text>
        <View style={{ width: 20 }} />
      </View>

      {isLow && (
        <FadeSlideIn>
          <View style={[styles.alertBanner, { backgroundColor: colors.dangerBg }]}>
            <Icon name="alert" size={18} color={colors.danger} />
            <Text style={[type.caption, { color: colors.danger, marginLeft: space.sm, flex: 1 }]}>
              Today's count is notably below your 7-day average. If this continues, consider a
              focused kick session and check in with your doctor.
            </Text>
          </View>
        </FadeSlideIn>
      )}

      <View style={styles.tapArea}>
        <View style={styles.tapButtonWrap}>
          <PulseRing color={colors.primary} size={200} />
          <Animated.View style={{ transform: [{ scale: tapScale }] }}>
            <TouchableOpacity
              style={[styles.tapButton, { backgroundColor: colors.primary }, shadow(colors.cardShadow)]}
              onPress={handleTap}
              activeOpacity={0.85}
            >
              <Icon name="kick" size={40} color="#fff" />
              <Animated.Text style={[styles.tapCount, { transform: [{ scale: countBump }] }]}>
                {sessionCount}
              </Animated.Text>
              <Text style={styles.tapLabel}>Tap for each kick</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {sessionActive && (
          <FadeSlideIn distance={8} duration={280}>
            <View style={styles.sessionRow}>
              <View style={[styles.sessionChip, { backgroundColor: colors.surface }]}>
                <Icon name="clock" size={14} color={colors.textMuted} />
                <Text style={[type.caption, { color: colors.textMuted, marginLeft: 6 }]}>{formatTime(elapsed)}</Text>
              </View>
              <TouchableOpacity style={[styles.endBtn, { backgroundColor: colors.surfaceAlt }]} onPress={endSession}>
                <Text style={[type.caption, { color: colors.text }]}>End Session</Text>
              </TouchableOpacity>
            </View>
          </FadeSlideIn>
        )}
      </View>

      <FadeSlideIn delay={80}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[type.caption, { color: colors.textMuted }]}>TODAY</Text>
            <Text style={[type.h1, { color: colors.text }]}>{todayTotal}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[type.caption, { color: colors.textMuted }]}>7-DAY AVG</Text>
            <Text style={[type.h1, { color: colors.text }]}>{avg7Day.toFixed(1)}</Text>
          </View>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={140}>
        <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
          <Text style={[type.h3, { color: colors.text, marginBottom: space.md }]}>Last 14 Days</Text>
          <SimpleLineChart
            data={history14.map((d) => d.count)}
            color={colors.primary}
            textColor={colors.textMuted}
            height={110}
          />
        </View>
      </FadeSlideIn>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: space.lg, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.lg },
  backBtn: { padding: 4 },
  alertBanner: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, padding: space.md, marginBottom: space.lg },
  tapArea: { alignItems: 'center', marginBottom: space.lg },
  tapButtonWrap: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
  tapButton: { width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  tapCount: { fontSize: 40, fontWeight: '900', color: '#fff', marginTop: space.xs },
  tapLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', marginTop: space.lg },
  sessionChip: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: 8, marginRight: space.sm },
  endBtn: { borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: 8 },
  statsRow: { flexDirection: 'row', marginBottom: space.lg },
  statCard: { flex: 1, borderRadius: radius.lg, padding: space.lg, marginHorizontal: 4, alignItems: 'center' },
  chartCard: { borderRadius: radius.lg, padding: space.lg },
});
