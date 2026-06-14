import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';

type EmergencyContact = { name: string; phone: string; relationship: string; email: string };
const EMPTY: EmergencyContact = { name: '', phone: '', relationship: '', email: '' };

export default function EmergencyContacts() {
  const [contact, setContact] = useState<EmergencyContact>({ ...EMPTY });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EmergencyContact>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiRequest<any>('/users/me', { method: 'GET' })
      .then((user) => {
        if (user.emergencyContact?.name) {
          setContact(user.emergencyContact);
        }
      })
      .catch(() => setError('Failed to load emergency contact'));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await apiRequest('/users/me/emergency-contact', {
        method: 'PATCH',
        body: JSON.stringify({ emergencyContact: draft }),
      });
      setContact({ ...draft });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Failed to save emergency contact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-medium">Emergency Contacts</h1>
        <p className="text-slate-400 text-sm">Notified automatically when your risk score exceeds 75</p>
      </div>

      <div className="bg-red-950 border border-red-800 rounded-xl p-4 flex gap-3">
        <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
        <p className="text-sm text-red-300 leading-relaxed">
          When your risk score reaches <strong>75 or above</strong>, your emergency contact is automatically notified by email. Make sure this information is accurate.
        </p>
      </div>

      {saved && (
        <div className="bg-green-950 border border-green-800 rounded-xl p-3 text-sm text-green-300">Contact saved ✓</div>
      )}
      {error && (
        <div className="bg-red-950 border border-red-800 rounded-xl p-3 text-sm text-red-300">{error}</div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Primary emergency contact</p>
          {!editing && (
            <button
              onClick={() => { setDraft({ ...contact }); setEditing(true); }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              {contact.name ? 'Edit' : 'Add'}
            </button>
          )}
        </div>

        {editing ? (
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
            <input
              className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
              placeholder="Email address (used for risk alerts)"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
            />
            <input
              className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
              placeholder="Relationship (e.g. Parent, Sibling)"
              value={draft.relationship}
              onChange={(e) => setDraft((d) => ({ ...d, relationship: e.target.value }))}
            />
            <div className="flex gap-2 justify-end pt-1">
              <button onClick={() => setEditing(false)} className="text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !draft.name.trim() || !draft.phone.trim()}
                className="text-xs bg-red-800 hover:bg-red-700 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : contact.name ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{contact.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{contact.relationship}</p>
              <p className="text-xs text-slate-500 mt-0.5">{contact.phone}</p>
              <p className="text-xs text-slate-500 mt-0.5">{contact.email || 'No email set'}</p>
            </div>

            <a href={`tel:${contact.phone}`}
              className="bg-red-900 hover:bg-red-800 text-red-300 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            >
              📞 Call now
            </a>
          </div>
        ) : (
          <p className="text-sm text-slate-600 italic">No emergency contact set</p>
        )}
      </div>
    </div>
  );
}
