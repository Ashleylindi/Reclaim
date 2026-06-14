import { useEffect, useState, type SetStateAction } from 'react';
import { dashboardService } from '../../../services/dashboard.service';

export function formatStreak(days: number): string {
  if (days < 90) {
    return `${days} ${days === 1 ? "day" : "days"}`;
  }

  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? "month" : "months"}`;
  }

  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);

  const yearText = `${years} ${years === 1 ? "year" : "years"}`;

  if (months === 0) {
    return yearText;
  }

  return `${yearText} ${months} ${months === 1 ? "month" : "months"}`;
}

export default function Topbar() {
  const [streak, setStreak] = useState<number | null>(null);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    dashboardService.getDashboard().then((data: { streak: { daysSober: SetStateAction<number | null>; }; user: { name: SetStateAction<string>; }; }) => {
      setStreak(data.streak.daysSober);
      setName(data.user.name);
    });
  }, []);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
      {/* LEFT */}
      <div className="text-lg text-slate-400">Hey, {name} 👋</div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 text-sm">
        {streak !== null && (
          <div className="flex items-center gap-1.5 bg-green-950 border border-green-900 text-green-400 text-xs font-medium px-3 py-1 rounded-full">
            🔥 {formatStreak(streak)}
          </div>
        )}

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          title="Logout"
          className="w-8 h-8 rounded-full bg-slate-700 hover:bg-red-900 border border-slate-600 hover:border-red-700 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}
