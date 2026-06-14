const riskKeywords = [
  'relapse', 'sad', 'stressed', 'bad', 'tired',
  'weary', 'alcohol', 'drink', 'crave', 'craving',
  'struggling', 'anxious', 'depressed', 'hopeless',
];

export function calculateMoodRisk(moods: string[]) {
  if (!moods?.length) return 20;

  const last7 = moods.slice(-7);
  let score = 0;

  for (const mood of last7) {
    const m = mood.toLowerCase();

    if (['sad', 'stressed', 'angry', 'anxious'].includes(m)) {
      score += 10;
    } else if (m === 'neutral') {
      score += 5;
    } else if (m === 'happy') {
      score -= 5;
    }
  }

  return Math.min(100, Math.max(0, score));
}

export function calculateMeetingRisk(meetings: any[]) {
  if (!meetings?.length) return 30;

  const attended = meetings.filter(m => m.attended).length;
  const ratio = attended / meetings.length;

  if (ratio >= 0.8) return 5;
  if (ratio >= 0.5) return 20;
  if (ratio >= 0.3) return 40;

  return 60;
}

export function calculateJournalRisk(journals: any[]) {
  if (!journals?.length) return 20;

  const last5 = journals.slice(-5);
  let score = 0;

  for (const j of last5) {
    const text = (j.text || '').toLowerCase();

    if (riskKeywords.some(word => text.includes(word))) {
      score += 10;
    }
  }

  return Math.min(100, score);
}

export function combineRisk({
  moodRisk,
  meetingRisk,
  journalRisk,
}: {
  moodRisk: number;
  meetingRisk: number;
  journalRisk: number;
}) {
  return Math.round(
    moodRisk * 0.4 +
    meetingRisk * 0.3 +
    journalRisk * 0.3,
  );
}

export function getRiskLevel(score: number) {
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  return 'high';
}
