// Central place to edit your device/contact settings.
// In a production app, move these into a Settings screen backed by AsyncStorage
// so the user can edit them without touching code.

export const CONFIG = {
  ESP32_DEFAULT_IP: '192.168.1.42', // update to match your ESP32's IP
  POLL_INTERVAL_MS: 2000,
  EMERGENCY_CONTACT_NUMBER: '9999999999', // replace with real number
  HEART_RATE_MIN: 60,
  HEART_RATE_MAX: 120,
};
