export function calculateDaysSober(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();

  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.max(
    0,
    Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  );

  return diffDays >= 0 ? diffDays : 0;
}

export function getStreakStatus(days: number): 'stable' | 'risky' | 'improving' {
  if (days >= 30) return 'stable';
  if (days >= 7) return 'improving';
  return 'risky';
}

export function getMoodTrend(moods: string[]): 'improving' | 'declining' | 'stable' {
  if (!moods || moods.length === 0) return 'stable';

  const last7 = moods.slice(-7);

  const happy = last7.filter(m => m.toLowerCase() === 'happy').length;
  const negative = last7.filter(m =>
    ['sad', 'stressed', 'angry', 'anxious'].includes(m.toLowerCase())
  ).length;

  if (happy >= 4) return 'improving';
  if (negative >= 4) return 'declining';

  return 'stable';
}
