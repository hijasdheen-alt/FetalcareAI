import AsyncStorage from '@react-native-async-storage/async-storage';

const READING_HISTORY_KEY = 'fetalcare_reading_history';
const MOOD_LOG_KEY = 'fetalcare_mood_log';

const MAX_STORED_READINGS = 500;
const MAX_STORED_MOODS = 200;

export async function loadReadingHistory() {
  const raw = await AsyncStorage.getItem(READING_HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveReadingHistory(history) {
  const trimmed = history.slice(0, MAX_STORED_READINGS);
  await AsyncStorage.setItem(READING_HISTORY_KEY, JSON.stringify(trimmed));
}

export async function loadMoodLog() {
  const raw = await AsyncStorage.getItem(MOOD_LOG_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveMoodLog(log) {
  const trimmed = log.slice(0, MAX_STORED_MOODS);
  await AsyncStorage.setItem(MOOD_LOG_KEY, JSON.stringify(trimmed));
}

export async function clearAllHistory() {
  await AsyncStorage.multiRemove([READING_HISTORY_KEY, MOOD_LOG_KEY]);
}
