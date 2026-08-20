const TIPS = [
  { minWeek: 1, text: 'Start a prenatal vitamin routine if you haven\'t already - talk to your doctor about the right one for you.' },
  { minWeek: 1, text: 'Small sips of water throughout the day add up - keep a bottle nearby.' },
  { minWeek: 6, text: 'Morning nausea can ease with small, frequent snacks rather than large meals.' },
  { minWeek: 10, text: 'Gentle stretching in the morning can help with early pregnancy stiffness.' },
  { minWeek: 14, text: 'Your energy may be returning - a short daily walk can boost mood and circulation.' },
  { minWeek: 18, text: 'You may start feeling your baby\'s first movements - flutters, not quite kicks yet.' },
  { minWeek: 20, text: 'Halfway there. This is a great time to schedule your anatomy scan if you haven\'t.' },
  { minWeek: 24, text: 'Try sleeping on your left side to support healthy circulation to your baby.' },
  { minWeek: 28, text: 'Start paying closer attention to your baby\'s movement patterns each day.' },
  { minWeek: 30, text: 'Iron-rich foods like spinach and lentils support your increasing blood volume.' },
  { minWeek: 32, text: 'Practice slow, deep breathing - it\'s useful both now and during labor.' },
  { minWeek: 34, text: 'Pack your hospital bag essentials a little early for peace of mind.' },
  { minWeek: 36, text: 'Rest when you can - your body is doing enormous work right now.' },
  { minWeek: 38, text: 'Stay close to your support network as your due date approaches.' },
];

export function getDailyTip(weekNumber) {
  const eligible = TIPS.filter((t) => t.minWeek <= (weekNumber || 1));
  const pool = eligible.length ? eligible : TIPS;

  // Rotate deterministically based on the day, so it's stable for the whole day
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const tip = pool[dayIndex % pool.length];
  return tip.text;
}
