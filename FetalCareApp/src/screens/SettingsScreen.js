import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { type, space, radius, shadow } from '../theme/tokens';
import { FadeSlideIn, AnimatedPress } from '../components/Motion';
import Icon from '../components/Icon';
import { updateProfile, clearProfile } from '../lib/profileStore';
import { triggerSOSLocationAlert } from '../utils/sosHandler';

export default function SettingsScreen({ profile, userId, onProfileUpdated, onBack, onSignOut }) {
  const { colors, isDark, toggleTheme } = useTheme();

  const formatIsoToDisplayDate = (isoDate) => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      if (year && month && day && year.length === 4) {
        return `${day}-${month}-${year}`;
      }
    }
    return isoDate;
  };

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

  const [dueDate, setDueDate] = useState(formatIsoToDisplayDate(profile?.due_date) || '');
  const [emergencyContact, setEmergencyContact] = useState(profile?.emergency_contact || '');
  const [esp32Ip, setEsp32Ip] = useState(profile?.esp32_ip || '');
  const [familyMode, setFamilyMode] = useState(!!profile?.family_mode_enabled);
  const [saving, setSaving] = useState(false);

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
    const isoDueDate = parseDisplayDateToIso(dueDate.trim());
    if (dueDate.trim()) {
      const parts = isoDueDate.split('-');
      if (parts.length !== 3 || parts[0].length !== 4 || parts[1].length !== 2 || parts[2].length !== 2) {
        Alert.alert('Check the Date', 'Please use the format DD-MM-YYYY, e.g. 20-11-2026.');
        return;
      }
    }

    setSaving(true);
    try {
      const updated = await updateProfile({
        due_date: isoDueDate,
        emergency_contact: emergencyContact,
        family_mode_enabled: familyMode,
        esp32_ip: esp32Ip
      });
      onProfileUpdated(updated);
      Alert.alert('Saved', 'Your settings have been updated.');
    } catch (err) {
      Alert.alert('Could Not Save', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Alert',
      'This will immediately notify your emergency contact with your live location. Do you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: () => {
            triggerSOSLocationAlert(emergencyContact);
          }
        },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Profile',
      'This clears your due date and all locally stored data (kicks, moods, check-ins) on this device. This can\'t be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearProfile();
            onSignOut();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[type.h1, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 20 }} />
      </View>

      <FadeSlideIn delay={0}>
        <View style={[styles.card, { backgroundColor: colors.surface }, shadow(colors.cardShadow)]}>
          <Text style={[type.caption, { color: colors.textMuted, marginBottom: space.xs }]}>DUE DATE (DD-MM-YYYY)</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={dueDate}
            onChangeText={handleDateChange}
            placeholder="20-11-2026"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={50}>
        <View style={[styles.card, { backgroundColor: colors.surface }, shadow(colors.cardShadow)]}>
          <Text style={[type.caption, { color: colors.textMuted, marginBottom: space.xs }]}>EMERGENCY CONTACT</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="9876543210"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
          />
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={100}>
        <View style={[styles.card, { backgroundColor: colors.surface }, shadow(colors.cardShadow)]}>
          <Text style={[type.caption, { color: colors.textMuted, marginBottom: space.xs }]}>ESP32 BELT IP</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={esp32Ip}
            onChangeText={setEsp32Ip}
            placeholder="192.168.1.42"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
          />
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={150}>
        <View style={[styles.rowCard, { backgroundColor: colors.surface }]}>
          <View style={{ flex: 1 }}>
            <Text style={[type.bodyBold, { color: colors.text }]}>Family Mode</Text>
            <Text style={[type.caption, { color: colors.textMuted }]}>Show a read-only family view</Text>
          </View>
          <Switch value={familyMode} onValueChange={setFamilyMode} trackColor={{ true: colors.primary, false: colors.border }} thumbColor={colors.surface} />
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={200}>
        <View style={[styles.rowCard, { backgroundColor: colors.surface }]}>
          <View style={{ flex: 1 }}>
            <Text style={[type.bodyBold, { color: colors.text }]}>Dark Mode</Text>
            <Text style={[type.caption, { color: colors.textMuted }]}>Easier on the eyes at night</Text>
          </View>
          <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: colors.primary, false: colors.border }} thumbColor={colors.surface} />
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={250}>
        <AnimatedPress onPress={handleSave} disabled={saving} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </AnimatedPress>

        <AnimatedPress onPress={handleEmergency} style={[styles.emergencyBtn, { backgroundColor: colors.dangerBg }]}>
          <Icon name="alert" size={18} color={colors.danger} />
          <Text style={[type.bodyBold, { color: colors.danger, marginLeft: space.sm }]}>Emergency Alert</Text>
        </AnimatedPress>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleReset}>
          <Text style={[type.body, { color: colors.textMuted }]}>Reset Profile</Text>
        </TouchableOpacity>
      </FadeSlideIn>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: space.lg, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.lg },
  backBtn: { padding: 4 },
  card: { borderRadius: radius.lg, padding: space.lg, marginBottom: space.md },
  input: { borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: 12, fontSize: 14 },
  rowCard: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, padding: space.lg, marginBottom: space.md },
  saveBtn: { borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginTop: space.sm, marginBottom: space.xl },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  emergencyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, paddingVertical: 14, marginBottom: space.lg },
  signOutBtn: { alignItems: 'center', paddingVertical: space.md },
});
