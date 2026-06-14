import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { apiRequest } from '../../services/api';
import { formatStreak } from '../../components/layout/Topbar/Topbar';

function riskColors(level: string) {
  if (level === 'high') return { pill: 'bg-red-950 text-red-300', bar: 'bg-red-500', dot: 'bg-red-400' };
  if (level === 'medium') return { pill: 'bg-amber-950 text-amber-300', bar: 'bg-amber-500', dot: 'bg-amber-400' };
  return { pill: 'bg-green-950 text-green-300', bar: 'bg-green-500', dot: 'bg-green-400' };
}

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newDate, setNewDate] = useState('');


  useEffect(() => {
    dashboardService.getDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400 p-6">Loading dashboard...</p>;
  if (!data) return <p className="text-red-400 p-6">Failed to load dashboard</p>;

  const { streak, relapse, aiInsights } = data;
  const colors = riskColors(relapse.riskLevel);
  const barWidth = Math.min(relapse.riskScore, 100);
  const hasAlert = relapse.alert?.level !== 'low';

  const saveDate = async () => {
    await apiRequest('/users/me/sober-date', {
      method: 'PATCH',
      body: JSON.stringify({ startDate: new Date(newDate).toISOString() }),
    });
    window.location.reload();
  };

  function nextMilestone(days: number) {
    const milestones = [7, 30, 60, 90, 180, 365, 730, 1095, 1460, 1825];
    return milestones.find(m => m > days) ?? (Math.ceil(days / 365) + 1) * 365;
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <p className="text-slate-400 text-sm">Your recovery overview and AI insights</p>
      </div>

      {/* STREAK */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Current streak</span>
          <div>
            <span className="text-5xl font-medium text-white">{formatStreak(streak.daysSober)}</span>
          </div>
          {editing ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="date"
                value={newDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setNewDate(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-2 py-1 focus:outline-none"
              />
              <button onClick={saveDate} className="text-xs bg-green-800 text-green-200 px-2 py-1 rounded-lg">Save</button>
              <button onClick={() => setEditing(false)} className="text-xs text-slate-500">Cancel</button>
            </div>
          ) : (
            <span
              className="text-sm text-slate-500 mt-1 cursor-pointer hover:text-slate-300 transition-colors"
              onClick={() => { setNewDate(streak.startDate?.split('T')[0] ?? ''); setEditing(true); }}
            >
              {streak.daysSober === 0
                ? 'Tap to set your sobriety date'
                : `Started ${new Date(streak.startDate).toLocaleDateString()}`}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="bg-green-950 text-green-300 text-xs font-medium px-3 py-1 rounded-lg flex items-center gap-1">
            🔥 Keep going
          </span>
          <span className="text-xs text-slate-500">
            Next milestone: {formatStreak(nextMilestone(streak.daysSober))}
          </span>
        </div>
      </div>

      {/* RISK + INSIGHT GRID */}
      <div className="grid grid-cols-2 gap-4">
        {/* RISK */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">Relapse risk</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-medium">{relapse.riskScore}</span>
            <span className="text-sm text-slate-500">/ 100</span>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${colors.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            {relapse.riskLevel.charAt(0).toUpperCase() + relapse.riskLevel.slice(1)} risk
          </span>
          <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${barWidth}%` }} />
          </div>
        </div>

        {/* AI INSIGHT */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">AI insight</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🧠</span>
            <span className="bg-purple-950 text-purple-300 text-xs font-medium px-2.5 py-1 rounded-lg">
              Stable
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {aiInsights?.summary || 'No insight available'}
          </p>
        </div>
      </div>

      {/* ALERT — only shown when risk is not low */}
      {hasAlert && (
        <div className="bg-red-950 border border-red-800 rounded-xl p-4 flex gap-3">
          <span className="text-red-400 text-base mt-0.5">⚠</span>
          <p className="text-sm text-red-300 leading-relaxed">{relapse.alert.message}</p>
        </div>
      )}
    </div>
  );
}
