import { useMemo } from 'react';
import useAppStore from '../store/appStore';

export default function useClients() {
  const clients = useAppStore((s) => s.clients);
  const filters = useAppStore((s) => s.filters);

  return useMemo(() => {
    let result = clients;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.pan.toLowerCase().includes(q) ||
          c.fileNo.toLowerCase().includes(q) ||
          (c.group || '').toLowerCase().includes(q)
      );
    }
    if (filters.status) {
      result = result.filter((c) => c.status === filters.status);
    }
    if (filters.group) {
      result = result.filter((c) => c.group === filters.group);
    }
    if (filters.inCharge) {
      result = result.filter((c) => c.inCharge === filters.inCharge);
    }

    return result;
  }, [clients, filters]);
}
