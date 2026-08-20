import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { type, space } from '../theme/tokens';
import Icon from '../components/Icon';

const PHASES = [
  { label: 'Breathe In', duration: 4000, scale: 1.4 },
  { label: 'Hold', duration: 4000, scale: 1.4 },
  { label: 'Breathe Out', duration: 6000, scale: 1 },
];

export default function BreathingExerciseScreen({ onBack }) {
  const { colors } = useTheme();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef(null);

  const runPhase = (index) => {
    const phase = PHASES[index];
    setPhaseIndex(index);

    Animated.timing(scaleAnim, {
      toValue: phase.scale,
      duration: phase.duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    timeoutRef.current = setTimeout(() => {
      runPhase((index + 1) % PHASES.length);
    }, phase.duration);
  };

  const start = () => {
    setRunning(true);
    runPhase(0);
  };

  const stop = () => {
    setRunning(false);
    clearTimeout(timeoutRef.current);
    Animated.timing(scaleAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.primaryDark }]}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Icon name="back" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.circle,
            { backgroundColor: colors.accent, transform: [{ scale: scaleAnim }] },
          ]}
        />
        <Text style={styles.phaseText}>{running ? PHASES[phaseIndex].label : 'Ready when you are'}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: running ? 'rgba(255,255,255,0.15)' : colors.accent }]}
        onPress={running ? stop : start}
      >
        <Text style={[styles.buttonText, { color: running ? '#fff' : '#2B1B2E' }]}>
          {running ? 'Stop' : 'Start Breathing'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: space.lg, justifyContent: 'space-between' },
  backBtn: { padding: 4, marginTop: space.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 140, height: 140, borderRadius: 70 },
  phaseText: { ...type.h2, color: '#fff', marginTop: space.xxl },
  button: { borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: space.xl },
  buttonText: { fontWeight: '700', fontSize: 15 },
});
