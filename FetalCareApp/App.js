import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, ActivityIndicator, View } from 'react-native';
import PregnancySetupScreen from './src/screens/PregnancySetupScreen';
import MainApp from './src/MainApp';
import { getProfile, LOCAL_USER_ID } from './src/lib/profileStore';
import { requestAllPermissions } from './src/utils/permissions';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function AppInner() {
  const [profile, setProfile] = useState(null);
  const [checking, setChecking] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    (async () => {
      const stored = await getProfile();
      setProfile(stored);
      await requestAllPermissions();
      setChecking(false);
    })();
  }, []);

  if (checking) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  let content;
  if (!profile || !profile.due_date) {
    content = (
      <PregnancySetupScreen
        userId={LOCAL_USER_ID}
        onComplete={(p) => setProfile(p)}
      />
    );
  } else {
    content = (
      <MainApp
        profile={profile}
        userId={LOCAL_USER_ID}
        onProfileUpdated={setProfile}
        onSignOut={() => setProfile(null)}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.primaryDark }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      {content}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
