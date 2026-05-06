// Staff roster — In Charge names sourced from Column E of the Google Sheet.
// These are seeded defaults; the live data from the sheet takes precedence.
export const DEFAULT_STAFF = [
  { id: 's1', name: 'Rahul Sharma', initials: 'RS', color: '#2563eb' },
  { id: 's2', name: 'Priya Mehta', initials: 'PM', color: '#7c3aed' },
  { id: 's3', name: 'Amit Joshi', initials: 'AJ', color: '#0d9488' },
  { id: 's4', name: 'Sneha Patil', initials: 'SP', color: '#d97706' },
  { id: 's5', name: 'Vikram Nair', initials: 'VN', color: '#e11d48' },
  { id: 's6', name: 'Kavita Singh', initials: 'KS', color: '#059669' },
];

export function makeStaffFromNames(names) {
  const palette = ['#2563eb', '#7c3aed', '#0d9488', '#d97706', '#e11d48', '#059669', '#dc2626', '#475569'];
  return names.map((name, i) => ({
    id: `s${i + 1}`,
    name,
    initials: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    color: palette[i % palette.length],
  }));
}
