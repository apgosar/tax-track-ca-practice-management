import { useState } from 'react';
import useAppStore from '../store/appStore';
import { RefreshCw, Save, Database, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

export default function Settings() {
  const sheetUrl = useAppStore((s) => s.sheetUrl);
  const setSheetUrl = useAppStore((s) => s.setSheetUrl);
  const syncSheet = useAppStore((s) => s.syncSheet);
  const isSyncing = useAppStore((s) => s.isSyncing);
  const syncError = useAppStore((s) => s.syncError);
  const lastSynced = useAppStore((s) => s.lastSynced);
  const staff = useAppStore((s) => s.staff);
  const flagThresholds = useAppStore((s) => s.flagThresholds);
  const setFlagThreshold = useAppStore((s) => s.setFlagThreshold);

  const [localUrl, setLocalUrl] = useState(sheetUrl);
  const [saved, setSaved] = useState(false);

  function saveUrl() {
    setSheetUrl(localUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const lastSyncedStr = lastSynced
    ? new Date(lastSynced).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Never';

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure data source, staff, and detection thresholds</p>
      </div>

      {/* Google Sheet sync */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-brand-blue" />
          <h2 className="text-sm font-semibold text-slate-700">Google Sheet Data Source</h2>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1.5">Sheet CSV Export URL</label>
          <input
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            value={localUrl}
            onChange={(e) => setLocalUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Make sure the sheet is publicly accessible or "anyone with link can view"
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              saved ? 'bg-green-600 text-white' : 'bg-brand-blue text-white hover:bg-blue-700'
            )}
            onClick={saveUrl}
          >
            {saved ? <><CheckCircle size={13} /> Saved!</> : <><Save size={13} /> Save URL</>}
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            onClick={syncSheet}
            disabled={isSyncing}
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing…' : 'Sync Now'}
          </button>
          <span className="text-xs text-slate-400 font-mono">Last sync: {lastSyncedStr}</span>
        </div>

        {syncError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            <strong>Sync error:</strong> {syncError}
          </div>
        )}

        <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 font-mono">
          Sheet ID: 1M1mdMB4nKuRL5g3MAZaDDwwdWdaSjJjq_OApA2S5g7w
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2">Expected Column Mapping</p>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-500 font-mono">
            {[['A', 'Sr. No.'], ['B', 'File No.'], ['C', 'Name of Client'], ['D', 'Group'], ['E', 'In Charge'], ['F', 'Transfer'], ['G', 'PAN'], ['H', 'DOB'], ['I', 'Ack Password'], ['J', 'Login Password'], ['K', 'Status ★'], ['L', 'Date'], ['M', 'Remarks']].map(([col, field]) => (
              <div key={col} className="flex gap-2">
                <span className="text-slate-400">{col}:</span>
                <span>{field}</span>
              </div>
            ))}
          </div>
        </div>
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
