import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { saveProfile } from '../lib/profileStore';
import { useTheme } from '../theme/ThemeContext';
import { type, space, radius, shadow } from '../theme/tokens';
import { FadeSlideIn, AnimatedPress } from '../components/Motion';
import Icon from '../components/Icon';
import { calculateCurrentWeek } from '../data/pregnancyData';
import { CONFIG } from '../config';

const LOCAL_USER_ID = 'user_001';

export default function PregnancySetupScreen({ userId, onComplete }) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [esp32Ip, setEsp32Ip] = useState('');
  const [loading, setLoading] = useState(false);

  const parseDisplayDateToIso = (displayDate) => {
    if (!displayDate) return '';
    const parts = displayDate.split('-');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (day && month && year && year.length === 4) {
        return `${year}-${month}-${day}`;
      }
    }
    return displayDate;
  };

  const handleDateChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
    }
    setDueDate(formatted);
  };

  const handleSave = async () => {
    if (!dueDate.trim()) {
      Alert.alert('Due Date Needed', 'Please enter your due date so we can personalize your dashboard.');
      return;
    }
    const isoDueDate = parseDisplayDateToIso(dueDate.trim());
    const week = calculateCurrentWeek(isoDueDate);
    if (!week) {
      Alert.alert('Check the Date', 'Please use the format DD-MM-YYYY, e.g. 20-11-2026.');
      return;
    }

    setLoading(true);
    try {
      const profile = {
        id: LOCAL_USER_ID,
        name: name.trim() || null,
        due_date: isoDueDate,
        emergency_contact: emergencyContact.trim() || null,
        esp32_ip: esp32Ip.trim() || null,
      };
      await saveProfile(profile);
      onComplete(profile);
    } catch (err) {
      Alert.alert('Could Not Save', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.peach }]}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
          <Icon name="baby" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Fetal Care AI</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Let's set up your journey</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }, shadow(colors.cardShadow)]}>
        <Field label="YOUR NAME" value={name} onChange={setName} placeholder="Priya" colors={colors} />
        <Field
          label="DUE DATE (DD-MM-YYYY)"
          value={dueDate}
          onChange={handleDateChange}
          placeholder="20-11-2026"
          keyboardType="numeric"
          maxLength={10}
          colors={colors}
        />
        <Field
          label="EMERGENCY CONTACT"
          value={emergencyContact}
          onChange={setEmergencyContact}
          placeholder="9876543210"
          keyboardType="phone-pad"
          colors={colors}
        />
        <Field
          label="ESP32 BELT IP (OPTIONAL)"
          value={esp32Ip}
          onChange={setEsp32Ip}
          placeholder="192.168.1.42"
          colors={colors}
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continue</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Field({ label, value, onChange, placeholder, keyboardType, maxLength, colors }) {
  return (
    <View style={{ marginBottom: space.md }}>
      <Text style={[type.caption, { color: colors.textMuted, marginBottom: space.xs }]}>{label}</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: space.xl },
  header: { alignItems: 'center', marginBottom: space.xxl },
  logoCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: space.sm },
  brand: { ...type.h2, color: '#fff', marginBottom: space.lg },
  title: { ...type.h1, color: '#fff', marginTop: space.md, textAlign: 'center' },
  subtitle: { ...type.body, color: 'rgba(255,255,255,0.7)', marginTop: 4, textAlign: 'center' },
  card: { borderRadius: radius.xl, padding: space.xl },
  input: { borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: 12, fontSize: 14 },
  button: { borderRadius: radius.md, paddingVertical: 15, alignItems: 'center', marginTop: space.sm },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
