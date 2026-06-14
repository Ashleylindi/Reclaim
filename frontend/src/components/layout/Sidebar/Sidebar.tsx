import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-sm transition ${
      isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
    }`;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4">
      {/* BRAND */}
      <h1 className="text-xl font-bold mb-6">Reclaim</h1>

      {/* NAV */}
      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/journal" className={linkClass}>
          📓 Journal
        </NavLink>

        <NavLink to="/mood" className={linkClass}>
          😊 Mood Tracker
        </NavLink>

        <NavLink to="/meetings" className={linkClass}>
          🤝 Meetings
        </NavLink>

        <hr className="border-slate-700 my-4" />

        <NavLink to="/ai" className={linkClass}>
          🤖 AI Insights
        </NavLink>

        <NavLink to="/risk" className={linkClass}>
          ⚠ Risk Analysis
        </NavLink>

        <hr className="border-slate-700 my-4" />

        <NavLink to="/support" className={linkClass}>
          🧍 Support Network
        </NavLink>

        <NavLink to="/emergency" className={linkClass}>
          🚨 Emergency Contacts
        </NavLink>

        <NavLink to="/notifications" className={linkClass}>
          🔔 Notifications
        </NavLink>
      </nav>
    </aside>
  );
}
