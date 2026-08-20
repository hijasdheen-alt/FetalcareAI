import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { type, space } from '../theme/tokens';
import Icon from './Icon';

const TABS = [
  { key: 'dashboard', label: 'Home', icon: 'home' },
  { key: 'trends', label: 'Trends', icon: 'trend' },
  { key: 'tips', label: 'Tips', icon: 'bulb' },
  { key: 'family', label: 'Family', icon: 'family' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

function Tab({ tab, isActive, onPress, colors }) {
  const scale = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(lift, { toValue: isActive ? 1 : 0, useNativeDriver: true, friction: 6, tension: 120 }).start();
  }, [isActive]);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, speed: 50, bounciness: 8 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity style={styles.tab} onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.iconWrap,
          {
            transform: [
              { scale },
              { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) },
            ],
            backgroundColor: isActive ? colors.primary + '22' : 'transparent',
          },
        ]}
      >
        <Icon name={tab.icon} size={18} color={isActive ? colors.primary : colors.textMuted} />
      </Animated.View>
      <Text style={[type.micro, { color: isActive ? colors.primary : colors.textMuted, marginTop: 4 }]}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
}

export default function BottomTabBar({ activeTab, onTabChange }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      {TABS.map((tab) => (
        <Tab
          key={tab.key}
          tab={tab}
          isActive={tab.key === activeTab}
          onPress={() => onTabChange(tab.key)}
          colors={colors}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', borderTopWidth: 1, paddingTop: space.sm, paddingBottom: space.md },
  tab: { flex: 1, alignItems: 'center' },
  iconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
