import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';
import useFlags from '../hooks/useFlags';
import StatusBadge from '../components/StatusBadge';
import FlagCard from '../components/FlagCard';
import EmptyState from '../components/EmptyState';
import { detectFlags } from '../utils/flagEngine';
import {
  ArrowLeft, FileText, AlertTriangle, CheckSquare, Calculator, MessageSquare,
  Send, PlusCircle, Clock
} from 'lucide-react';
import clsx from 'clsx';

function daysSince(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  return Math.floor((Date.now() - dt.getTime()) / 86400000);
}

// --- Overview Tab ---
function OverviewTab({ client, flags }) {
  const ds = daysSince(client.date);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'File No.', value: client.fileNo, mono: true },
          { label: 'PAN', value: client.pan, mono: true },
          { label: 'Group', value: client.group },
          { label: 'In Charge', value: client.inCharge },
          { label: 'Date of Birth', value: client.dob || '—', mono: true },
          { label: 'Last Contact', value: client.date || '—', mono: true },
          { label: 'Days Since Contact', value: ds !== null ? `${ds} days` : '—', mono: true },
          { label: 'Open Flags', value: flags.length, mono: true },
        ].map((item) => (
          <div key={item.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-xs text-slate-400 font-medium">{item.label}</p>
            <p className={clsx('text-sm font-semibold text-slate-800 mt-0.5', item.mono && 'font-mono')}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
      {client.remarks && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
          <p className="text-xs font-semibold text-amber-700 mb-1">Remarks from Sheet</p>
          <p className="text-sm text-amber-800">{client.remarks}</p>
        </div>
      )}
    </div>
  );
}

// --- Checklist Tab ---
const ITR_DOCS = {
  'ITR-1': ['Form 16', 'Bank Statement', 'Savings Certificate', 'Aadhar/PAN copy'],
  'ITR-2': ['Form 16', 'Bank Statement', 'Capital Gain Statement', 'Foreign Income details', 'Aadhar/PAN copy'],
  'ITR-3': ['Form 16', 'P&L Statement', 'Balance Sheet', 'Bank Statement', 'GST Returns', 'Aadhar/PAN copy'],
  'ITR-4': ['Presumptive Income Declaration', 'Bank Statement', 'Aadhar/PAN copy'],
};

function ChecklistTab({ clientId }) {
  const [itrType, setItrType] = useState('ITR-1');
  const [checked, setChecked] = useState({});

  const docs = ITR_DOCS[itrType] || [];

  function toggle(doc) {
    setChecked((s) => ({ ...s, [doc]: !s[doc] }));
  }

  const done = docs.filter((d) => checked[d]).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm font-semibold text-slate-600">ITR Type:</label>
        {Object.keys(ITR_DOCS).map((type) => (
          <button
            key={type}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors',
              itrType === type
                ? 'bg-brand-blue text-white border-brand-blue'
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-blue'
            )}
            onClick={() => setItrType(type)}
          >
            {type}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 font-mono">{done}/{docs.length} received</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-50">
        {docs.map((doc) => (
          <label
            key={doc}
            className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-brand-blue"
              checked={!!checked[doc]}
              onChange={() => toggle(doc)}
            />
            <span className={clsx('text-sm', checked[doc] ? 'line-through text-slate-400' : 'text-slate-700')}>
              {doc}
            </span>
            {checked[doc] && (
              <span className="ml-auto text-xs text-green-600 font-semibold">Received</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

// --- Data Entry Tab ---
function DataEntryTab() {
  const [regime, setRegime] = useState('new');
  const [income, setIncome] = useState({ salary: '', interest: '', capitalGain: '', rental: '', other: '' });
  const [deductions, setDeductions] = useState({ sec80c: '', sec80d: '', hra: '', nps: '', other: '' });

  function num(v) { return parseFloat(v) || 0; }

  const grossIncome = num(income.salary) + num(income.interest) + num(income.capitalGain) + num(income.rental) + num(income.other);
  const totalDeductions = regime === 'old' ? num(deductions.sec80c) + num(deductions.sec80d) + num(deductions.hra) + num(deductions.nps) + num(deductions.other) : 75000; // standard deduction new regime
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  function tax(income, isNew) {
    if (isNew) {
      const slabs = [[300000, 0], [400000, 0.05], [300000, 0.1], [300000, 0.15], [300000, 0.2], [Infinity, 0.3]];
      let remaining = Math.max(0, income);
      let t = 0;
      for (const [limit, rate] of slabs) {
        const taxable = Math.min(remaining, limit);
        t += taxable * rate;
        remaining -= taxable;
        if (remaining <= 0) break;
      }
      return t;
    } else {
      const slabs = [[250000, 0], [250000, 0.05], [500000, 0.2], [Infinity, 0.3]];
      let remaining = Math.max(0, income);
      let t = 0;
      for (const [limit, rate] of slabs) {
        const taxable = Math.min(remaining, limit);
        t += taxable * rate;
        remaining -= taxable;
        if (remaining <= 0) break;
      }
      return t;
    }
  }

  const newTax = tax(Math.max(0, grossIncome - 75000), true);
  const oldTax = tax(taxableIncome, false);
  const currentTax = tax(regime === 'new' ? Math.max(0, grossIncome - 75000) : taxableIncome, regime === 'new');

  const fmt = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

  function inputField(label, stateKey, obj, setter) {
    return (
      <div key={stateKey}>
        <label className="text-xs font-medium text-slate-500 block mb-1">{label}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
          <input
            type="number"
            className="w-full pl-7 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            placeholder="0"
            value={obj[stateKey]}
            onChange={(e) => setter((s) => ({ ...s, [stateKey]: e.target.value }))}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-600">Tax Regime:</span>
        {['new', 'old'].map((r) => (
          <button
            key={r}
            className={clsx(
              'px-4 py-1.5 rounded-lg text-sm font-semibold border transition-colors capitalize',
              regime === r ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-blue'
            )}
            onClick={() => setRegime(r)}
          >
            {r} Regime
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">Income Sources</h3>
          {inputField('Salary / Pension', 'salary', income, setIncome)}
          {inputField('Interest Income', 'interest', income, setIncome)}
          {inputField('Capital Gains', 'capitalGain', income, setIncome)}
          {inputField('Rental Income', 'rental', income, setIncome)}
          {inputField('Other Income', 'other', income, setIncome)}
          <div className="border-t border-slate-100 pt-2">
            <p className="text-xs text-slate-500">Gross Total Income</p>
            <p className="text-xl font-bold text-ink font-mono">₹{fmt(grossIncome)}</p>
          </div>
        </div>

        <div className="space-y-5">
          {regime === 'old' && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">Deductions (Old Regime)</h3>
              {inputField('Sec 80C (max ₹1.5L)', 'sec80c', deductions, setDeductions)}
              {inputField('Sec 80D (Health Insurance)', 'sec80d', deductions, setDeductions)}
              {inputField('HRA Exemption', 'hra', deductions, setDeductions)}
              {inputField('NPS (80CCD)', 'nps', deductions, setDeductions)}
              {inputField('Other Deductions', 'other', deductions, setDeductions)}
            </div>
          )}

          {/* Comparison card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calculator size={14} className="text-brand-blue" />
              Regime Comparison
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className={clsx('bg-white rounded-lg p-3 border', regime === 'new' ? 'border-brand-blue' : 'border-slate-200')}>
                <p className="text-xs text-slate-500">New Regime</p>
                <p className="text-lg font-bold text-ink font-mono mt-0.5">₹{fmt(newTax)}</p>
                {newTax < oldTax && <p className="text-xs text-green-600 font-semibold mt-1">✓ Better</p>}
              </div>
              <div className={clsx('bg-white rounded-lg p-3 border', regime === 'old' ? 'border-brand-blue' : 'border-slate-200')}>
                <p className="text-xs text-slate-500">Old Regime</p>
                <p className="text-lg font-bold text-ink font-mono mt-0.5">₹{fmt(oldTax)}</p>
                {oldTax < newTax && <p className="text-xs text-green-600 font-semibold mt-1">✓ Better</p>}
              </div>
            </div>
            <div className="border-t border-blue-100 pt-2">
              <p className="text-xs text-slate-500">Tax under Selected Regime</p>
              <p className="text-2xl font-bold text-brand-blue font-mono">₹{fmt(currentTax)}</p>
              <p className="text-xs text-slate-400 mt-0.5">+ 4% Health & Education Cess = ₹{fmt(currentTax * 1.04)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Flags Tab ---
function FlagsTab({ client }) {
  const thresholds = useAppStore((s) => s.flagThresholds);
  const resolvedFlags = useAppStore((s) => s.resolvedFlags);
  const addManualFlag = useAppStore((s) => s.addManualFlag);
  const [showAdd, setShowAdd] = useState(false);
  const [newFlag, setNewFlag] = useState({ title: '', description: '', severity: 'warning' });

  const autoFlags = detectFlags(client, thresholds).filter((f) => !resolvedFlags.has(String(f.id)));
  const manualFlagsMap = useAppStore((s) => s.manualFlags);
  const manualFlags = (manualFlagsMap[client.id] || []).filter((f) => !resolvedFlags.has(String(f.id)));
  const allFlags = [...autoFlags, ...manualFlags];

  function submitFlag() {
    if (!newFlag.title.trim()) return;
    addManualFlag(client.id, { ...newFlag, clientId: client.id, clientName: client.name });
    setNewFlag({ title: '', description: '', severity: 'warning' });
    setShowAdd(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{allFlags.length} active flag{allFlags.length !== 1 ? 's' : ''}</p>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
          onClick={() => setShowAdd((s) => !s)}
        >
          <PlusCircle size={12} /> Raise Flag
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">Raise Manual Flag</h3>
          <input
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            placeholder="Flag title…"
            value={newFlag.title}
            onChange={(e) => setNewFlag((s) => ({ ...s, title: e.target.value }))}
          />
          <textarea
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 resize-none"
            placeholder="Description…"
            rows={2}
            value={newFlag.description}
            onChange={(e) => setNewFlag((s) => ({ ...s, description: e.target.value }))}
          />
          <div className="flex items-center gap-2">
            <select
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
              value={newFlag.severity}
              onChange={(e) => setNewFlag((s) => ({ ...s, severity: e.target.value }))}
            >
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
            <button className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-blue-700" onClick={submitFlag}>
              Add Flag
            </button>
            <button className="px-3 py-2 text-sm text-slate-500 hover:text-slate-800" onClick={() => setShowAdd(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {allFlags.length === 0 ? (
        <EmptyState title="No flags" sub="No auto-detected or manual flags for this client" />
      ) : (
        <div className="space-y-2">
          {allFlags.map((f) => <FlagCard key={f.id} flag={f} compact={false} />)}
        </div>
      )}
    </div>
  );
}

// --- Notes Tab ---
function NotesTab({ clientId }) {
  const notes = useAppStore((s) => s.notes[clientId] || []);
  const addNote = useAppStore((s) => s.addNote);
  const [text, setText] = useState('');

  function submit() {
    if (!text.trim()) return;
    addNote(clientId, text.trim());
    setText('');
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <textarea
          className="w-full text-sm border-0 outline-none resize-none text-slate-700 placeholder-slate-400"
          placeholder="Add a note or activity entry…"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit(); }}
        />
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400">Ctrl+Enter to post</span>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40"
            onClick={submit}
            disabled={!text.trim()}
          >
            <Send size={11} /> Post
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No notes yet" sub="Add internal notes or activity entries above" />
      ) : (
        <div className="space-y-3">
          {[...notes].reverse().map((n) => (
            <div key={n.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold">
                  {n.author?.[0] || 'C'}
                </span>
                <span className="text-xs font-semibold text-slate-700">{n.author || 'CA'}</span>
                <span className="text-xs text-slate-400 font-mono ml-auto">
                  {new Date(n.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{n.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Main ClientDetail ---
export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clients = useAppStore((s) => s.clients);
  const [tab, setTab] = useState('overview');

  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FileText size={40} className="text-slate-300 mb-3" />
        <p className="font-semibold text-slate-500">Client not found</p>
        <button className="mt-4 text-sm text-brand-blue font-medium" onClick={() => navigate('/clients')}>
          ← Back to Clients
        </button>
      </div>
    );
  }

  const thresholds = useAppStore((s) => s.flagThresholds);
  const resolvedFlags = useAppStore((s) => s.resolvedFlags);
  const autoFlags = detectFlags(client, thresholds).filter((f) => !resolvedFlags.has(String(f.id)));
  const manualFlagsMap = useAppStore((s) => s.manualFlags);
  const manualFlags = (manualFlagsMap[client.id] || []).filter((f) => !resolvedFlags.has(String(f.id)));
  const allFlags = [...autoFlags, ...manualFlags];

  const ds = daysSince(client.date);

  const TABS = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'dataentry', label: 'Data Entry', icon: Calculator },
    { id: 'flags', label: `Flags${allFlags.length ? ` (${allFlags.length})` : ''}`, icon: AlertTriangle },
    { id: 'notes', label: 'Notes & Activity', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium mb-4"
        >
          <ArrowLeft size={14} /> All Clients
        </button>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center text-white font-black text-lg flex-shrink-0">
              {client.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-ink">{client.name}</h1>
              <div className="flex items-center gap-3 flex-wrap mt-1">
                <span className="font-mono text-sm text-slate-500">{client.pan}</span>
                <span className="text-slate-300">·</span>
                <span className="text-sm text-slate-500">File: {client.fileNo}</span>
                <span className="text-slate-300">·</span>
                <span className="text-sm text-slate-500">{client.group}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={client.status} size="md" />
              {ds !== null && (
                <span className={clsx(
                  'flex items-center gap-1 text-xs font-mono font-semibold px-2 py-1 rounded-lg',
                  ds > 14 ? 'bg-red-50 text-brand-red' : ds > 7 ? 'bg-amber-50 text-brand-amber' : 'bg-slate-100 text-slate-500'
                )}>
                  <Clock size={11} /> {ds}d since contact
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-slate-200 overflow-x-auto">
        {TABS.map(({ id: tid, label, icon: Icon }) => (
          <button
            key={tid}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap -mb-px',
              tab === tid
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
            onClick={() => setTab(tid)}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="fade-in">
        {tab === 'overview' && <OverviewTab client={client} flags={allFlags} />}
        {tab === 'checklist' && <ChecklistTab clientId={client.id} />}
        {tab === 'dataentry' && <DataEntryTab />}
        {tab === 'flags' && <FlagsTab client={client} />}
        {tab === 'notes' && <NotesTab clientId={client.id} />}
      </div>
    </div>
  );
}
