# Fetal Care App - Setup Instructions (Local, No Backend)

This version removes Supabase entirely. The app is now fully local and
native: your due date, kicks, moods, and check-ins are all saved on-device
with AsyncStorage - no account, no internet connection, no backend project
to configure. Visual theme is now soft floral lavender, and every screen
uses the custom hand-drawn icon set (no emoji anywhere in the app).

## 1. Install dependencies
```bash
npm install @react-native-async-storage/async-storage
```
This is pure JavaScript - no native rebuild required just for this.

(If you're using the ESP32 belt / SOS-SMS features, also install
react-native-sms-android and @react-native-community/geolocation - see the
"ESP32 Belt Integration" section below.)

## 2. Remove the old Supabase packages (if previously installed)
```bash
npm uninstall @supabase/supabase-js react-native-url-polyfill
```
These are no longer imported anywhere in the app.

## 3. Copy these NEW/UPDATED files into your project
- App.js  (no more login/session - goes straight to setup or dashboard)
- src/theme/tokens.js  (new lavender palette + shared mood colors)
- src/components/Icon.js  (added leaf / lotus / moon icons)
- src/lib/profileStore.js  (NEW - local on-device profile, replaces Supabase profiles table)
- src/lib/dataService.js  (rewritten - local AsyncStorage instead of Supabase, same function names)
- src/lib/useEsp32.js  (updated comments only, same behavior)
- src/screens/PregnancySetupScreen.js  (now the app's entry screen; saves locally)
- src/screens/SettingsScreen.js  (saves locally; "Sign Out" replaced with "Reset Profile")
- src/screens/TrendsScreen.js  (emoji titles replaced with icons)
- src/screens/EducationScreen.js  (emoji category icons replaced with custom icons)
- src/data/educationData.js  (emoji fields replaced with icon names)
- src/components/dashboard/MoodMiniChart.js  (mood colors now pulled from tokens.js)
- src/screens/MoodScreen.js  (mood colors now pulled from tokens.js)
- src/components/dashboard/WeekBabyCard.js  (updated accent color for lavender theme)

## 4. Files removed in this pass (delete if still present)
- src/lib/supabaseClient.js
- src/screens/AuthScreen.js
- supabase_schema.sql

## 5. Files still unused from earlier iterations (safe to delete or ignore)
These belonged to the very first local-only prototype, before the redesign:
- src/screens/LoginScreen.js
- src/screens/OnboardingScreen.js
- src/screens/HomeScreen.js
- src/screens/PregnancyTrackerScreen.js
- src/components/MoodTracker.js
- src/components/DashboardCard.js
- src/components/StatusHeader.js
- src/components/SOSBanner.js
- src/screens/FamilyScreen.js
- src/utils/storage.js
- src/utils/historyStorage.js
- src/utils/familyStorage.js
- src/utils/reportGenerator.js

These still contain emoji and old colors, but since nothing imports them,
they're never bundled or shown - they just take up space in the project.

## 6. Run it
No new native modules were added (AsyncStorage is pure JS if already
installed from before), so:
```bash
npx react-native run-android
```
should work without a clean rebuild.

## What changed for you as a user
- **No sign up / log in screen anymore.** First launch goes straight to a
  short setup screen (name, due date, emergency contact, optional ESP32
  belt IP), then straight into the Dashboard.
- All your data (kicks, moods, check-ins, due date) lives only on this
  device now. If you uninstall the app or use "Reset Profile" in Settings,
  that data is gone for good - there's no cloud backup.
- "Reset Profile" (in Settings, where "Sign Out" used to be) clears your
  due date and all logged data, and takes you back to the setup screen.
- Visual theme is now a soft floral lavender palette across every screen,
  including the setup/entry screen.
- The Tips & Wellness page and Trends page no longer use emoji - they use
  the same custom hand-drawn icon set as the rest of the app.

## ESP32 Belt Integration (unchanged)

The belt still works exactly as before, just syncing into local storage
instead of Supabase:

- Set your belt's IP during setup, or later in Settings ("ESP32 Belt IP")
- The Dashboard shows a live **Heart Rate / Belt Connected** card whenever an IP is set
- **Kicks detected by the belt (piezos + MPU6050) are automatically synced into the same
  local kicks log** as manual taps from the Movement Tracker - so your daily count,
  7-day average, and 14-day trend chart reflect both sources together, no double counting
- **The belt's physical SOS button still triggers the real automatic SMS + live location alert**
  (via `src/utils/sosHandler.js`, using `react-native-sms-android`) - this DOES require a
  native rebuild:
  ```bash
  npx react-native run-android
  ```
  If you skip this rebuild, the app will still run fine, but a physical SOS press won't be
  able to auto-send the SMS (the Settings page's "Emergency Alert" button remains a UI-only
  placeholder either way, per the original spec).
- Also install (if not already): `npm install react-native-sms-android @react-native-community/geolocation`
