import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { ChevronUp, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

function daysSince(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  return days;
}

const COLS = [
  { key: 'fileNo', label: 'File No.', mono: true },
  { key: 'name', label: 'Client Name' },
  { key: 'pan', label: 'PAN', mono: true },
  { key: 'group', label: 'Group' },
  { key: 'inCharge', label: 'In Charge' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Last Contact', mono: true },
];

export default function ClientTable({ clients }) {
  const navigate = useNavigate();
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' });

  function toggleSort(key) {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  }

  const sorted = [...clients].sort((a, b) => {
    let va = a[sort.key] || '';
    let vb = b[sort.key] || '';
    if (sort.key === 'date') {
      va = new Date(va).getTime() || 0;
      vb = new Date(vb).getTime() || 0;
    } else {
      va = va.toString().toLowerCase();
      vb = vb.toString().toLowerCase();
    }
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sort.dir === 'asc' ? cmp : -cmp;
  });

  if (!clients.length) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="font-semibold text-slate-500">No clients found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            {COLS.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-xs font-semibold text-slate-500 cursor-pointer select-none hover:text-slate-800 whitespace-nowrap"
                onClick={() => toggleSort(col.key)}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {sort.key === col.key ? (
                    sort.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                  ) : (
                    <ChevronDown size={12} className="opacity-20" />
                  )}
                </span>
              </th>
            ))}
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">
              Days Since
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sorted.map((c) => {
            const ds = daysSince(c.date);
            return (
              <tr
                key={c.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/clients/${c.id}`)}
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{c.fileNo}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{c.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.pan}</td>
                <td className="px-4 py-3 text-slate-600">{c.group}</td>
                <td className="px-4 py-3 text-slate-600">{c.inCharge}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.date}</td>
                <td className={clsx('px-4 py-3 font-mono text-xs font-semibold', ds > 14 ? 'text-brand-red' : ds > 7 ? 'text-brand-amber' : 'text-slate-500')}>
                  {ds !== '-' ? `${ds}d` : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
