import { FLAG_SEVERITY } from '../data/constants';

function daysSince(dateStr) {
  if (!dateStr) return 9999;
  const d = new Date(dateStr);
  if (isNaN(d)) return 9999;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

function yearsSince(dateStr) {
  return daysSince(dateStr) / 365;
}

export function detectFlags(client, thresholds = {}) {
  const {
    stalledDays = 7,
    suspenseDays = 5,
    pendingYears = 2,
  } = thresholds;

  const flags = [];
  const days = daysSince(client.date);
  const remarks = (client.remarks || '').toLowerCase();
  const status = (client.status || '').trim();

  // Call made but no response > stalledDays
  if (status === 'Call Made' && days > stalledDays) {
    flags.push({
      id: `${client.id}-stalled`,
      clientId: client.id,
      clientName: client.name,
      severity: FLAG_SEVERITY.CRITICAL,
      code: 'STALLED_CALL',
      title: 'No response after call',
      description: `Call made ${days} days ago — no response received.`,
      daysSince: days,
    });
  }

  // Suspense entries pending > suspenseDays
  if (status === 'Suspense informed' && days > suspenseDays) {
    flags.push({
      id: `${client.id}-suspense-pending`,
      clientId: client.id,
      clientName: client.name,
      severity: FLAG_SEVERITY.WARNING,
      code: 'SUSPENSE_PENDING',
      title: 'Suspense entry unresolved',
      description: `Suspense informed ${days} days ago — still unresolved.`,
      daysSince: days,
    });
  }

  // Bank done but suspense still open (remarks mention suspense)
  if (status === 'Bank entries done' && (remarks.includes('suspense') || remarks.includes('mismatch'))) {
    flags.push({
      id: `${client.id}-bank-suspense`,
      clientId: client.id,
      clientName: client.name,
      severity: FLAG_SEVERITY.WARNING,
      code: 'BANK_SUSPENSE',
      title: 'Bank done but suspense unresolved',
      description: 'Bank entries complete but suspense/mismatch noted in remarks.',
      daysSince: days,
    });
  }

  // Details pending 2+ years
  if (['Call Made', 'Detail Recd.'].includes(status) && yearsSince(client.date) >= pendingYears) {
    flags.push({
      id: `${client.id}-old-pending`,
      clientId: client.id,
      clientName: client.name,
      severity: FLAG_SEVERITY.CRITICAL,
      code: 'OLD_PENDING',
      title: 'Details pending 2+ years',
      description: `Case has been in ${status} since ${client.date} — ${Math.floor(yearsSince(client.date))} year(s) ago.`,
      daysSince: days,
    });
  }

  // Documents missing (from remarks)
  const docKeywords = ['documents pending', 'docs pending', 'documents missing', 'docs missing', 'pending documents'];
  if (docKeywords.some((k) => remarks.includes(k))) {
    flags.push({
      id: `${client.id}-docs-missing`,
      clientId: client.id,
      clientName: client.name,
      severity: FLAG_SEVERITY.WARNING,
      code: 'DOCS_MISSING',
      title: 'Documents missing',
      description: 'Remarks indicate documents are missing or pending.',
      daysSince: days,
    });
  }

  // PPF passbook not received
  if (remarks.includes('ppf passbook') || remarks.includes('ppf not received')) {
    flags.push({
      id: `${client.id}-ppf`,
      clientId: client.id,
      clientName: client.name,
      severity: FLAG_SEVERITY.WARNING,
      code: 'PPF_MISSING',
      title: 'PPF passbook not received',
      description: 'PPF passbook mentioned as not received in remarks.',
      daysSince: days,
    });
  }

  // Deceased client still open
  const deceasedKeywords = ['deceased', 'expired', 'death', 'passed away'];
  if (deceasedKeywords.some((k) => remarks.includes(k)) && !['Closed', 'N.A.', 'Cancelled'].includes(status)) {
    flags.push({
      id: `${client.id}-deceased`,
      clientId: client.id,
      clientName: client.name,
      severity: FLAG_SEVERITY.INFO,
      code: 'DECEASED_OPEN',
      title: 'Deceased client — case still open',
      description: 'Remarks suggest client is deceased but case is not closed.',
      daysSince: days,
    });
  }

  return flags;
}

export function detectAllFlags(clients, thresholds, resolvedFlags = new Set()) {
  const all = clients.flatMap((c) => detectFlags(c, thresholds));
  return all.filter((f) => !resolvedFlags.has(String(f.id)));
}

export function sortFlagsBySeverity(flags) {
  const order = { critical: 0, warning: 1, info: 2 };
  return [...flags].sort((a, b) => {
    const s = order[a.severity] - order[b.severity];
    if (s !== 0) return s;
    return (b.daysSince || 0) - (a.daysSince || 0);
  });
}
