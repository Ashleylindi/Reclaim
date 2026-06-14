import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import type { DashboardResponse } from '../../services/dashboard.service';
import { formatStreak } from '../../components/layout/Topbar/Topbar';

export default function AiInsights() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<DashboardResponse>('/ai/dashboard')
      .then(setData)
      .catch(() => setError('Failed to load AI insights'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400 text-sm">Loading insights...</p>;
  if (error || !data) return <p className="text-red-400 text-sm">{error}</p>;

  const { streak, relapse, aiInsights } = data;

  const stats = [
    { label: 'Days sober', value: formatStreak(streak.daysSober), color: 'text-green-400' },
    { label: 'Risk score', value: `${relapse.riskScore} / 100`, color: 'text-white' },
    { label: 'Risk level', value: relapse.riskLevel, color: relapse.riskLevel === 'low' ? 'text-green-400' : relapse.riskLevel === 'medium' ? 'text-amber-400' : 'text-red-400' },
  ];

  const insights = [
    { label: 'Summary',      value: aiInsights?.summary },
    { label: 'Patterns',     value: aiInsights?.emotionPattern },
    { label: 'Advice',       value: (aiInsights as any)?.advice },
    { label: 'Encouragement', value: aiInsights?.encouragement },
  ].filter((i) => i.value);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-medium">AI Insights</h1>
        <p className="text-slate-400 text-sm">What the AI sees in your recovery data</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-medium capitalize ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* INSIGHTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">What the AI sees</p>
        <div className="divide-y divide-slate-800">
          {insights.map((ins) => (
            <div key={ins.label} className="py-4 first:pt-0 last:pb-0">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-1">{ins.label}</p>
              <p className="text-sm text-slate-300 leading-relaxed">{ins.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
