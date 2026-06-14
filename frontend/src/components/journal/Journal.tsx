import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';

type JournalEntry = {
  _id: string;
  date: string;
  text: string;
  mood?: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<JournalEntry[]>('/journal')
      .then(setEntries)
      .catch(() => setError('Failed to load journal entries'))
      .finally(() => setLoading(false));
  }, []);

  const addEntry = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const newEntry = await apiRequest<JournalEntry>('/journal', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      setEntries((prev) => [newEntry, ...prev]);
      setText('');
    } catch {
      setError('Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addEntry();
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-medium">Journal</h1>
        <p className="text-slate-400 text-sm">Record your thoughts and reflections</p>
      </div>

      {/* INPUT */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <textarea
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-slate-500 min-h-[100px]"
          placeholder="Write your thoughts..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Ctrl+Enter to save</span>
          <button
            onClick={addEntry}
            disabled={saving || !text.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-950 border border-red-800 rounded-xl p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* LIST */}
      {loading ? (
        <p className="text-slate-400 text-sm">Loading entries...</p>
      ) : entries.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400 text-sm">No entries yet — write your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{formatDate(entry.date)}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{entry.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
