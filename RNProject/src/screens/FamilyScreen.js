import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { loadContacts, saveContacts } from '../utils/familyStorage';

export default function FamilyScreen({ liveData, profile }) {
  const { colors } = useTheme();
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');

  useEffect(() => {
    (async () => {
      setContacts(await loadContacts());
    })();
  }, []);

  const handleAddContact = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Missing Info', 'Please enter a name and phone number.');
      return;
    }
    const updated = [...contacts, { id: Date.now().toString(), name, phone, relation }];
    setContacts(updated);
    await saveContacts(updated);
    setName('');
    setPhone('');
    setRelation('');
  };

  const handleRemoveContact = async (id) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    await saveContacts(updated);
  };

  const handleShareSnapshot = async () => {
    const message =
      `Fetal Care AI - Live Update for ${profile?.name || 'the mother'}\n\n` +
      `Heart Rate: ${liveData?.fingerDetected ? liveData.heartRate + ' BPM' : 'Not measured'}\n` +
      `Kick Count: ${liveData?.kickCount ?? '--'}\n` +
      `Status: ${liveData?.alert ? 'Alert - please check in' : 'Normal'}\n\n` +
      `Sent from the Fetal Care AI monitoring app.`;

    try {
      await Share.share({ title: 'Fetal Care AI - Live Update', message });
    } catch (err) {
      Alert.alert('Share Failed', err.message);
    }
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Family & Doctor Sharing</Text>
      <Text style={[styles.pageSubtitle, { color: colors.subtext }]}>
        Keep trusted contacts close, and share a live snapshot whenever you want.
      </Text>

      <TouchableOpacity
        style={[styles.shareButton, { backgroundColor: colors.primary }]}
        onPress={handleShareSnapshot}
      >
        <Text style={styles.shareButtonText}>📤 Share Live Snapshot Now</Text>
      </TouchableOpacity>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Add a Contact</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Name"
          placeholderTextColor={colors.subtext}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Phone number"
          placeholderTextColor={colors.subtext}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Relation (e.g. Doctor, Sister)"
          placeholderTextColor={colors.subtext}
          value={relation}
          onChangeText={setRelation}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primaryDark }]} onPress={handleAddContact}>
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>

      {contacts.map((c) => (
        <View key={c.id} style={[styles.contactCard, { backgroundColor: colors.card }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.contactName, { color: colors.text }]}>{c.name}</Text>
            <Text style={[styles.contactMeta, { color: colors.subtext }]}>
              {c.relation ? `${c.relation} - ` : ''}
              {c.phone}
            </Text>
          </View>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${c.phone}`)} style={styles.iconButton}>
            <Text style={styles.iconText}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(`sms:${c.phone}`)} style={styles.iconButton}>
            <Text style={styles.iconText}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRemoveContact(c.id)} style={styles.iconButton}>
            <Text style={[styles.iconText, { color: colors.danger }]}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={[styles.note, { color: colors.subtext }]}>
        Note: this shares a one-time snapshot when you tap the button above. For fully automatic
        live updates to multiple people at once, a cloud backend would be needed - ask if you'd
        like that built next.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  pageTitle: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  pageSubtitle: { fontSize: 12, marginBottom: 16, lineHeight: 17 },
  shareButton: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  shareButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  card: { borderRadius: 14, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8, fontSize: 13 },
  addButton: { borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 4 },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  contactCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, marginBottom: 10 },
  contactName: { fontSize: 14, fontWeight: '700' },
  contactMeta: { fontSize: 12, marginTop: 2 },
  iconButton: { paddingHorizontal: 8 },
  iconText: { fontSize: 18 },
  note: { fontSize: 11, textAlign: 'center', marginTop: 8, lineHeight: 16 },
});
