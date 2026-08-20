import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const MOODS = [
  { key: 'happy', label: 'Happy', emoji: '😊',
    suggestion: 'Great to hear! Keep up your routine, stay hydrated, and enjoy some light activity if you feel up to it.' },
  { key: 'calm', label: 'Calm', emoji: '😌',
    suggestion: 'Wonderful. A great time for gentle stretching, prenatal yoga, or simply resting and bonding with your baby.' },
  { key: 'tired', label: 'Tired', emoji: '😴',
    suggestion: 'Your body is working hard. Try to rest, stay hydrated, and avoid overexertion. Lying on your left side can help.' },
  { key: 'anxious', label: 'Anxious', emoji: '😟',
    suggestion: 'Try slow, deep breathing: inhale 4s, hold 4s, exhale 6s. If it feels overwhelming, talk to your doctor.' },
  { key: 'stressed', label: 'Stressed', emoji: '😣',
    suggestion: 'Take a short break from screens if possible. Gentle music or talking to a loved one can help.' },
  { key: 'unwell', label: 'Unwell', emoji: '🤒',
    suggestion: 'Please rest and monitor closely. If paired with unusual vitals or reduced movement, contact your doctor.' },
];

export default function MoodTracker({ onMoodLogged }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSelect = (mood) => {
    setSelectedMood(mood);
    const entry = { ...mood, timestamp: new Date().toLocaleTimeString() };
    setHistory((prev) => [entry, ...prev]);
    if (onMoodLogged) onMoodLogged(entry);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>How are you feeling today?</Text>

      <View style={styles.moodRow}>
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood.key}
            style={[styles.moodButton, selectedMood?.key === mood.key && styles.moodButtonSelected]}
            onPress={() => handleSelect(mood)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedMood && (
        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionTitle}>Suggestion</Text>
          <Text style={styles.suggestionText}>{selectedMood.suggestion}</Text>
        </View>
      )}

      {history.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Today's Log</Text>
          <ScrollView style={{ maxHeight: 120 }}>
            {history.map((entry, idx) => (
              <Text key={idx} style={styles.historyItem}>
                {entry.emoji} {entry.label} — {entry.timestamp}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12, color: '#111827' },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap' },
  moodButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
    minWidth: 78,
  },
  moodButtonSelected: { borderColor: '#7c3aed', backgroundColor: '#f5f3ff' },
  emoji: { fontSize: 22 },
  moodLabel: { fontSize: 11, marginTop: 4, color: '#374151', fontWeight: '600' },
  suggestionCard: { backgroundColor: '#f5f3ff', borderRadius: 10, padding: 12, marginTop: 8 },
  suggestionTitle: { fontWeight: '700', marginBottom: 4, color: '#5b21b6', fontSize: 13 },
  suggestionText: { fontSize: 13, color: '#374151', lineHeight: 18 },
  historySection: { marginTop: 16 },
  historyTitle: { fontWeight: '700', marginBottom: 6, fontSize: 13, color: '#111827' },
  historyItem: { fontSize: 12, color: '#6b7280', paddingVertical: 3 },
});
