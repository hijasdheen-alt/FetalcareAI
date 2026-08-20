// Lightweight, dependency-free animation helpers built on React Native's
// built-in Animated API (no reanimated / native rebuild required).
// - FadeSlideIn: entrance animation for cards/sections, supports stagger via `delay`
// - AnimatedPress: scale-down-on-press wrapper for any touchable content
// - Pop: scale-in "pop" for things that should draw the eye (badges, checks)

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable } from 'react-native';

export function FadeSlideIn({ children, delay = 0, distance = 14, duration = 420, style }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [distance, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function Pop({ trigger, children, style }) {
  const scale = useRef(new Animated.Value(trigger ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: trigger ? 1 : 0,
      useNativeDriver: true,
      friction: 5,
      tension: 140,
    }).start();
  }, [trigger]);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}

export function AnimatedPress({ onPress, children, style, scaleTo = 0.94, disabled }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { toValue: scaleTo, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  };

  return (
    <Pressable onPress={disabled ? undefined : onPress} onPressIn={pressIn} onPressOut={pressOut} disabled={disabled}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

// A soft, looping pulse ring - used behind the movement-tracker tap button
// so the whole screen doesn't feel static while waiting for the next kick.
export function PulseRing({ color, size = 200, style }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.18,
          duration: 1400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    scale.setValue(1);
    opacity.setValue(0.35);
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
          transform: [{ scale }],
        },
        style,
      ]}
    />
  );
}

// A quick "bump" on any value change - used for counters (kick count etc).
export function useBumpAnim(value) {
  const bump = useRef(new Animated.Value(1)).current;
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    Animated.sequence([
      Animated.timing(bump, { toValue: 1.18, duration: 110, useNativeDriver: true }),
      Animated.spring(bump, { toValue: 1, useNativeDriver: true, friction: 4, tension: 160 }),
    ]).start();
  }, [value]);

  return bump;
}
