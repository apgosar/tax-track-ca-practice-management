import { STATUS_COLOR_HEX } from '../data/constants';

export default function PipelineBar({ counts, total, height = 8, showLabels = false }) {
  if (!total) return <div className="h-2 bg-slate-100 rounded-full" />;

  const items = Object.entries(counts).filter(([, v]) => v > 0);

  return (
    <div>
      <div
        className="flex rounded-full overflow-hidden"
        style={{ height }}
        title={items.map(([k, v]) => `${k}: ${v}`).join(' | ')}
      >
        {items.map(([status, count]) => (
          <div
            key={status}
            style={{
              width: `${(count / total) * 100}%`,
              background: STATUS_COLOR_HEX[status] || '#94a3b8',
              minWidth: count > 0 ? 2 : 0,
            }}
          />
        ))}
      </div>
      {showLabels && (
        <div className="flex flex-wrap gap-2 mt-2">
          {items.map(([status, count]) => (
            <span key={status} className="flex items-center gap-1 text-xs text-slate-500">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: STATUS_COLOR_HEX[status] || '#94a3b8' }}
              />
              {status} ({count})
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
