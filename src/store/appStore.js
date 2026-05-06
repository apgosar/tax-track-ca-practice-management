import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SAMPLE_CLIENTS } from '../data/clients';
import { DEFAULT_STAFF, makeStaffFromNames } from '../data/staff';
import { SHEET_CSV_URL } from '../data/constants';
import Papa from 'papaparse';
import { COLUMN_MAP } from '../data/constants';

function parseRow(row, index) {
  const cols = Array.isArray(row) ? row : Object.values(row);
  return {
    id: `c${index + 1}`,
    sr: cols[COLUMN_MAP.sr] || index + 1,
    fileNo: (cols[COLUMN_MAP.fileNo] || '').trim(),
    name: (cols[COLUMN_MAP.name] || '').trim(),
    group: (cols[COLUMN_MAP.group] || '').trim(),
    inCharge: (cols[COLUMN_MAP.inCharge] || '').trim(),
    transfer: (cols[COLUMN_MAP.transfer] || '').trim(),
    pan: (cols[COLUMN_MAP.pan] || '').trim().toUpperCase(),
    dob: (cols[COLUMN_MAP.dob] || '').trim(),
    status: (cols[COLUMN_MAP.status] || '').trim(),
    date: (cols[COLUMN_MAP.date] || '').trim(),
    remarks: (cols[COLUMN_MAP.remarks] || '').trim(),
  };
}

const useAppStore = create(
  persist(
    (set, get) => ({
      // Data
      clients: SAMPLE_CLIENTS,
      staff: DEFAULT_STAFF,
      lastSynced: null,
      sheetUrl: SHEET_CSV_URL,
      isSyncing: false,
      syncError: null,

      // UI state
      selectedClientId: null,
      selectedStaffId: null,
      selectedGroup: null,
      filters: { status: '', group: '', inCharge: '', search: '', flagSeverity: '' },
      flagThresholds: { stalledDays: 7, suspenseDays: 5, pendingYears: 2 },

      // Notes per client
      notes: {},

      // Manual flags per client
      manualFlags: {},

      // Resolved flags
      resolvedFlags: new Set(),

      setSheetUrl: (url) => set({ sheetUrl: url }),

      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),

      clearFilters: () =>
        set({ filters: { status: '', group: '', inCharge: '', search: '', flagSeverity: '' } }),

      selectClient: (id) => set({ selectedClientId: id }),
      selectStaff: (id) => set({ selectedStaffId: id }),
      selectGroup: (g) => set({ selectedGroup: g }),

      setFlagThreshold: (key, value) =>
        set((s) => ({ flagThresholds: { ...s.flagThresholds, [key]: value } })),

      addNote: (clientId, text) => {
        const note = { id: Date.now(), text, timestamp: new Date().toISOString(), author: 'CA' };
        set((s) => ({
          notes: { ...s.notes, [clientId]: [...(s.notes[clientId] || []), note] },
        }));
      },

      addManualFlag: (clientId, flag) => {
        set((s) => ({
          manualFlags: {
            ...s.manualFlags,
            [clientId]: [...(s.manualFlags[clientId] || []), { ...flag, id: Date.now(), manual: true }],
          },
        }));
      },

      resolveFlag: (flagId) => {
        set((s) => {
          const next = new Set(s.resolvedFlags);
          next.add(String(flagId));
          return { resolvedFlags: next };
        });
      },

      syncSheet: async () => {
        const { sheetUrl } = get();
        set({ isSyncing: true, syncError: null });
        try {
          const res = await fetch(sheetUrl);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const text = await res.text();
          const { data } = Papa.parse(text, { skipEmptyLines: true });
          // Skip header row
          const rows = data.slice(1).filter((r) => r[COLUMN_MAP.name]?.trim());
          const clients = rows.map((r, i) => parseRow(r, i));

          // Derive staff from unique inCharge values
          const names = [...new Set(clients.map((c) => c.inCharge).filter(Boolean))].sort();
          const staff = makeStaffFromNames(names);

          set({ clients, staff, lastSynced: new Date().toISOString(), isSyncing: false });
        } catch (err) {
          set({ isSyncing: false, syncError: err.message });
        }
      },
    }),
    {
      name: 'taxtrack-store',
      partialize: (s) => ({
        sheetUrl: s.sheetUrl,
        lastSynced: s.lastSynced,
        clients: s.clients,
        staff: s.staff,
        notes: s.notes,
        manualFlags: s.manualFlags,
        flagThresholds: s.flagThresholds,
        resolvedFlags: [...s.resolvedFlags],
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.resolvedFlags)) {
          state.resolvedFlags = new Set(state.resolvedFlags);
        }
      },
    }
  )
);

export default useAppStore;
