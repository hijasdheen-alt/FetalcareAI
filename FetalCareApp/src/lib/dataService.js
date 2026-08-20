// Fully local, on-device data layer - replaces the old Supabase-backed
// dataService. Same exported function signatures as before, so every
// screen that imports from here (Dashboard, MovementTracker, Mood,
// CheckIn, MainApp, useEsp32) works unchanged.

import AsyncStorage from '@react-native-async-storage/async-storage';

const KICKS_KEY = 'fetalcare_kicks';
const MOODS_KEY = 'fetalcare_moods';
const CHECKINS_KEY = 'fetalcare_checkins';

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function makeId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

async function readList(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.log(`readList(${key}) error:`, err.message);
    return [];
  }
}

async function writeList(key, list) {
  await AsyncStorage.setItem(key, JSON.stringify(list));
}

// ---------------- KICKS ----------------
export async function logKick(userId) {
  const list = await readList(KICKS_KEY);
  list.push({ id: makeId(), user_id: userId, logged_at: new Date().toISOString() });
  await writeList(KICKS_KEY, list);
}

export async function getTodayKickCount(userId) {
  const list = await readList(KICKS_KEY);
  const since = startOfDay();
  return list.filter((k) => new Date(k.logged_at) >= since).length;
}

export async function getKickCountsForLastNDays(userId, n) {
  const list = await readList(KICKS_KEY);

  const buckets = {};
  for (let i = 0; i < n; i++) {
    const d = daysAgo(n - 1 - i);
    buckets[d.toDateString()] = 0;
  }

  const since = startOfDay(daysAgo(n - 1));
  list
    .filter((k) => new Date(k.logged_at) >= since)
    .forEach((k) => {
      const key = new Date(k.logged_at).toDateString();
      if (buckets[key] !== undefined) buckets[key]++;
    });

  return Object.entries(buckets).map(([date, count]) => ({ date, count }));
}

export async function getSevenDayAvgKicks(userId) {
  const days = await getKickCountsForLastNDays(userId, 7);
  const total = days.reduce((sum, d) => sum + d.count, 0);
  return total / 7;
}

// ---------------- MOODS ----------------
export async function logMood(userId, mood) {
  const list = await readList(MOODS_KEY);
  list.push({ id: makeId(), user_id: userId, mood, logged_at: new Date().toISOString() });
  await writeList(MOODS_KEY, list);
}

export async function getLast7DaysMoods(userId) {
  const list = await readList(MOODS_KEY);

  // One entry per day, latest mood logged that day
  const byDay = {};
  list.forEach((row) => {
    const key = new Date(row.logged_at).toDateString();
    if (!byDay[key] || new Date(row.logged_at) > new Date(byDay[key].logged_at)) {
      byDay[key] = row;
    }
  });

  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = daysAgo(i);
    const key = d.toDateString();
    result.push({ date: key, mood: byDay[key]?.mood || null });
  }
  return result;
}

// ---------------- CHECK-INS ----------------
export async function logCheckIn(userId, flags) {
  const list = await readList(CHECKINS_KEY);
  list.push({
    id: makeId(),
    user_id: userId,
    headache: !!flags.headache,
    bleeding: !!flags.bleeding,
    swelling: !!flags.swelling,
    vision_changes: !!flags.vision_changes,
    reduced_movement: !!flags.reduced_movement,
    logged_at: new Date().toISOString(),
  });
  await writeList(CHECKINS_KEY, list);
}

export async function getCheckInHistory(userId, limit = 20) {
  const list = await readList(CHECKINS_KEY);
  return [...list]
    .sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at))
    .slice(0, limit);
}

export async function getTodayCheckIn(userId) {
  const list = await readList(CHECKINS_KEY);
  const since = startOfDay();
  const todays = list
    .filter((c) => new Date(c.logged_at) >= since)
    .sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
  return todays[0] || null;
}
