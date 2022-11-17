import { useCallback, useEffect, useRef, useState } from 'react';
import { Id } from '../convex/_generated/dataModel';
import { useQuery, useMutation } from '../convex/_generated/react';
import useSingleFlight from './useSingleFlight';

export default <T extends {}>(
  location: string,
  initialData: T,
  recencyMs: number = 10000
) => {
  let [presenceId, setPresenceId] = useState<Id<'presence'>>();
  let presence = useQuery('getPresence', location, recencyMs);
  presence = presence?.filter((p) => p.updated > Date.now() - recencyMs);
  if (presence && presenceId) {
    presence = presence.filter((p) => !p._id.equals(presenceId));
  }
  const data = useRef(initialData);

  useEffect(() => {
    (async () => {
      presenceId = await createPresence(location, initialData);
      setPresenceId(presenceId);
    })();
  }, []);

  const updatePresence = useMutation('updatePresence');
  const createPresence = useMutation('createPresence');

  const updateSF = useSingleFlight(
    async (patch: {}) => {
      if (!presenceId) return;
      const updated = Object.assign(data.current, patch);
      await updatePresence(presenceId, updated);
    },
    [data, presenceId, updatePresence]
  );

  return [data.current, presence, updateSF] as const;
};
