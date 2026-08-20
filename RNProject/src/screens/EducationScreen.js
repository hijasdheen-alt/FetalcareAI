import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { EDUCATION_CATEGORIES } from '../data/educationData';
import { FadeSlideIn } from '../components/Motion';
import Icon from '../components/Icon';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function TipCard({ cat, isOpen, onToggle, colors }) {
  const rotate = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(rotate, { toValue: isOpen ? 0 : 1, duration: 220, useNativeDriver: true }).start();
    onToggle();
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + '1A' }]}>
          <Icon name={cat.icon} size={18} color={colors.primary} />
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{cat.title}</Text>
        <Animated.Text
          style={[
            styles.chevron,
            {
              color: colors.textMuted,
              transform: [{ rotate: rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }],
            },
          ]}
        >
          ▼
        </Animated.Text>
      </View>

      {isOpen && (
        <View style={styles.tipsList}>
          {cat.tips.map((tip, i) => (
            <Text key={i} style={[styles.tipText, { color: colors.textMuted }]}>
              •  {tip}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function EducationScreen() {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(null);

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <FadeSlideIn delay={0}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Tips & Wellness</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
          General guidance to support a healthy pregnancy. Always consult your doctor for
          personalized medical advice.
        </Text>
      </FadeSlideIn>

      {EDUCATION_CATEGORIES.map((cat, i) => (
        <FadeSlideIn key={cat.key} delay={60 + i * 40}>
          <TipCard
            cat={cat}
            isOpen={expanded === cat.key}
            onToggle={() => setExpanded(expanded === cat.key ? null : cat.key)}
            colors={colors}
          />
        </FadeSlideIn>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  pageTitle: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  pageSubtitle: { fontSize: 12, marginBottom: 16, lineHeight: 17 },
  card: { borderRadius: 14, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  cardTitle: { fontSize: 15, fontWeight: '700', flex: 1 },
  chevron: { fontSize: 11 },
  tipsList: { marginTop: 12 },
  tipText: { fontSize: 13, lineHeight: 20, marginBottom: 6 },
});
