import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, Clock, CheckCircle, BarChart2, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import useAppStore from '../store/appStore';
import useFlags from '../hooks/useFlags';
import StatCard from '../components/StatCard';
import PipelineBar from '../components/PipelineBar';
import FlagCard from '../components/FlagCard';
import StatusBadge from '../components/StatusBadge';
import { pipelineCounts, groupStats, urgencyBoard, suspensePending } from '../utils/analytics';
import { STATUS_COLOR_HEX, PIPELINE_STAGES } from '../data/constants';

function daysSince(d) {
  if (!d) return 0;
  const dt = new Date(d);
  if (isNaN(dt)) return 0;
  return Math.floor((Date.now() - dt.getTime()) / 86400000);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const clients = useAppStore((s) => s.clients);
  const flags = useFlags();

  const active = clients.filter((c) => !['Closed', 'N.A.', 'Cancelled', 'Ack Recd', 'Uploaded'].includes(c.status));
  const critical = flags.filter((f) => f.severity === 'critical');
  const pipeline = pipelineCounts(clients);
  const groups = groupStats(clients);
  const urgent = urgencyBoard(clients).slice(0, 10);
  const suspense = suspensePending(clients);

  // Bar chart data for pipeline
  const barData = pipeline.filter((p) => p.count > 0).map((p) => ({
    name: p.label,
    count: p.count,
    color: p.color,
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Portfolio overview — FY 2024-25</p>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Portfolio" value={clients.length} icon={Users} color="blue" sub="All clients" />
        <StatCard label="Active Cases" value={active.length} icon={TrendingUp} color="teal" sub="In progress" />
        <StatCard
          label="Critical Flags"
          value={critical.length}
          icon={AlertTriangle}
          color="red"
          sub="Need attention"
          onClick={() => navigate('/clients')}
        />
        <StatCard label="Suspense Pending" value={suspense} icon={Clock} color="rose" sub="Unresolved entries" />
      </div>

      {/* Pipeline bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Status Pipeline</h2>
        <PipelineBar
          counts={Object.fromEntries(pipeline.map((p) => [p.key, p.count]))}
          total={clients.length}
          height={16}
          showLabels
        />
        {/* Bar chart */}
        <div className="mt-4 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group-wise workload */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <BarChart2 size={14} className="text-brand-blue" />
              Top Groups by Workload
            </h2>
            <button
              className="text-xs text-brand-blue font-medium hover:underline"
              onClick={() => navigate('/groups')}
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {groups.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No group data</p>}
            {groups.slice(0, 10).map((g) => (
              <div key={g.group} className="cursor-pointer hover:bg-slate-50 rounded-lg p-2 -mx-2 transition-colors"
                onClick={() => navigate(`/groups?g=${encodeURIComponent(g.group)}`)}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{g.group}</span>
                  <span className="text-xs font-mono text-slate-500">{g.total} clients</span>
                </div>
                <PipelineBar counts={g.byStatus} total={g.total} height={8} />
              </div>
            ))}
          </div>
        </div>

        {/* Red flag feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={14} className="text-brand-red" />
            Red Flag Feed
            {flags.length > 0 && (
              <span className="ml-auto text-xs font-mono text-slate-400">{flags.length} active</span>
            )}
          </h2>
          {flags.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle size={28} className="mx-auto mb-2 text-green-400" />
              <p className="text-sm font-medium text-slate-500">All clear — no flags</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {flags.slice(0, 15).map((f) => (
                <FlagCard key={f.id} flag={f} />
              ))}
              {flags.length > 15 && (
                <button
                  className="w-full text-xs text-brand-blue font-medium py-2"
                  onClick={() => navigate('/clients')}
                >
                  View all {flags.length} flags →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Urgency board */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Clock size={14} className="text-brand-amber" />
          Deadline / Urgency Board
          <span className="ml-auto text-xs text-slate-400 font-mono">sorted by days since last contact</span>
        </h2>
        {urgent.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">No active cases</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left pb-2 text-xs font-semibold text-slate-400">Client</th>
                  <th className="text-left pb-2 text-xs font-semibold text-slate-400">Group</th>
                  <th className="text-left pb-2 text-xs font-semibold text-slate-400">In Charge</th>
                  <th className="text-left pb-2 text-xs font-semibold text-slate-400">Status</th>
                  <th className="text-right pb-2 text-xs font-semibold text-slate-400">Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {urgent.map((c) => (
                  <tr
                    key={c.id}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => navigate(`/clients/${c.id}`)}
                  >
                    <td className="py-2.5 font-semibold text-slate-700">{c.name}</td>
                    <td className="py-2.5 text-slate-500">{c.group}</td>
                    <td className="py-2.5 text-slate-500">{c.inCharge}</td>
                    <td className="py-2.5"><StatusBadge status={c.status} /></td>
                    <td className="py-2.5 text-right font-mono text-xs font-bold"
                      style={{ color: c.daysSince > 14 ? '#dc2626' : c.daysSince > 7 ? '#d97706' : '#64748b' }}>
                      {c.daysSince}d
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
