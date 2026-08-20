import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomTabBar from './components/BottomTabBar';
import DashboardScreen from './screens/DashboardScreen';
import TrendsScreen from './screens/TrendsScreen';
import EducationScreen from './screens/EducationScreen';
import FamilyModeScreen from './screens/FamilyModeScreen';
import SettingsScreen from './screens/SettingsScreen';
import MovementTrackerScreen from './screens/MovementTrackerScreen';
import CheckInScreen from './screens/CheckInScreen';
import MoodScreen from './screens/MoodScreen';
import BreathingExerciseScreen from './screens/BreathingExerciseScreen';
import { useTheme } from './theme/ThemeContext';
import { getTodayKickCount, getKickCountsForLastNDays } from './lib/dataService';
import { useEsp32 } from './lib/useEsp32';

export default function MainApp({ profile, userId, onProfileUpdated, onSignOut }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pushedScreen, setPushedScreen] = useState(null); // 'movement' | 'checkin' | 'mood' | 'breathing'
  const [todayKicks, setTodayKicks] = useState(0);
  const [readingHistory, setReadingHistory] = useState([]);
  const { colors } = useTheme();
  const belt = useEsp32(profile?.esp32_ip, userId, profile?.emergency_contact);

  const refreshTodayKicks = async () => {
    try {
      setTodayKicks(await getTodayKickCount(userId));
      const days = await getKickCountsForLastNDays(userId, 14);
      setReadingHistory(days.map((d) => ({ time: d.date, heartRate: null, kickCount: d.count, movement: 0 })));
    } catch (err) {
      console.log('refresh error', err.message);
    }
  };

  useEffect(() => {
    refreshTodayKicks();
  }, [userId]);

  useEffect(() => {
    if (belt.data) refreshTodayKicks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [belt.data?.kickCount]);

  const goBack = () => {
    setPushedScreen(null);
    refreshTodayKicks();
  };

  if (pushedScreen === 'movement') {
    return <MovementTrackerScreen userId={userId} onBack={goBack} />;
  }
  if (pushedScreen === 'checkin') {
    return <CheckInScreen userId={userId} onBack={goBack} />;
  }
  if (pushedScreen === 'mood') {
    return <MoodScreen userId={userId} onBack={goBack} onOpenBreathing={() => setPushedScreen('breathing')} />;
  }
  if (pushedScreen === 'breathing') {
    return <BreathingExerciseScreen onBack={() => setPushedScreen('mood')} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.body}>
        {activeTab === 'dashboard' && (
          <DashboardScreen profile={profile} userId={userId} onNavigate={setPushedScreen} belt={belt} />
        )}
        {activeTab === 'trends' && <TrendsScreen readingHistory={readingHistory} />}
        {activeTab === 'tips' && <EducationScreen />}
        {activeTab === 'family' && (
          <FamilyModeScreen profile={profile} todayKicks={todayKicks} belt={belt} onBack={() => setActiveTab('dashboard')} />
        )}
        {activeTab === 'settings' && (
          <SettingsScreen
            profile={profile}
            userId={userId}
            onProfileUpdated={onProfileUpdated}
            onBack={() => setActiveTab('dashboard')}
            onSignOut={onSignOut}
          />
        )}
      </View>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1 },
});
