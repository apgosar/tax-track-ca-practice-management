import { STATUS_COLOR } from '../data/constants';
import clsx from 'clsx';

export default function StatusBadge({ status, size = 'sm' }) {
  const colors = STATUS_COLOR[status] || { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        colors.bg,
        colors.text,
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <span className={clsx('rounded-full flex-shrink-0', colors.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {status || 'Unknown'}
    </span>
  );
}
