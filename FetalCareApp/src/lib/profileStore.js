// Fully local, on-device profile storage - no backend, no account system.
// This app runs standalone: one profile per device, saved with AsyncStorage.

import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = 'fetalcare_profile';

// Kept only so the rest of the app (screens, dataService) can keep passing
// a "userId" around unchanged - it's a fixed local id, not a real account.
export const LOCAL_USER_ID = 'local';

export async function getProfile() {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.log('getProfile error:', err.message);
    return null;
  }
}

export async function saveProfile(fields) {
  const toSave = { id: LOCAL_USER_ID, ...fields };
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(toSave));
  return toSave;
}

export async function updateProfile(patch) {
  const current = (await getProfile()) || { id: LOCAL_USER_ID };
  const updated = { ...current, ...patch };
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearProfile() {
  await AsyncStorage.removeItem(PROFILE_KEY);
}
