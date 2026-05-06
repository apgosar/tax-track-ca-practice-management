import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, FolderOpen, FileText, Settings, AlertTriangle, RefreshCw
} from 'lucide-react';
import useFlags from '../hooks/useFlags';
import useAppStore from '../store/appStore';
import clsx from 'clsx';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/staff', label: 'Staff', icon: Users },
  { to: '/groups', label: 'Groups', icon: FolderOpen },
  { to: '/clients', label: 'Clients', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function Badge({ count, severity }) {
  if (!count) return null;
  const cls = severity === 'critical' ? 'bg-brand-red' : 'bg-brand-amber';
  return (
    <span className={clsx('ml-auto text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center', cls)}>
      {count > 99 ? '99+' : count}
    </span>
  );
}

export default function Sidebar({ open, onClose }) {
  const flags = useFlags();
  const isSyncing = useAppStore((s) => s.isSyncing);
  const syncSheet = useAppStore((s) => s.syncSheet);
  const lastSynced = useAppStore((s) => s.lastSynced);

  const critical = flags.filter((f) => f.severity === 'critical').length;
  const warnings = flags.filter((f) => f.severity === 'warning').length;
  const totalFlags = flags.length;

  const syncedAt = lastSynced
    ? new Date(lastSynced).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-[220px] bg-ink flex flex-col z-30 transition-transform duration-200',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">TT</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">TaxTrack</p>
              <p className="text-slate-400 text-xs mt-0.5">CA Practice Suite</p>
            </div>
          </div>
        </div>

        {/* Flag summary pill */}
        {totalFlags > 0 && (
          <div className="mx-4 mt-4 bg-red-900/30 border border-red-800/40 rounded-lg px-3 py-2 flex items-center gap-2">
            <AlertTriangle size={13} className="text-brand-red flex-shrink-0" />
            <span className="text-xs text-red-300 font-medium flex-1">
              {critical} critical · {warnings} warnings
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )
              }
              onClick={onClose}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {label === 'Dashboard' && <Badge count={critical} severity="critical" />}
            </NavLink>
          ))}
        </nav>

        {/* Sync footer */}
        <div className="border-t border-white/10 px-4 py-3">
          <button
            className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-xs font-medium transition-colors"
            onClick={syncSheet}
            disabled={isSyncing}
          >
            <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing…' : 'Sync Sheet'}
          </button>
          {syncedAt && (
            <p className="text-slate-600 text-xs mt-1 font-mono">Last: {syncedAt}</p>
          )}
        </div>
      </aside>
    </>
  );
}
