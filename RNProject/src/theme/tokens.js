// Design tokens — Peach & Warm Earthy Sand theme (NO PURPLE, NO GREEN)
// Light: warm peach-cream background with soft terracotta and golden sand accents
// Dark:  deep dark chocolate-peach background with warm cream text and terracotta highlights

export const palette = {
  // Peach / Terracotta scale
  peach50:     '#FAF5F2',   // Warm cream with a peach undertone
  peach100:    '#FCEBE4',   // Light peach for setup & hero card background
  peach200:    '#F7D5C9',   // Soft peach border / divider
  peach300:    '#F0B39E',   // Muted peach text
  peach400:    '#E7957A',   // Medium peach accent
  peach500:    '#DE7B5C',   // Peach / Terracotta primary brand color
  peach600:    '#C16143',   // Deep peach primaryDark
  peach800:    '#4E2112',   // Dark terracotta for titles
  peach900:    '#2E1005',   // Very dark peach

  // Warm apricot / gold / sand colors (replaces green)
  gold:        '#E3B778',   // Apricot gold
  goldLight:   '#FDF2E2',   // Light gold background
  apricot:     '#E89C7C',   // Warm apricot accent
  rose:        '#D96E7E',   // Rose red for danger
  rose_light:  '#FADADF',

  // Neutral warm charcoal
  white:       '#FFFFFF',
  ink:         '#2E2724',   // Deep warm charcoal text
  inkSoft:     '#5C514C',   // Muted warm charcoal
  gray:        '#9C8E88',   // Muted warm gray
  grayLight:   '#EBE4E0',
};

// ── LIGHT THEME ───────────────────────────────────────────────
const lightTheme = {
  bg:          palette.peach50,       // Warm cream background
  bgAlt:       palette.peach100,      // Pale peach alternate background
  surface:     palette.white,         // White card background
  surfaceAlt:  palette.peach100,
  text:        palette.ink,           // Warm charcoal text
  textMuted:   palette.gray,
  border:      palette.peach200,      // Soft peach border
  primary:     palette.peach500,      // Peach brand primary
  primaryDark: palette.peach600,      // Deep peach/terracotta
  peach:       palette.peach100,      // Light peach setup/hero card background
  peachLight:  palette.peach200,
  accent:      palette.gold,
  accentAlt:   palette.apricot,       // Apricot accent (instead of green!)
  danger:      palette.rose,
  dangerBg:    palette.rose_light,
  success:     palette.gold,          // Gold for success (no green!)
  successBg:   palette.goldLight,
  cardShadow:  'rgba(78,33,18,0.06)',
};

// ── DARK THEME ────────────────────────────────────────────────
const darkTheme = {
  bg:          '#1F110B',             // Rich deep dark chocolate-peach background (no green!)
  bgAlt:       '#2B1810',
  surface:     '#3B2217',             // Warm dark terracotta cards
  surfaceAlt:  '#4E2F21',
  text:        '#FFEBE3',             // Soft warm cream text
  textMuted:   '#D9B4A7',             // Dusty peach-gray text
  border:      '#4E2F21',
  primary:     palette.peach300,
  primaryDark: palette.peach500,      // Consistent primaryDark
  peach:       '#3D201A',             // Dark terracotta peach setup/hero bg
  peachLight:  '#2E1410',
  accent:      palette.gold,
  accentAlt:   palette.apricot,
  danger:      '#FFA4B2',
  dangerBg:    '#4E1D24',
  success:     palette.gold,
  successBg:   '#3D2C1A',
  cardShadow:  'rgba(0,0,0,0.3)',
};

export const themes = { light: lightTheme, dark: darkTheme };

// Shared mood-tracker colors
export const moodColors = {
  happy: palette.gold,
  calm: palette.apricot,
  anxious: palette.peach400,
  stressed: palette.rose,
};

// ── TYPOGRAPHY ────────────────────────────────────────────────
export const type = {
  display:  { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  h1:       { fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
  h2:       { fontSize: 18, fontWeight: '700' },
  h3:       { fontSize: 15, fontWeight: '700' },
  body:     { fontSize: 14, fontWeight: '400' },
  bodyBold: { fontSize: 14, fontWeight: '600' },
  caption:  { fontSize: 12, fontWeight: '500' },
  micro:    { fontSize: 10, fontWeight: '600', letterSpacing: 0.4 },
};

export const space  = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 };

export const shadow = (color) => ({
  shadowColor:   color,
  shadowOffset:  { width: 0, height: 6 },
  shadowOpacity: 1,
  shadowRadius:  16,
  elevation:     4,
});
