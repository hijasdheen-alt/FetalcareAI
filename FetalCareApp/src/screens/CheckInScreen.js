import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { type, space, radius, shadow } from '../theme/tokens';
import { FadeSlideIn, AnimatedPress } from '../components/Motion';
import Icon from '../components/Icon';
import { logCheckIn, getCheckInHistory } from '../lib/dataService';

const QUESTIONS = [
  { key: 'headache', label: 'Severe or persistent headache?' },
  { key: 'bleeding', label: 'Any bleeding or unusual discharge?' },
  { key: 'swelling', label: 'Sudden swelling in hands, face, or feet?' },
  { key: 'vision_changes', label: 'Blurred vision or seeing spots?' },
  { key: 'reduced_movement', label: 'Noticeably reduced baby movement?' },
];

export default function CheckInScreen({ userId, onBack }) {
  const { colors } = useTheme();
  const [flags, setFlags] = useState({});
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);

  const loadHistory = async () => {
    try {
      setHistory(await getCheckInHistory(userId, 10));
    } catch (err) {
      console.log('Check-in history error:', err.message);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const anyFlagged = Object.values(flags).some(Boolean);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await logCheckIn(userId, flags);
      await loadHistory();
      setFlags({});
      Alert.alert('Saved', 'Your check-in has been logged.');
    } catch (err) {
      Alert.alert('Could Not Save', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[type.h1, { color: colors.text }]}>Daily Check-In</Text>
        <View style={{ width: 20 }} />
      </View>

      {anyFlagged && (
        <FadeSlideIn distance={8} duration={280}>
          <View style={[styles.alertCard, { backgroundColor: colors.dangerBg }]}>
            <Icon name="alert" size={18} color={colors.danger} />
            <Text style={[type.body, { color: colors.danger, marginLeft: space.sm, flex: 1, lineHeight: 19 }]}>
              One or more of these can be worth a quick call to your doctor - it's always better to
              check than to wait.
            </Text>
          </View>
        </FadeSlideIn>
      )}

      <FadeSlideIn delay={40}>
        <View style={[styles.card, { backgroundColor: colors.surface }, shadow(colors.cardShadow)]}>
          {QUESTIONS.map((q) => (
            <View key={q.key} style={styles.questionRow}>
              <Text style={[type.body, { color: colors.text, flex: 1 }]}>{q.label}</Text>
              <Switch
                value={!!flags[q.key]}
                onValueChange={(val) => setFlags((f) => ({ ...f, [q.key]: val }))}
                trackColor={{ true: colors.danger, false: colors.border }}
                thumbColor={colors.surface}
              />
            </View>
          ))}

          <AnimatedPress
            onPress={handleSubmit}
            disabled={saving}
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.submitText}>{saving ? 'Saving...' : 'Save Check-In'}</Text>
          </AnimatedPress>
        </View>
      </FadeSlideIn>

      <Text style={[type.h3, { color: colors.text, marginTop: space.xl, marginBottom: space.md }]}>History</Text>
      {history.map((h, i) => {
        const flaggedCount = ['headache', 'bleeding', 'swelling', 'vision_changes', 'reduced_movement'].filter((k) => h[k]).length;
        return (
          <FadeSlideIn key={h.id} delay={i * 40} distance={8}>
            <View style={[styles.historyRow, { backgroundColor: colors.surface }]}>
              <Text style={[type.caption, { color: colors.textMuted }]}>
                {new Date(h.logged_at).toLocaleDateString()} {new Date(h.logged_at).toLocaleTimeString()}
              </Text>
              <Text style={[type.caption, { color: flaggedCount > 0 ? colors.danger : colors.success }]}>
                {flaggedCount > 0 ? `${flaggedCount} flagged` : 'All clear'}
              </Text>
            </View>
          </FadeSlideIn>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: space.lg, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.lg },
  backBtn: { padding: 4 },
  alertCard: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, padding: space.md, marginBottom: space.lg },
  card: { borderRadius: radius.lg, padding: space.lg },
  questionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm },
  submitBtn: { borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginTop: space.md },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', borderRadius: radius.md, padding: space.md, marginBottom: space.sm },
});
