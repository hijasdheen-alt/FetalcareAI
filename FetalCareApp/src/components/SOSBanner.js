import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SOSBanner({ visible }) {
  if (!visible) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>🚨 SOS ALERT — Emergency contact notified with live location</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});
