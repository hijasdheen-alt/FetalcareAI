import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🤰',
    title: 'Welcome to Fetal Care AI',
    desc: 'A smart wearable belt that watches over you and your baby, so you can feel confident between checkups.',
  },
  {
    emoji: '❤️',
    title: 'Live Health Monitoring',
    desc: 'Track maternal heart rate, fetal kicks, and movement in real time, right from your phone.',
  },
  {
    emoji: '🚨',
    title: 'Emergency SOS',
    desc: 'One press on the belt automatically alerts your emergency contact with your live location.',
  },
  {
    emoji: '📈',
    title: 'Trends, Tips & More',
    desc: 'See your trends over time, get weekly pregnancy insights, mood support, and share updates with family.',
  },
];

export default function OnboardingScreen({ onDone }) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  const goNext = () => {
    if (index < SLIDES.length - 1) {
      scrollRef.current.scrollTo({ x: width * (index + 1), animated: true });
    } else {
      onDone();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{slide.emoji}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.desc}>{slide.desc}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={goNext}>
        <Text style={styles.buttonText}>
          {index === SLIDES.length - 1 ? "Let's Get Started" : 'Next'}
        </Text>
      </TouchableOpacity>

      {index < SLIDES.length - 1 && (
        <TouchableOpacity style={styles.skip} onPress={onDone}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4c1d95' },
  slide: { justifyContent: 'center', alignItems: 'center', padding: 32 },
  emoji: { fontSize: 64, marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  desc: { fontSize: 14, color: '#ddd6fe', textAlign: 'center', lineHeight: 20 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6d28d9', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#fff', width: 20 },
  button: {
    backgroundColor: '#fff',
    marginHorizontal: 32,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#4c1d95', fontWeight: '700', fontSize: 15 },
  skip: { alignItems: 'center', marginBottom: 24 },
  skipText: { color: '#ddd6fe', fontSize: 13 },
});
