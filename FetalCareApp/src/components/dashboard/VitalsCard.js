import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { type, space, radius, shadow } from '../../theme/tokens';
import Icon from '../Icon';

export default function VitalsCard({ connected, heartRate, fingerDetected, alert }) {
  const { colors } = useTheme();
  const danger = fingerDetected && heartRate > 0 && (heartRate < 60 || heartRate > 120);

  return (
    <View style={[styles.card, { backgroundColor: danger ? colors.dangerBg : colors.surface }, shadow(colors.cardShadow)]}>
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: colors.danger + '22' }]}>
          <Icon name="heart" size={18} color={colors.danger} />
        </View>
        <View style={{ marginLeft: space.sm, flex: 1 }}>
          <Text style={[type.caption, { color: colors.textMuted }]}>BELT HEART RATE</Text>
          <Text style={[type.h1, { color: danger ? colors.danger : colors.text }]}>
            {fingerDetected ? `${heartRate} BPM` : '--'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: connected ? colors.success : colors.danger }]} />
          <Text style={[type.micro, { color: colors.textMuted, marginTop: 2 }]}>
            {connected ? 'Connected' : 'Offline'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg, marginTop: space.lg },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  statusRow: { alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
