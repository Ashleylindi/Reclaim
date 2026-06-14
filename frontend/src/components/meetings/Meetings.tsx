import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';

type Meeting = {
  _id: string;
  title: string;
  date: string;
  location?: string;
  attended: boolean;
  createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    weekday: 'short', year: 'numeric',
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function isUpcoming(iso: string) {
  return new Date(iso) > new Date();
}

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    apiRequest<Meeting[]>('/meetings')
      .then(setMeetings)
      .catch(() => setError('Failed to load meetings'))
      .finally(() => setLoading(false));
  }, []);

  const addMeeting = async () => {
    if (!title.trim() || !date) return;
    setSaving(true);
    try {
      const newMeeting = await apiRequest<Meeting>('/meetings', {
        method: 'POST',
        body: JSON.stringify({ title, date, location: location || undefined }),
      });
      setMeetings((prev) => [...prev, newMeeting].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
      setTitle(''); setDate(''); setLocation('');
      setShowForm(false);
    } catch {
      setError('Failed to add meeting');
    } finally {
      setSaving(false);
    }
  };

  const markAttended = async (id: string) => {
    try {
      await apiRequest(`/meetings/${id}/attended`, { method: 'PATCH' });
      setMeetings((prev) =>
        prev.map((m) => m._id === id ? { ...m, attended: true } : m)
      );
    } catch {
      setError('Failed to mark as attended');
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      await apiRequest(`/meetings/${id}`, { method: 'DELETE' });
      setMeetings((prev) => prev.filter((m) => m._id !== id));
    } catch {
      setError('Failed to delete meeting');
    }
  };

  const attended = meetings.filter((m) => m.attended).length;
  const total = meetings.length;
  const attendanceRate = total > 0 ? Math.round((attended / total) * 100) : 0;

  const upcoming = meetings.filter((m) => !m.attended && isUpcoming(m.date));
  const past = meetings.filter((m) => m.attended || !isUpcoming(m.date));

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-medium">Meetings</h1>
          <p className="text-slate-400 text-sm">Track your support group attendance</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Meeting'}
        </button>
      </div>

      {/* STATS */}
      {total > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total scheduled', value: total },
            { label: 'Attended', value: attended },
            { label: 'Attendance rate', value: `${attendanceRate}%` },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-1">{s.label}</p>
              <p className="text-2xl font-medium">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ADD FORM */}
      {showForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <input
            className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
            placeholder="Meeting title (e.g. NA Monday Group)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="datetime-local"
            className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-slate-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={addMeeting}
              disabled={!title.trim() || !date || saving}
              className="bg-purple-700 hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Meeting'}
            </button>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-950 border border-red-800 rounded-xl p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* LISTS */}
      {loading ? (
        <p className="text-slate-400 text-sm">Loading meetings...</p>
      ) : total === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400 text-sm">No meetings scheduled yet — add one above.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-2">Upcoming</p>
              <div className="space-y-2">
                {upcoming.map((m) => (
                  <div key={m._id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{m.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(m.date)}</p>
                      {m.location && <p className="text-xs text-slate-500 mt-0.5">📍 {m.location}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => markAttended(m._id)}
                        className="text-xs bg-green-950 hover:bg-green-900 text-green-300 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Mark attended
                      </button>
                      <button
                        onClick={() => deleteMeeting(m._id)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-2">Past</p>
              <div className="space-y-2">
                {past.map((m) => (
                  <div key={m._id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 opacity-70">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{m.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(m.date)}</p>
                      {m.location && <p className="text-xs text-slate-500 mt-0.5">📍 {m.location}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {m.attended
                        ? <span className="text-xs bg-green-950 text-green-300 px-3 py-1.5 rounded-lg">Attended ✓</span>
                        : <span className="text-xs bg-slate-800 text-slate-500 px-3 py-1.5 rounded-lg">Missed</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
