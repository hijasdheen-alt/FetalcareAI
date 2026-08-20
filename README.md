FetalCare AI is a React Native mobile application designed to support pregnant women throughout their pregnancy journey. It combines IoT hardware integration (ESP32 wearable belt) with a thoughtfully designed mobile interface to provide real-time health monitoring, fetal movement tracking, mood & wellness scoring, daily safety check-ins, guided breathing exercises, and a family view — all running fully offline with on-device storage.

IMPORTANT

This is a local-first app — no cloud backend, no user accounts. All data (kicks, moods, check-ins, profile) is stored on-device using AsyncStorage. The app previously supported Supabase but has been refactored to be entirely self-contained.

Tech Stack
Layer	Technology
Framework	React Native (CLI, not Expo)
Language	JavaScript (JSX)
Storage	@react-native-async-storage/async-storage
IoT	ESP32 microcontroller (HTTP polling over Wi-Fi)
SMS	react-native-sms-android (Android-only, for SOS alerts)
Location	@react-native-community/geolocation
Platforms	Android & iOS
Theme	Custom design system with light/dark mode (blush-rose-sage palette)
Architecture
No profile
Has profile
Push navigation
Push navigation
Push navigation
Push navigation
HTTP poll
SOS trigger
App.js (Entry)
ThemeProvider
AppInner
PregnancySetupScreen
MainApp
BottomTabBar Navigation
DashboardScreen
TrendsScreen
EducationScreen
FamilyModeScreen
SettingsScreen
MovementTrackerScreen
CheckInScreen
MoodScreen
BreathingExerciseScreen
useEsp32 Hook
ESP32 Belt Hardware
sosHandler → SMS + Location
Core Features
1. 🩺 Pregnancy Tracking (Week-by-Week)
File: 
pregnancyData.js
Calculates the current pregnancy week from the user's due date (40-week standard from LMP)
Displays week-by-week baby size comparisons (e.g., "a raspberry" at week 8, "a banana" at week 20)
Shows developmental milestone notes for each stage
Identifies trimester (1st / 2nd / 3rd)
2. 👶 Fetal Movement (Kick) Tracking
File: 
MovementTrackerScreen.js
Large animated tap button with pulse ring animation for logging kicks
Timed kick-counting sessions with elapsed timer
Today's count vs 7-day rolling average comparison
14-day trend chart (custom SimpleLineChart component)
Low-movement alert banner — triggers when today's count drops below 70% of the 7-day average
Kicks from the ESP32 belt (piezo sensors + MPU6050 accelerometer) are automatically synced into the same local log, preventing double-counting
3. 💓 ESP32 Wearable Belt Integration
Files: 
useEsp32.js
, 
useBeltData.js
, 
config.js
Connects to an ESP32 microcontroller over Wi-Fi HTTP polling (every 2 seconds)
Reads real-time data:
Heart rate (pulse sensor with finger detection)
Kick count (piezo + MPU6050 sensors)
Movement level
SOS button state
Dashboard shows a Vitals Card with live heart rate and connection status
Belt IP is configurable during setup or in Settings
4. 🚨 SOS Emergency Alert System
File: 
sosHandler.js
Triggered by the physical SOS button on the ESP32 belt
Automatically:
Requests GPS location (high accuracy)
Constructs a Google Maps link with live coordinates
Sends an automatic SMS to the configured emergency contact
Falls back to sending without location if GPS fails
60-second cooldown to prevent spam from repeated polling cycles
Android-only (uses react-native-sms-android)
5. 😊 Mood Tracking & Analysis
File: 
MoodScreen.js
Four mood states: Happy, Calm, Anxious, Stressed
Color-coded with the app's palette (gold, sage, rose, deep rose)
Last 7 days mood history displayed via 
MoodMiniChart
 on the dashboard
Mood insight on dashboard: alerts if 3+ anxious/stressed days in the past week
6. ✅ Daily Safety Check-In
File: 
CheckInScreen.js
Daily symptom checklist with five warning signs:
Headache
Bleeding
Swelling
Vision changes
Reduced movement
Flagged symptoms reduce the wellness score and surface proactive guidance
7. 📊 Wellness Score Engine
File: 
wellnessScore.js
Composite score (0–100) calculated from three weighted components:
Movement (40%): Today's kicks vs 7-day average
Mood (35%): Weighted average of recent mood entries
Check-in (25%): Penalty per flagged symptom (-25 each)
Labels: "Doing well" / "Steady, with some room to rest" / "Worth checking in on yourself today"
AI-generated movement insight and mood insight text displayed on dashboard
8. 🧘 Guided Breathing Exercises
File: 
BreathingExerciseScreen.js
4-4-6 breathing pattern (Breathe In → Hold → Breathe Out)
Animated expanding/contracting circle synchronized with breathing phases
Accessible from the Mood screen for stress relief
9. 👨‍👩‍👧 Family Mode
File: 
FamilyModeScreen.js
Read-only view designed for family members / partners
Shows:
Current pregnancy week + developmental milestone
Nutrition tip for the day
Today's kick count
Live heart rate from belt (if connected)
Preview mode — live multi-person sharing not yet enabled
10. 📚 Education & Tips Hub
File: 
EducationScreen.js
Curated pregnancy education content organized by category
Custom hand-drawn icon set (no emoji)
Daily tips rotate based on current pregnancy week (
dailyTips.js
)
11. 📈 Trends Screen
File: 
TrendsScreen.js
Historical view of kick counts over the last 14 days
Custom chart components: 
SimpleLineChart
 and 
SimpleBarChart
Design System
Theme Architecture
File: 
tokens.js
, 
ThemeContext.js
Light/dark mode with automatic system detection
Palette: Soft blush pink / rose / plum / sage — warm, calming, and non-clinical
Design tokens for typography, spacing, border radii, and shadows
Consistent mood colors across all screens
Motion & Animation
File: 
Motion.js
FadeSlideIn — staggered entrance animations for cards
AnimatedPress — spring-based tap feedback
PulseRing — breathing pulse effect on the kick button
useBumpAnim — bounce animation on counter updates
Custom Icon Set
File: 
Icon.js
 (9.7 KB)
Full custom hand-drawn SVG icon set — no emoji anywhere in the app
Icons: home, trend, bulb, family, settings, heart, kick, clock, alert, back, leaf, lotus, moon, and more
Data Layer
On-Device Storage
File: 
dataService.js
All data persisted via AsyncStorage with JSON serialization
Three data stores:
fetalcare_kicks — individual kick events with timestamps
fetalcare_moods — mood entries (happy/calm/anxious/stressed)
fetalcare_checkins — daily symptom check-in flags
Profile Management
File: 
profileStore.js
Local user profile: name, due date, ESP32 IP, emergency contact
"Reset Profile" clears all data and returns to setup
Database Schema (Legacy)
File: 
supabase_schema.sql
 — preserved for reference
Tables: profiles, kicks, moods, checkins with row-level security
Navigation Structure

App (root)
├── PregnancySetupScreen (first-time setup)
└── MainApp
    ├── BottomTabBar (5 tabs)
    │   ├── 🏠 Dashboard — overview of everything
    │   ├── 📈 Trends — kick count charts
    │   ├── 💡 Tips — education content
    │   ├── 👨‍👩‍👧 Family — read-only partner view
    │   └── ⚙️ Settings — profile, ESP32 config, theme, reset
    └── Push Screens (stack-like, from Dashboard quick actions)
        ├── Movement Tracker — tap-to-log kick sessions
        ├── Check-In — daily symptom checklist
        ├── Mood — log current mood
        └── Breathing Exercise — guided 4-4-6 breathing
Project Structure

FetalCareApp/
├── App.js                          # Entry point, profile check, theme provider
├── SETUP_INSTRUCTIONS.md           # Developer setup guide
├── supabase_schema.sql             # Legacy database schema
└── src/
    ├── MainApp.js                  # Tab navigation + push screen routing
    ├── config.js                   # ESP32 IP, poll interval, emergency contact
    ├── components/
    │   ├── BottomTabBar.js         # Animated bottom navigation
    │   ├── Icon.js                 # Custom SVG icon library
    │   ├── Motion.js               # Animation primitives
    │   ├── SimpleLineChart.js      # Custom line chart (no deps)
    │   ├── SimpleBarChart.js       # Custom bar chart (no deps)
    │   └── dashboard/
    │       ├── WeekBabyCard.js     # Pregnancy week display
    │       ├── MovementSummaryCard.js
    │       ├── MoodMiniChart.js    # 7-day mood dots
    │       ├── VitalsCard.js       # ESP32 heart rate card
    │       └── DailyTipCard.js     # Tip of the day + quick actions
    ├── screens/
    │   ├── DashboardScreen.js      # Main dashboard
    │   ├── MovementTrackerScreen.js # Kick counter
    │   ├── MoodScreen.js           # Mood logging
    │   ├── CheckInScreen.js        # Daily safety check-in
    │   ├── BreathingExerciseScreen.js # Guided breathing
    │   ├── TrendsScreen.js         # Historical charts
    │   ├── EducationScreen.js      # Tips & wellness content
    │   ├── FamilyModeScreen.js     # Partner/family view
    │   ├── SettingsScreen.js       # App settings & profile
    │   └── PregnancySetupScreen.js # First-time onboarding
    ├── lib/
    │   ├── dataService.js          # CRUD for kicks, moods, check-ins
    │   ├── profileStore.js         # Profile read/write
    │   ├── useEsp32.js             # ESP32 polling hook
    │   └── supabaseClient.js       # Legacy (unused)
    ├── data/
    │   ├── pregnancyData.js        # Week-by-week milestones
    │   ├── dailyTips.js            # Rotating pregnancy tips
    │   └── educationData.js        # Education content categories
    ├── hooks/
    │   └── useBeltData.js          # Alternative belt data hook
    ├── theme/
    │   ├── tokens.js               # Colors, typography, spacing
    │   └── ThemeContext.js          # Light/dark theme provider
    └── utils/
        ├── sosHandler.js           # SOS SMS + GPS alert
        ├── wellnessScore.js        # Composite wellness scoring
        ├── permissions.js          # Android permission requests
        └── reportGenerator.js      # Health report generation
Key Design Decisions
Offline-first: No internet required for core functionality — everything runs on-device
No emoji: Entire app uses a custom hand-drawn icon set for visual consistency
IoT-integrated: Real ESP32 hardware integration for medical-grade(ish) monitoring
Gentle UX: Soft blush/rose palette, staggered animations, non-alarming language
Privacy-first: No accounts, no cloud sync, no tracking — data stays on the device
Dual kick source: Manual taps and belt-detected kicks merge into one unified log
How to Run
bash

# Install dependencies
cd RNProject
npm install
# Run on Android
npx react-native run-android
# (Optional) Install native SMS + location for SOS feature
npm install react-native-sms-android @react-native-community/geolocation
NOTE

The RNProject/ directory contains the full React Native scaffold (android/, ios/, package.json), while FetalCareApp/ contains the refined app source code. Copy the FetalCareApp/ source files into RNProject/ to run.
