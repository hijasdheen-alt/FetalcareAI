import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import StatusHeader from '../components/StatusHeader';
import DashboardCard from '../components/DashboardCard';
import SOSBanner from '../components/SOSBanner';
import MoodTracker from '../components/MoodTracker';
import { generateAndShareReport } from '../utils/reportGenerator';
import { clearProfile } from '../utils/storage';
import { useTheme } from '../theme/ThemeContext';
import { CONFIG } from '../config';

export default function HomeScreen({
  profile,
  onLogout,
  esp32Ip,
  setEsp32Ip,
  data,
  connected,
  readingHistory,
  moodLog,
  logMood,
  clearHistory,
  refetch,
}) {
  const { colors, isDark, toggleTheme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDownloadReport = async () => {
    setGeneratingReport(true);
    try {
      await generateAndShareReport({ profile, readingHistory, moodLog });
    } catch (err) {
      Alert.alert('Report Failed', err.message);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert('Clear History', 'This will delete all saved readings and mood logs. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearHistory },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await clearProfile();
          onLogout();
        },
      },
    ]);
  };

  const heartRateDanger =
    data?.fingerDetected &&
    data.heartRate > 0 &&
    (data.heartRate < CONFIG.HEART_RATE_MIN || data.heartRate > CONFIG.HEART_RATE_MAX);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <StatusHeader connected={connected} />
      <SOSBanner visible={data?.sos} />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.profileRow}>
          <Text style={[styles.greeting, { color: colors.text }]}>Hi, {profile?.name || 'there'} 👋</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={[styles.logoutText, { color: colors.danger }]}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.themeRow, { backgroundColor: colors.card }]}>
          <Text style={[styles.themeLabel, { color: colors.text }]}>🌙 Dark Mode</Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>

        <View style={[styles.ipRow, { backgroundColor: colors.card }]}>
          <Text style={[styles.ipLabel, { color: colors.subtext }]}>ESP32 IP</Text>
          <TextInput
            style={[styles.ipInput, { color: colors.text }]}
            value={esp32Ip}
            onChangeText={setEsp32Ip}
            placeholder="192.168.1.42"
            placeholderTextColor={colors.subtext}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.grid}>
          <DashboardCard
            icon="❤️"
            label="Heart Rate"
            value={data?.fingerDetected ? data.heartRate : '--'}
            unit={data?.fingerDetected ? 'BPM' : ''}
            danger={heartRateDanger}
          />
          <DashboardCard icon="👣" label="Kick Count" value={data?.kickCount ?? '--'} />
          <DashboardCard icon="📈" label="Movement" value={data?.movement ?? '--'} />
          <DashboardCard
            icon={data?.alert ? '⚠️' : '✅'}
            label="Status"
            value={data?.alert ? 'Alert' : 'Normal'}
            danger={data?.alert}
          />
        </View>

        <TouchableOpacity
          style={[styles.reportButton, { backgroundColor: colors.primaryDark }]}
          onPress={handleDownloadReport}
          disabled={generatingReport}
        >
          <Text style={styles.reportButtonText}>
            {generatingReport ? 'Generating Report...' : '📄 Download Health Report'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
          <Text style={[styles.clearButtonText, { color: colors.subtext }]}>Clear Saved History</Text>
        </TouchableOpacity>

        <MoodTracker onMoodLogged={logMood} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 20 },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greeting: { fontSize: 15, fontWeight: '700' },
  logoutText: { fontSize: 13, fontWeight: '600' },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  themeLabel: { fontSize: 13, fontWeight: '600' },
  ipRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16 },
  ipLabel: { fontSize: 12, marginRight: 8, fontWeight: '600' },
  ipInput: { flex: 1, fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  reportButton: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  reportButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  clearButton: { paddingVertical: 10, alignItems: 'center', marginBottom: 12 },
  clearButtonText: { fontSize: 12, fontWeight: '600' },
});
