import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';

type ContactField = { name: string; phone: string; email?: string };
type Network = { sponsor: ContactField; therapist: ContactField; trustedFriend: ContactField };

const EMPTY: ContactField = { name: '', phone: '', email: '' };

const ROLES = [
  { key: 'sponsor',       label: 'Sponsor',        color: 'bg-purple-950 text-purple-300', desc: 'Your AA/NA sponsor' },
  { key: 'therapist',     label: 'Therapist',      color: 'bg-teal-950 text-teal-300',     desc: 'Your counsellor or therapist' },
  { key: 'trustedFriend', label: 'Trusted Friend', color: 'bg-amber-950 text-amber-300',   desc: 'Someone you trust' },
] as const;

type RoleKey = typeof ROLES[number]['key'];

export default function SupportNetwork() {
  const [network, setNetwork] = useState<Network>({
    sponsor: { ...EMPTY },
    therapist: { ...EMPTY },
    trustedFriend: { ...EMPTY },
  });
  const [editing, setEditing] = useState<RoleKey | null>(null);
  const [draft, setDraft] = useState<ContactField>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiRequest<any>('/users/me', { method: 'GET' })
      .then((user) => {
        setNetwork({
          sponsor:       user.sponsor       ?? { ...EMPTY },
          therapist:     user.therapist     ?? { ...EMPTY },
          trustedFriend: user.trustedFriend ?? { ...EMPTY },
        });
      })
      .catch(() => setError('Failed to load contacts'));
  }, []);

  const startEdit = (key: RoleKey) => {
    setEditing(key);
    setDraft({ ...network[key] });
  };

  const saveContact = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await apiRequest('/users/me/support', {
        method: 'PATCH',
        body: JSON.stringify({ [editing]: draft }),
      });
      setNetwork((prev) => ({ ...prev, [editing]: { ...draft } }));
      setEditing(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Failed to save contact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-medium">Support Network</h1>
        <p className="text-slate-400 text-sm">The people in your corner</p>
      </div>

      {saved && (
        <div className="bg-green-950 border border-green-800 rounded-xl p-3 text-sm text-green-300">
          Contact saved ✓
        </div>
      )}
      {error && (
        <div className="bg-red-950 border border-red-800 rounded-xl p-3 text-sm text-red-300">{error}</div>
      )}

      <div className="space-y-3">
        {ROLES.map((role) => {
          const contact = network[role.key];
          const isEditing = editing === role.key;
          return (
            <div key={role.key} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${role.color}`}>{role.label}</span>
                  <span className="text-xs text-slate-500">{role.desc}</span>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => startEdit(role.key)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {contact.name ? 'Edit' : 'Add'}
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <input
                    className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                    placeholder="Full name"
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  />
                  <input
                    className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                    placeholder="Phone number"
                    value={draft.phone}
                    onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                  />
                  {role.key === 'sponsor' && (
                    <input
                      className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                      placeholder="Email address (used for risk alerts)"
                      value={draft.email ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                    />
                  )}
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => setEditing(null)}
                      className="text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveContact}
                      disabled={saving || !draft.name.trim()}
                      className="text-xs bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : contact.name ? (
                <div>
                  <p className="text-sm font-medium text-white">{contact.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{contact.phone || 'No phone set'}</p>
                  {role.key === 'sponsor' && (
                    <p className="text-xs text-slate-500 mt-0.5">{contact.email || 'No email set'}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-600 italic">Not set</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
