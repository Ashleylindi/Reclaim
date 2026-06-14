import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import type { DashboardResponse } from '../../services/dashboard.service';

function riskColor(score: number) {
  if (score < 30) return { bar: 'bg-green-500', pill: 'bg-green-950 text-green-300' };
  if (score < 60) return { bar: 'bg-amber-500', pill: 'bg-amber-950 text-amber-300' };
  return { bar: 'bg-red-500', pill: 'bg-red-950 text-red-300' };
}

function ScoreBar({ label, score, weight }: { label: string; score: number; weight: string }) {
  const c = riskColor(score);
  return (
    <div className="flex items-center gap-3">
      <div className="w-36 flex-shrink-0">
        <p className="text-sm text-slate-300">{label}</p>
        <p className="text-xs text-slate-500">{weight} weight</p>
      </div>
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm text-slate-400 w-8 text-right">{score}</span>
    </div>
  );
}

export default function RiskAnalysis() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<DashboardResponse>('/ai/dashboard')
      .then(setData)
      .catch(() => setError('Failed to load risk data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400 text-sm">Loading risk analysis...</p>;
  if (error || !data) return <p className="text-red-400 text-sm">{error}</p>;

  const { relapse } = data;
  const breakdown = (relapse as any).breakdown;
  const c = riskColor(relapse.riskScore);
  const hasAlert = relapse.alert?.level !== 'low';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-medium">Risk Analysis</h1>
        <p className="text-slate-400 text-sm">Breakdown of your relapse risk score</p>
      </div>

      {/* OVERALL */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-1">Overall risk score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-medium">{relapse.riskScore}</span>
              <span className="text-slate-500 text-sm">/ 100</span>
            </div>
          </div>
          <span className={`text-xs font-medium px-3 py-1.5 rounded-lg capitalize ${c.pill}`}>
            {relapse.riskLevel} risk
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${relapse.riskScore}%` }} />
        </div>
      </div>

      {/* BREAKDOWN */}
      {breakdown && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Score breakdown</p>
          <ScoreBar label="Mood" score={breakdown.moodRisk} weight="40%" />
          <ScoreBar label="Meetings" score={breakdown.meetingRisk} weight="30%" />
          <ScoreBar label="Journal" score={breakdown.journalRisk} weight="30%" />
          <p className="text-xs text-slate-600 pt-2 border-t border-slate-800">
            Score = mood × 0.4 + meetings × 0.3 + journal × 0.3
          </p>
        </div>
      )}

      {/* ALERT THRESHOLDS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Alert thresholds</p>
        {[
          { range: '0 – 59', label: 'No action', style: 'bg-green-950 text-green-300' },
          { range: '60 – 74', label: 'Sponsor notified', style: 'bg-amber-950 text-amber-300' },
          { range: '75 – 100', label: 'Emergency contact notified', style: 'bg-red-950 text-red-300' },
        ].map((t) => (
          <div key={t.range} className="flex items-center justify-between">
            <span className="text-sm text-slate-400">{t.range}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${t.style}`}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* ACTIVE ALERT */}
      {hasAlert && (
        <div className="bg-red-950 border border-red-800 rounded-xl p-4 flex gap-3">
          <span className="text-red-400 mt-0.5">⚠</span>
          <p className="text-sm text-red-300 leading-relaxed">{relapse.alert.message}</p>
        </div>
      )}
    </div>
  );
}
