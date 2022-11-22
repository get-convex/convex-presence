import { Value } from 'convex/values';
import { useCallback, useEffect, useState } from 'react';
import { Id } from '../convex/_generated/dataModel';
import { useQuery, useMutation } from '../convex/_generated/react';
import useSessionStorage from './useSessionStorage';
import useSingleFlight from './useSingleFlight';

export type PresenceData<D> = { _id: Id<'presence'>; updated: number; data: D };

export default <T extends { [key: string]: Value }>(
  location: string,
  initialData: T,
  recencyMs?: number
) => {
  const [data, setData] = useState(initialData);
  const [presenceId, setPresenceId] = useSessionStorage<Id<'presence'>>(
    'presenceId:' + location
  );
  let presence = useQuery('getPresence', location) as
    | PresenceData<T>[]
    | undefined;
  if (recencyMs) {
    presence = presence?.filter((p) => p.updated > Date.now() - recencyMs);
  }
  if (presence && presenceId) {
    presence = presence.filter((p) => !p._id.equals(presenceId));
  }

  const updatePresence = useSingleFlight(useMutation('updatePresence'));
  const createPresence = useMutation('createPresence');

  useEffect(() => {
    if (presenceId) return;
    void (async () => {
      setPresenceId(await createPresence(location, data));
    })();
    // We disable this lint beacause we only want this run once ever.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSF = useCallback(
    async (patch: {}) => {
      if (!presenceId) return;
      setData((last) => {
        const updated = { ...last, ...patch };
        void updatePresence(presenceId, updated);
        return updated;
      });
    },
    [presenceId, updatePresence]
  );

  return [data, presence, updateSF] as const;
};
