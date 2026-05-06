import { useState, useMemo } from 'react';
import useAppStore from '../store/appStore';
import useFlags from '../hooks/useFlags';
import ClientTable from '../components/ClientTable';
import EmptyState from '../components/EmptyState';
import { STATUSES } from '../data/constants';
import { Search, Download, X } from 'lucide-react';
import Papa from 'papaparse';

function exportCSV(clients) {
  const rows = clients.map((c) => ({
    'Sr': c.sr,
    'File No.': c.fileNo,
    'Name': c.name,
    'Group': c.group,
    'In Charge': c.inCharge,
    'PAN': c.pan,
    'DOB': c.dob,
    'Status': c.status,
    'Last Contact Date': c.date,
    'Remarks': c.remarks,
  }));
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taxtrack-clients-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Clients() {
  const clients = useAppStore((s) => s.clients);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [group, setGroup] = useState('');
  const [inCharge, setInCharge] = useState('');

  const allFlags = useFlags();

  const groups = useMemo(() => [...new Set(clients.map((c) => c.group).filter(Boolean))].sort(), [clients]);
  const staffList = useMemo(() => [...new Set(clients.map((c) => c.inCharge).filter(Boolean))].sort(), [clients]);

  const filtered = useMemo(() => {
    let r = clients;
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.pan.toLowerCase().includes(q) ||
        c.fileNo.toLowerCase().includes(q)
      );
    }
    if (status) r = r.filter((c) => c.status === status);
    if (group) r = r.filter((c) => c.group === group);
    if (inCharge) r = r.filter((c) => c.inCharge === inCharge);
    return r;
  }, [clients, search, status, group, inCharge]);

  const hasFilters = search || status || group || inCharge;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink">Clients</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} of {clients.length} clients</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          onClick={() => exportCSV(filtered)}
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              placeholder="Search name, PAN, file no…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            <option value="">All Groups</option>
            {groups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <select
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white"
            value={inCharge}
            onChange={(e) => setInCharge(e.target.value)}
          >
            <option value="">All Staff</option>
            {staffList.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {hasFilters && (
            <button
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg"
              onClick={() => { setSearch(''); setStatus(''); setGroup(''); setInCharge(''); }}
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState title="No clients match your filters" sub="Try adjusting the search or filter criteria" />
      ) : (
        <ClientTable clients={filtered} />
      )}
    </div>
  );
}
