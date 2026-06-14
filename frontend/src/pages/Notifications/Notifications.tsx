import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';

type Notification = {
  _id: string;
  type: 'sponsor' | 'emergency';
  score: number;
  recipientName: string;
  sentAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<Notification[]>('/notifications')
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-medium">Notifications</h1>
        <p className="text-slate-400 text-sm">Alerts sent to your support network</p>
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm">Loading...</p>
      ) : notifications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400 text-sm">No alerts have been sent yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`bg-slate-900 border rounded-xl p-5 flex items-start justify-between gap-4 ${
                n.type === 'emergency'
                  ? 'border-red-800'
                  : 'border-amber-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {n.type === 'emergency' ? '🚨 Emergency Contact Alerted' : '⚠️ Sponsor Alerted'}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      n.type === 'emergency'
                        ? 'bg-red-950 text-red-300'
                        : 'bg-amber-950 text-amber-300'
                    }`}
                  >
                    Score: {n.score}
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  Notified <span className="text-slate-300">{n.recipientName}</span>
                </p>
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap">
                {formatDate(n.sentAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
