import clsx from 'clsx';

export default function StatCard({ label, value, sub, icon: Icon, color = 'blue', onClick }) {
  const colorMap = {
    blue: 'bg-blue-50 text-brand-blue',
    green: 'bg-green-50 text-brand-green',
    amber: 'bg-amber-50 text-brand-amber',
    red: 'bg-red-50 text-brand-red',
    purple: 'bg-purple-50 text-brand-purple',
    rose: 'bg-rose-50 text-brand-rose',
    teal: 'bg-teal-50 text-brand-teal',
  };
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4',
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all'
      )}
      onClick={onClick}
    >
      {Icon && (
        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', colorMap[color])}>
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-ink font-mono mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
