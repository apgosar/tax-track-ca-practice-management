import useAppStore from '../store/appStore';
import { Users, AlertTriangle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function Settings() {
  const staff = useAppStore((s) => s.staff);
  const flagThresholds = useAppStore((s) => s.flagThresholds);
  const setFlagThreshold = useAppStore((s) => s.setFlagThreshold);
  const syncSheet = useAppStore((s) => s.syncSheet);
  const isSyncing = useAppStore((s) => s.isSyncing);
  const lastSynced = useAppStore((s) => s.lastSynced);
  const syncError = useAppStore((s) => s.syncError);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure staff and detection thresholds</p>
      </div>

      {/* Sheet sync */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
        <div className="flex items-center gap-2">
          <RefreshCw size={16} className="text-brand-blue" />
          <h2 className="text-sm font-semibold text-slate-700">Google Sheet Sync</h2>
        </div>
        <p className="text-xs text-slate-400">
          Sheet ID: <span className="font-mono">{import.meta.env.VITE_SPREADSHEET_ID || '(not set)'}</span>
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={syncSheet}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing…' : 'Sync Now'}
          </button>
          {lastSynced && !syncError && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle size={13} />
              Last synced {new Date(lastSynced).toLocaleTimeString()}
            </span>
          )}
          {syncError && (
            <span className="flex items-center gap-1 text-xs text-red-600">
              <XCircle size={13} />
              {syncError}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">
          Your sheet must be shared as <strong>Anyone with the link → Viewer</strong>.
        </p>
      </div>

      {/* Flag thresholds */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-brand-amber" />
          <h2 className="text-sm font-semibold text-slate-700">Flag Detection Thresholds</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: 'stalledDays', label: 'Stalled call threshold (days)', description: 'Raise CRITICAL flag if call made but no response after N days' },
            { key: 'suspenseDays', label: 'Suspense pending threshold (days)', description: 'Raise WARNING if suspense informed but unresolved after N days' },
            { key: 'pendingYears', label: 'Old pending threshold (years)', description: 'Raise CRITICAL if details pending for N+ years' },
          ].map(({ key, label, description }) => (
            <div key={key}>
              <label className="text-xs font-medium text-slate-600 block mb-1">{label}</label>
              <p className="text-xs text-slate-400 mb-1.5">{description}</p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={365}
                  className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  value={flagThresholds[key]}
                  onChange={(e) => setFlagThreshold(key, parseInt(e.target.value) || 1)}
                />
                <span className="text-xs text-slate-400">{key.includes('Years') ? 'year(s)' : 'day(s)'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff roster */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-brand-teal" />
          <h2 className="text-sm font-semibold text-slate-700">Staff Roster</h2>
          <span className="ml-auto text-xs text-slate-400">Auto-populated from sheet</span>
        </div>
        {staff.length === 0 ? (
          <p className="text-sm text-slate-400">No staff loaded. Sync your sheet to populate.</p>
        ) : (
          <div className="space-y-2">
            {staff.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: s.color }}
                >
                  {s.initials}
                </div>
                <span className="text-sm font-medium text-slate-700">{s.name}</span>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-slate-400">Staff names are derived from the "In Charge" column (Column E) of your sheet.</p>
      </div>
    </div>
  );
}
