import { useMemo } from 'react';
import useAppStore from '../store/appStore';
import { detectAllFlags, sortFlagsBySeverity } from '../utils/flagEngine';

export default function useFlags(clientsOverride) {
  const storeClients = useAppStore((s) => s.clients);
  const thresholds = useAppStore((s) => s.flagThresholds);
  const resolvedFlags = useAppStore((s) => s.resolvedFlags);
  const manualFlags = useAppStore((s) => s.manualFlags);

  const clients = clientsOverride || storeClients;

  return useMemo(() => {
    const auto = detectAllFlags(clients, thresholds, resolvedFlags);
    const manual = Object.values(manualFlags)
      .flat()
      .filter((f) => !resolvedFlags.has(String(f.id)));
    return sortFlagsBySeverity([...auto, ...manual]);
  }, [clients, thresholds, resolvedFlags, manualFlags]);
}
