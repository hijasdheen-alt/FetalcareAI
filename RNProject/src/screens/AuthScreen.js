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
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../theme/ThemeContext';
import { type, space, radius, shadow } from '../theme/tokens';
import Icon from '../components/Icon';

export default function AuthScreen() {
  const { colors } = useTheme();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Info', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        Alert.alert('Check Your Email', 'Confirm your email to finish creating your account, then log in.');
        setMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        // Auth state listener in App.js handles navigation on success
      }
    } catch (err) {
      Alert.alert('Authentication Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.primaryDark }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.brandBlock}>
        <View style={[styles.logoCircle, { backgroundColor: colors.surface }]}>
          <Icon name="flower" size={30} color={colors.primary} />
        </View>
        <Text style={styles.brandTitle}>Bloom</Text>
        <Text style={styles.brandSubtitle}>Your pregnancy companion</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }, shadow(colors.cardShadow)]}>
        <View style={[styles.toggleRow, { backgroundColor: colors.bgAlt }]}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'login' && { backgroundColor: colors.surface }]}
            onPress={() => setMode('login')}
          >
            <Text style={[type.bodyBold, { color: mode === 'login' ? colors.primary : colors.textMuted }]}>
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'signup' && { backgroundColor: colors.surface }]}
            onPress={() => setMode('signup')}
          >
            <Text style={[type.bodyBold, { color: mode === 'signup' ? colors.primary : colors.textMuted }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[type.caption, { color: colors.textMuted, marginTop: space.lg, marginBottom: space.xs }]}>
          EMAIL
        </Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={[type.caption, { color: colors.textMuted, marginTop: space.md, marginBottom: space.xs }]}>
          PASSWORD
        </Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>{mode === 'login' ? 'Log In' : 'Create Account'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: space.xl },
  brandBlock: { alignItems: 'center', marginBottom: space.xxl },
  logoCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  brandTitle: { ...type.display, color: '#fff' },
  brandSubtitle: { ...type.body, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  card: { borderRadius: radius.xl, padding: space.xl },
  toggleRow: { flexDirection: 'row', borderRadius: radius.pill, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.pill, alignItems: 'center' },
  input: { borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: 12, fontSize: 14 },
  submitBtn: { borderRadius: radius.md, paddingVertical: 15, alignItems: 'center', marginTop: space.xl },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
