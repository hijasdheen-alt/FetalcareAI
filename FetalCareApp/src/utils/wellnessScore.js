const MOOD_SCORE = { happy: 100, calm: 85, anxious: 45, stressed: 30 };

export function computeWellnessScore({ todayKicks, sevenDayAvgKicks, last7Moods, todayCheckInFlags }) {
  // Movement component (0-100)
  let movementScore = 70;
  if (sevenDayAvgKicks > 0) {
    const ratio = todayKicks / sevenDayAvgKicks;
    movementScore = Math.max(0, Math.min(100, ratio * 80));
  }

  // Mood component (0-100), average of recent logged moods
  const loggedMoods = last7Moods.filter((m) => m.mood);
  const moodScore = loggedMoods.length
    ? loggedMoods.reduce((sum, m) => sum + (MOOD_SCORE[m.mood] || 60), 0) / loggedMoods.length
    : 70;

  // Check-in component: any flagged symptom lowers the score
  const flagCount = todayCheckInFlags ? Object.values(todayCheckInFlags).filter(Boolean).length : 0;
  const checkInScore = Math.max(0, 100 - flagCount * 25);

  const overall = Math.round(movementScore * 0.4 + moodScore * 0.35 + checkInScore * 0.25);

  let label = 'Doing well';
  if (overall < 50) label = 'Worth checking in on yourself today';
  else if (overall < 70) label = 'Steady, with some room to rest';

  return { overall, movementScore: Math.round(movementScore), moodScore: Math.round(moodScore), checkInScore, label };
}

export function getMovementTrendInsight(todayKicks, sevenDayAvgKicks) {
  if (sevenDayAvgKicks <= 0) return 'Keep logging kicks daily to start seeing your movement trend.';
  const ratio = todayKicks / sevenDayAvgKicks;
  if (ratio < 0.7) return 'Today\'s movement is noticeably lower than your recent average. Consider a kick-count session and contact your doctor if it stays low.';
  if (ratio > 1.3) return 'Baby seems extra active today compared to your recent average.';
  return 'Movement today is consistent with your recent pattern.';
}

export function getMoodTrendInsight(last7Moods) {
  const concerning = last7Moods.filter((m) => m.mood === 'anxious' || m.mood === 'stressed').length;
  if (concerning >= 3) {
    return 'You\'ve logged a few tougher days this week. Breathing exercises or talking to someone you trust may help.';
  }
  const logged = last7Moods.filter((m) => m.mood).length;
  if (logged === 0) return 'Log your mood daily to see gentle trends here.';
  return 'Your mood has been fairly steady this week.';
}
