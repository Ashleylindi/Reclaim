import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';

type MoodEntry = {
  _id: string;
  date: string;
  mood: string;
};

const MOOD_OPTIONS = [
  { value: 'great',     label: 'Great',     emoji: '😄' },
  { value: 'good',      label: 'Good',      emoji: '🙂' },
  { value: 'neutral',   label: 'Neutral',   emoji: '😐' },
  { value: 'anxious',   label: 'Anxious',   emoji: '😰' },
  { value: 'sad',       label: 'Sad',       emoji: '😔' },
  { value: 'exhausted', label: 'Exhausted', emoji: '😩' },
  { value: 'angry',     label: 'Angry',     emoji: '😠' },
  { value: 'craving',   label: 'Craving',   emoji: '⚠️' },
] as const;

type MoodValue = typeof MOOD_OPTIONS[number]['value'];

function moodColors(mood: string) {
  const map: Record<string, string> = {
    great:     'bg-green-950 text-green-300',
    good:      'bg-teal-950 text-teal-300',
    neutral:   'bg-slate-800 text-slate-300',
    anxious:   'bg-amber-950 text-amber-300',
    sad:       'bg-blue-950 text-blue-300',
    exhausted: 'bg-purple-950 text-purple-300',
    angry:     'bg-red-950 text-red-300',
    craving:   'bg-orange-950 text-orange-300',
  };
  return map[mood] ?? 'bg-slate-800 text-slate-300';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function Mood() {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [selected, setSelected] = useState<MoodValue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<MoodEntry[]>('/mood')
      .then(setMoods)
      .catch(() => setError('Failed to load mood history'))
      .finally(() => setLoading(false));
  }, []);

  const logMood = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const newMood = await apiRequest<MoodEntry>('/mood', {
        method: 'POST',
        body: JSON.stringify({ mood: selected }),
      });
      setMoods((prev) => [newMood, ...prev]);
      setSelected(null);
    } catch {
      setError('Failed to save mood');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-medium">Mood Tracker</h1>
        <p className="text-slate-400 text-sm">How are you feeling today?</p>
      </div>

      {/* PICKER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {MOOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm font-medium transition-colors
                ${selected === opt.value
                  ? 'border-blue-500 bg-blue-950 text-blue-300'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                }`}
            >
              <span className="text-xl">{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={logMood}
            disabled={!selected || saving}
            className="bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Log Mood'}
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-950 border border-red-800 rounded-xl p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* HISTORY */}
      {loading ? (
        <p className="text-slate-400 text-sm">Loading mood history...</p>
      ) : moods.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400 text-sm">No mood logs yet — pick one above to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {moods.map((m) => {
            const opt = MOOD_OPTIONS.find((o) => o.value === m.mood);
            return (
              <div key={m._id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{opt?.emoji ?? '😐'}</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${moodColors(m.mood)}`}>
                    {opt?.label ?? m.mood}
                  </span>
                </div>
                <span className="text-xs text-slate-500">{formatDate(m.date)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
