import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAppStore from '../store/appStore';
import { groupStats } from '../utils/analytics';
import PipelineBar from '../components/PipelineBar';
import ClientTable from '../components/ClientTable';
import EmptyState from '../components/EmptyState';
import { ArrowLeft, FolderOpen } from 'lucide-react';

export default function Groups() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clients = useAppStore((s) => s.clients);
  const [selectedGroup, setSelectedGroup] = useState(searchParams.get('g') || null);

  const stats = useMemo(() => groupStats(clients), [clients]);

  if (selectedGroup) {
    const groupClients = clients.filter((c) => c.group === selectedGroup);
    const stat = stats.find((g) => g.group === selectedGroup);
    return (
      <div className="space-y-6 fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedGroup(null)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium"
          >
            <ArrowLeft size={14} /> All Groups
          </button>
          <div>
            <h1 className="text-xl font-bold text-ink">{selectedGroup}</h1>
            <p className="text-sm text-slate-500">{groupClients.length} clients</p>
          </div>
        </div>
        {stat && (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <PipelineBar counts={stat.byStatus} total={stat.total} height={12} showLabels />
          </div>
        )}
        {groupClients.length === 0 ? (
          <EmptyState title="No clients in this group" />
        ) : (
          <ClientTable clients={groupClients} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Groups</h1>
        <p className="text-sm text-slate-500 mt-0.5">Client portfolio by group</p>
      </div>

      {stats.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No groups found" sub="Sync your Google Sheet to load group data" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {stats.map((g) => (
            <div
              key={g.group}
              className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
              onClick={() => setSelectedGroup(g.group)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FolderOpen size={16} className="text-brand-blue" />
                  <span className="font-semibold text-slate-800">{g.group}</span>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {g.total}
                </span>
              </div>
              <PipelineBar counts={g.byStatus} total={g.total} height={10} showLabels />
              <div className="mt-3 text-xs text-slate-400">
                {g.active} active · {g.total - g.active} filed/closed
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
