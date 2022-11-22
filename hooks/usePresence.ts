import { Value } from 'convex/values';
import { useCallback, useEffect, useState } from 'react';
import { Id } from '../convex/_generated/dataModel';
import { useQuery, useMutation } from '../convex/_generated/react';
import useSingleFlight from './useSingleFlight';

export type PresenceData<D> = { _id: Id<'presence'>; updated: number; data: D };

const HEARTBEAT_PERIOD = 5000;

export default <T extends { [key: string]: Value }>(
  location: string,
  initialData: T,
  recencyMs?: number
) => {
  const [data, setData] = useState(initialData);
  const [presenceId, setPresenceId] = useState<Id<'presence'>>();
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

  useEffect(() => {
    if (!presenceId) return;
    const intervalId = setInterval(() => {
      void updatePresence(presenceId, data);
      console.log('updated');
    }, HEARTBEAT_PERIOD);
    return () => {
      clearInterval(intervalId);
      console.log('cleared');
    };
  }, [updatePresence, presenceId, data]);

  const updateSF = useCallback(
    (patch: {}) => {
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
