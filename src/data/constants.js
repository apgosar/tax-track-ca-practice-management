export const SHEET_ID = '1M1mdMB4nKuRL5g3MAZaDDwwdWdaSjJjq_OApA2S5g7w';
export const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

export const STATUSES = [
  'Call Made',
  'Detail Recd.',
  'Bank entries done',
  'Suspense informed',
  'Audit',
  'Ack Recd',
  'Uploaded',
  'Closed',
  'N.A.',
  'Cancelled',
];

export const STATUS_STAGE = {
  'Call Made': 1,
  'Detail Recd.': 2,
  'Bank entries done': 2,
  'Suspense informed': 2,
  'Audit': 3,
  'Ack Recd': 4,
  'Uploaded': 4,
  'Closed': 4,
  'N.A.': 4,
  'Cancelled': 4,
};

export const STAGE_LABELS = {
  1: 'Collecting',
  2: 'Processing',
  3: 'Review',
  4: 'Filed/Done',
};

export const STATUS_COLOR = {
  'Call Made': { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  'Detail Recd.': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  'Bank entries done': { bg: 'bg-teal-100', text: 'text-teal-800', dot: 'bg-teal-500' },
  'Audit': { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
  'Suspense informed': { bg: 'bg-rose-100', text: 'text-rose-800', dot: 'bg-rose-500' },
  'Ack Recd': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  'Uploaded': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  'Closed': { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  'N.A.': { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
};

export const STATUS_COLOR_HEX = {
  'Call Made': '#d97706',
  'Detail Recd.': '#2563eb',
  'Bank entries done': '#0d9488',
  'Audit': '#7c3aed',
  'Suspense informed': '#e11d48',
  'Ack Recd': '#059669',
  'Uploaded': '#059669',
  'Closed': '#94a3b8',
  'N.A.': '#94a3b8',
  'Cancelled': '#dc2626',
};

export const FLAG_SEVERITY = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info',
};

export const FLAG_SEVERITY_COLOR = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
};

export const PIPELINE_STAGES = [
  { key: 'Call Made', label: 'Call Made', color: '#d97706' },
  { key: 'Detail Recd.', label: 'Detail Recd.', color: '#2563eb' },
  { key: 'Bank entries done', label: 'Bank Done', color: '#0d9488' },
  { key: 'Audit', label: 'Audit', color: '#7c3aed' },
  { key: 'Suspense informed', label: 'Suspense', color: '#e11d48' },
  { key: 'Ack Recd', label: 'Ack/Filed', color: '#059669' },
  { key: 'Uploaded', label: 'Uploaded', color: '#059669' },
  { key: 'Closed', label: 'Closed', color: '#94a3b8' },
];

// A=0  B=1  C=2  D=3  E=4  F=5  G=6  H=7  I=8  J=9  K=10  L=11  M=12
// Sr.  File Name  Group  InChg  Transfer  PAN  DOB  AckPwd  LoginPwd  Status  Date  Remarks
export const COLUMN_MAP = {
  sr: 0,
  fileNo: 1,
  name: 2,
  group: 3,
  inCharge: 4,
  transfer: 5,
  pan: 6,
  dob: 7,
  ackPassword: 8,
  loginPassword: 9,
  status: 10,
  date: 11,
  remarks: 12,
};
