import AsyncStorage from '@react-native-async-storage/async-storage';

const CONTACTS_KEY = 'fetalcare_family_contacts';

export async function loadContacts() {
  const raw = await AsyncStorage.getItem(CONTACTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveContacts(contacts) {
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}
