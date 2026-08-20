// Design tokens - single source of truth for the app's visual identity.
// Palette: subtle blush pink - soft rose, warm cream-pink surfaces, a muted
// sage for balance. Gentle and calm, never loud or saturated.

export const palette = {
  blush50: '#FFF8FA',
  blush100: '#FDEEF3',
  blush200: '#FBE1EA',
  rose300: '#F3B8CB',
  rose400: '#EA9BB6',
  rose500: '#DD7E9E',
  rose600: '#C15F80',
  rose800: '#8B3E58',
  plum900: '#3B2530',
  gold: '#D9AE5C',
  sage: '#8AA692',
  sage_light: '#DCEBE1',
  ink: '#3B2530',
  white: '#FFFFFF',
  gray: '#96828C',
  grayLight: '#F0DDE4',
};

const lightTheme = {
  bg: palette.blush50,
  bgAlt: palette.blush100,
  surface: palette.white,
  surfaceAlt: palette.blush100,
  text: palette.plum900,
  textMuted: palette.gray,
  border: palette.blush200,
  primary: palette.rose500,
  primaryDark: palette.rose600,
  accent: palette.rose400,
  accentAlt: palette.sage,
  danger: '#D97B8E',
  dangerBg: '#FBE3E8',
  success: palette.sage,
  successBg: palette.sage_light,
  cardShadow: 'rgba(139,62,88,0.10)',
};

const darkTheme = {
  bg: '#2B1B22',
  bgAlt: '#33212A',
  surface: '#3C2830',
  surfaceAlt: '#45303B',
  text: '#F8EAEE',
  textMuted: '#C6A5AF',
  border: '#4C3540',
  primary: palette.rose300,
  primaryDark: '#C17E93',
  accent: palette.rose400,
  accentAlt: '#A0CDB4',
  danger: '#EFA6B1',
  dangerBg: '#4B2C34',
  success: '#A6D8BE',
  successBg: '#32463C',
  cardShadow: 'rgba(0,0,0,0.35)',
};

export const themes = { light: lightTheme, dark: darkTheme };

// Shared mood-tracker colors, pulled from the same blush palette so they
// stay consistent wherever moods are rendered (MoodScreen, MoodMiniChart).
export const moodColors = {
  happy: palette.gold,
  calm: palette.sage,
  anxious: palette.rose400,
  stressed: palette.rose600,
};

export const type = {
  display: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  h1: { fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
  h2: { fontSize: 18, fontWeight: '700' },
  h3: { fontSize: 15, fontWeight: '700' },
  body: { fontSize: 14, fontWeight: '400' },
  bodyBold: { fontSize: 14, fontWeight: '600' },
  caption: { fontSize: 12, fontWeight: '500' },
  micro: { fontSize: 10, fontWeight: '600', letterSpacing: 0.4 },
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 };

export const shadow = (color) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 16,
  elevation: 4,
});
