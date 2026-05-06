import { useNavigate } from 'react-router-dom';
import { FLAG_SEVERITY_COLOR } from '../data/constants';
import useAppStore from '../store/appStore';
import { AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const ICONS = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export default function FlagCard({ flag, compact = false }) {
  const navigate = useNavigate();
  const resolveFlag = useAppStore((s) => s.resolveFlag);
  const colors = FLAG_SEVERITY_COLOR[flag.severity] || FLAG_SEVERITY_COLOR.info;
  const Icon = ICONS[flag.severity] || Info;

  return (
    <div
      className={clsx(
        'rounded-lg border p-3 flex gap-3 items-start',
        colors.bg,
        colors.border,
        !compact && 'cursor-pointer hover:brightness-95 transition-all'
      )}
      onClick={!compact ? () => navigate(`/clients/${flag.clientId}`) : undefined}
    >
      <Icon size={16} className={clsx('mt-0.5 flex-shrink-0', colors.text)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={clsx('text-xs font-bold uppercase tracking-wide', colors.text)}>
            {flag.severity}
          </span>
          <span className="text-xs font-semibold text-slate-700 truncate">{flag.title}</span>
        </div>
        {!compact && (
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{flag.description}</p>
        )}
        <p className="text-xs text-slate-400 mt-0.5 font-mono">{flag.clientName}</p>
      </div>
      <button
        className="flex-shrink-0 text-slate-400 hover:text-green-600 transition-colors"
        title="Mark resolved"
        onClick={(e) => { e.stopPropagation(); resolveFlag(flag.id); }}
      >
        <CheckCircle size={14} />
      </button>
    </div>
  );
}
