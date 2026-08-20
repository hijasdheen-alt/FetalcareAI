import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { saveProfile } from '../utils/storage';
import { CONFIG } from '../config';

export default function LoginScreen({ onLoginComplete }) {
  const [name, setName] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [esp32Ip, setEsp32Ip] = useState(CONFIG.ESP32_DEFAULT_IP);
  const [dueDate, setDueDate] = useState('');

  const handleContinue = async () => {
    if (!name.trim() || !emergencyContact.trim()) {
      Alert.alert('Missing Info', 'Please enter your name and an emergency contact number.');
      return;
    }

    if (emergencyContact.trim().length < 10) {
      Alert.alert('Check Contact Number', 'Please enter a valid phone number.');
      return;
    }

    const profile = {
      name: name.trim(),
      emergencyContact: emergencyContact.trim(),
      esp32Ip: esp32Ip.trim() || CONFIG.ESP32_DEFAULT_IP,
      dueDate: dueDate.trim(), // format: YYYY-MM-DD
    };

    await saveProfile(profile);
    onLoginComplete(profile);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.emoji}>🤰</Text>
        <Text style={styles.title}>Welcome to Fetal Care AI</Text>
        <Text style={styles.subtitle}>Let's set up your profile before you begin</Text>

        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Priya"
        />

        <Text style={styles.label}>Emergency Contact Number</Text>
        <TextInput
          style={styles.input}
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          placeholder="e.g. 9876543210"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>ESP32 Belt IP Address</Text>
        <TextInput
          style={styles.input}
          value={esp32Ip}
          onChangeText={setEsp32Ip}
          placeholder="192.168.1.42"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Due Date (optional, for pregnancy tracker)</Text>
        <TextInput
          style={styles.input}
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="YYYY-MM-DD"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Your emergency contact will be automatically alerted with your live location if the
          SOS button on your belt is pressed.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#4c1d95', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24 },
  emoji: { fontSize: 40, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 4, marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  button: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  note: { fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 16, lineHeight: 16 },
});
