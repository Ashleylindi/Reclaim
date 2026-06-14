export const MOODS = {
  HAPPY: 'happy',
  SAD: 'sad',
  ANXIOUS: 'anxious',
  CALM: 'calm',
  MOTIVATED: 'motivated',
  STRESSED: 'stressed',
} as const;

export type MoodType = typeof MOODS[keyof typeof MOODS];
