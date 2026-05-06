import { FileSearch } from 'lucide-react';

export default function EmptyState({ icon: Icon = FileSearch, title = 'No data', sub = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <Icon size={40} strokeWidth={1.5} className="mb-3" />
      <p className="font-semibold text-slate-500">{title}</p>
      {sub && <p className="text-sm mt-1">{sub}</p>}
    </div>
  );
}
