import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import useAppStore from '../store/appStore';
import useFlags from '../hooks/useFlags';
import { staffStats } from '../utils/analytics';
import PipelineBar from '../components/PipelineBar';
import StatusBadge from '../components/StatusBadge';
import FlagCard from '../components/FlagCard';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import { STATUS_COLOR_HEX, STATUSES } from '../data/constants';
import { ArrowLeft, Search, Users } from 'lucide-react';
import clsx from 'clsx';

function daysSince(d) {
  if (!d) return 0;
  const dt = new Date(d);
  if (isNaN(dt)) return 0;
  return Math.floor((Date.now() - dt.getTime()) / 86400000);
}

// Individual staff workspace
function StaffWorkspace({ staffMember, onBack }) {
  const [tab, setTab] = useState('queue');
  const [search, setSearch] = useState('');
  const allFlags = useFlags(staffMember.clients);
  const flagCount = allFlags.length;

  const stalled = [...staffMember.clients]
    .map((c) => ({ ...c, ds: daysSince(c.date) }))
    .filter((c) => !['Closed', 'N.A.', 'Cancelled', 'Ack Recd', 'Uploaded'].includes(c.status))
    .sort((a, b) => b.ds - a.ds);

  const filtered = staffMember.clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.pan.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = useNavigate();

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium">
          <ArrowLeft size={14} /> All Staff
        </button>
        <div className="flex items-center gap-3">
          <Avatar name={staffMember.name} color={staffMember.color} size={10} />
          <div>
            <h1 className="text-xl font-bold text-ink">{staffMember.name}</h1>
            <p className="text-sm text-slate-500">{staffMember.total} clients · {staffMember.active} active</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {[
          { id: 'queue', label: `Task Queue (${stalled.length})` },
          { id: 'flags', label: `Flags (${flagCount})` },
          { id: 'clients', label: `All Clients (${staffMember.total})` },
        ].map((t) => (
          <button
            key={t.id}
            className={clsx(
              'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px',
              tab === t.id
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Queue tab */}
      {tab === 'queue' && (
        <div className="space-y-2">
          {stalled.length === 0 ? (
            <EmptyState title="No stalled cases" sub="All cases are up to date" />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">Client</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400">Days Stalled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stalled.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/clients/${c.id}`)}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-700">{c.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{c.pan}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-bold"
                        style={{ color: c.ds > 14 ? '#dc2626' : c.ds > 7 ? '#d97706' : '#64748b' }}>
                        {c.ds}d
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Flags tab */}
      {tab === 'flags' && (
        <div className="space-y-2">
          {allFlags.length === 0 ? (
            <EmptyState title="No flags" sub="This staff member has no open flags" />
          ) : (
            allFlags.map((f) => <FlagCard key={f.id} flag={f} />)
          )}
        </div>
      )}

      {/* All clients tab */}
      {tab === 'clients' && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              placeholder="Search by name or PAN…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filtered.length === 0 ? (
            <EmptyState title="No clients found" />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">PAN</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">Group</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/clients/${c.id}`)}>
                      <td className="px-4 py-3 font-semibold text-slate-700">{c.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.pan}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-slate-500">{c.group}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Staff() {
  const clients = useAppStore((s) => s.clients);
  const staff = useAppStore((s) => s.staff);
  const [selected, setSelected] = useState(null);

  const stats = staffStats(clients, staff);
  const allFlags = useFlags();

  if (selected) {
    const member = stats.find((s) => s.id === selected);
    if (member) return <StaffWorkspace staffMember={member} onBack={() => setSelected(null)} />;
  }

  // Comparison chart data
  const chartData = stats.map((s) => {
    const row = { name: s.name.split(' ')[0] };
    for (const status of STATUSES) {
      row[status] = s.byStatus[status] || 0;
    }
    return row;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Staff</h1>
        <p className="text-sm text-slate-500 mt-0.5">Team workload and performance</p>
      </div>

      {/* Staff cards */}
      {stats.length === 0 ? (
        <EmptyState icon={Users} title="No staff found" sub="Sync your Google Sheet to load staff data" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {stats.map((s) => {
            const memberFlags = allFlags.filter((f) => {
              const client = clients.find((c) => c.id === f.clientId);
              return client?.inCharge === s.name;
            });
            return (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
                onClick={() => setSelected(s.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: s.color }}
                  >
                    {s.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.total} clients · {s.active} active</p>
                  </div>
                  {memberFlags.length > 0 && (
                    <span className="flex-shrink-0 bg-red-100 text-brand-red text-xs font-bold px-2 py-0.5 rounded-full">
                      {memberFlags.length} flags
                    </span>
                  )}
                </div>
                <PipelineBar counts={s.byStatus} total={s.total} height={8} showLabels />
              </div>
            );
          })}
        </div>
      )}

      {/* Cross-staff comparison chart */}
      {stats.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Cross-Staff Comparison</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                {STATUSES.filter((s) => chartData.some((d) => d[s] > 0)).map((status) => (
                  <Bar key={status} dataKey={status} stackId="a" fill={STATUS_COLOR_HEX[status] || '#94a3b8'} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
