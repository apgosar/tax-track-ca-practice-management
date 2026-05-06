import { STATUS_STAGE, PIPELINE_STAGES } from '../data/constants';

export function groupStats(clients) {
  const map = {};
  for (const c of clients) {
    const g = c.group || 'Unassigned';
    if (!map[g]) map[g] = { group: g, total: 0, byStatus: {}, active: 0 };
    map[g].total++;
    map[g].byStatus[c.status] = (map[g].byStatus[c.status] || 0) + 1;
    const stage = STATUS_STAGE[c.status] || 0;
    if (stage < 4) map[g].active++;
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
}

export function staffStats(clients, staff) {
  return staff.map((s) => {
    const mine = clients.filter((c) => c.inCharge === s.name);
    const byStatus = {};
    for (const c of mine) {
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    }
    const active = mine.filter((c) => (STATUS_STAGE[c.status] || 0) < 4).length;
    return { ...s, total: mine.length, active, byStatus, clients: mine };
  });
}

export function pipelineCounts(clients) {
  const counts = {};
  for (const c of clients) {
    counts[c.status] = (counts[c.status] || 0) + 1;
  }
  return PIPELINE_STAGES.map((s) => ({ ...s, count: counts[s.key] || 0 }));
}

export function urgencyBoard(clients) {
  function daysSince(dateStr) {
    if (!dateStr) return 0;
    const d = new Date(dateStr);
    if (isNaN(d)) return 0;
    return Math.floor((Date.now() - d.getTime()) / 86400000);
  }
  return clients
    .filter((c) => (STATUS_STAGE[c.status] || 0) < 4)
    .map((c) => ({ ...c, daysSince: daysSince(c.date) }))
    .sort((a, b) => b.daysSince - a.daysSince);
}

export function stageSummary(clients) {
  const stages = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const c of clients) {
    const s = STATUS_STAGE[c.status] || 0;
    if (s > 0) stages[s]++;
  }
  return stages;
}

export function suspensePending(clients) {
  return clients.filter((c) => c.status === 'Suspense informed').length;
}
