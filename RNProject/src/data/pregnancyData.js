// Simple, general-knowledge week-by-week size comparisons and milestones.
// Not medical advice - for informational/motivational display only.

export const PREGNANCY_WEEKS = [
  { week: 4, size: 'a poppy seed', note: 'The earliest structures of the baby are just forming.' },
  { week: 6, size: 'a lentil', note: 'A tiny heartbeat may be detectable.' },
  { week: 8, size: 'a raspberry', note: 'Basic facial features are forming.' },
  { week: 10, size: 'a strawberry', note: 'Vital organs are developing rapidly.' },
  { week: 12, size: 'a lime', note: 'Reflexes are starting to develop.' },
  { week: 14, size: 'a lemon', note: 'The baby may start making facial expressions.' },
  { week: 16, size: 'an avocado', note: 'Movement may begin - you might not feel it yet.' },
  { week: 18, size: 'a bell pepper', note: 'Many mothers start feeling first flutters of movement.' },
  { week: 20, size: 'a banana', note: 'Halfway there! Anatomy scans commonly happen around now.' },
  { week: 22, size: 'a papaya', note: 'The baby\'s senses are becoming more developed.' },
  { week: 24, size: 'an ear of corn', note: 'Viability milestone - lungs are developing rapidly.' },
  { week: 26, size: 'a scallion bunch', note: 'Eyes are starting to open.' },
  { week: 28, size: 'a large eggplant', note: 'Third trimester begins. Kick counting becomes important.' },
  { week: 30, size: 'a cabbage', note: 'The baby is gaining weight steadily.' },
  { week: 32, size: 'a jicama', note: 'Bones are hardening, though the skull stays soft.' },
  { week: 34, size: 'a cantaloupe', note: 'The baby\'s systems are maturing for life outside the womb.' },
  { week: 36, size: 'a head of romaine lettuce', note: 'The baby is likely settling into a head-down position.' },
  { week: 38, size: 'a pumpkin (small)', note: 'Considered full-term soon - your body is preparing for birth.' },
  { week: 40, size: 'a small watermelon', note: 'Full term! Your due date has arrived.' },
];

// Find the closest week entry at or before the given week number
export function getPregnancyInfoForWeek(weekNumber) {
  let closest = PREGNANCY_WEEKS[0];
  for (const entry of PREGNANCY_WEEKS) {
    if (entry.week <= weekNumber) {
      closest = entry;
    } else {
      break;
    }
  }
  return closest;
}

export function calculateCurrentWeek(dueDateString) {
  if (!dueDateString) return null;

  const dueDate = new Date(dueDateString);
  if (isNaN(dueDate.getTime())) return null;

  // Standard pregnancy length is 40 weeks from LMP; we estimate LMP as 40 weeks before due date
  const lmpDate = new Date(dueDate);
  lmpDate.setDate(lmpDate.getDate() - 280); // 40 weeks * 7 days

  const now = new Date();
  const diffMs = now - lmpDate;
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));

  if (diffWeeks < 1) return 1;
  if (diffWeeks > 42) return 42;
  return diffWeeks;
}
