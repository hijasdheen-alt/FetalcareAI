import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { type, space, radius, shadow, moodColors } from '../../theme/tokens';
import Icon from '../Icon';

const MOOD_VALUE = { happy: 4, calm: 3, anxious: 2, stressed: 1 };
const MOOD_COLOR = moodColors;

function Bar({ value, color, trackColor, delay }) {
  const grow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(grow, {
      toValue: value / 4,
      duration: 500,
      delay,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <View style={styles.barColumn}>
      <View style={[styles.barTrack, { backgroundColor: trackColor }]}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: color,
              height: grow.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            },
          ]}
        />
      </View>
    </View>
  );
}

export default function MoodMiniChart({ last7Days }) {
  const { colors } = useTheme();
  // last7Days: array of { mood: 'happy'|'calm'|'anxious'|'stressed'|null } oldest to newest, length 7

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }, shadow(colors.cardShadow)]}>
      <View style={styles.header}>
        <Icon name="heart" size={16} color={colors.primary} />
        <Text style={[type.caption, { color: colors.textMuted, marginLeft: space.xs }]}>MOOD - LAST 7 DAYS</Text>
      </View>

      <View style={styles.barsRow}>
        {last7Days.map((d, i) => {
          const value = d.mood ? MOOD_VALUE[d.mood] : 0;
          const barColor = d.mood ? MOOD_COLOR[d.mood] : colors.border;
          return (
            <Bar key={i} value={value} color={barColor} trackColor={colors.bgAlt} delay={i * 60} />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg, marginTop: space.lg },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: space.md },
  barsRow: { flexDirection: 'row', height: 48, alignItems: 'flex-end', justifyContent: 'space-between' },
  barColumn: { flex: 1, marginHorizontal: 3, height: '100%', justifyContent: 'flex-end' },
  barTrack: { flex: 1, borderRadius: 6, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 6 },
});
