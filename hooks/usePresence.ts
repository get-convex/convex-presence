import { Value } from 'convex/values';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Id } from '../convex/_generated/dataModel';
import { useQuery, useMutation } from '../convex/_generated/react';
import useSingleFlight from './useSingleFlight';

export type PresenceData<D> = {
  _creationTime: number;
  updated: number;
  data: D;
};

const HEARTBEAT_PERIOD = 5000;

export default <T extends { [key: string]: Value }>(
  user: string,
  location: string,
  initialData: T,
  recencyMs?: number
) => {
  const [data, setData] = useState(initialData);
  const initialRef = useRef(initialData);

  const [presenceId, setPresenceId] = useState<Id<'presence'>>();
  let presence: PresenceData<T>[] | undefined = useQuery(
    'presence:list',
    location,
    presenceId ?? null
  );
  if (recencyMs) {
    presence = presence?.filter((p) => p.updated > Date.now() - recencyMs);
  }

  const updatePresence = useSingleFlight(useMutation('presence:update'));
  const getOrCreate = useMutation('presence:getOrCreate');

  useEffect(() => {
    void (async () => {
      setPresenceId(await getOrCreate(user, location, initialRef.current));
    })();
    return () => setPresenceId(undefined);
  }, [user, location, getOrCreate]);

  useEffect(() => {
    if (!presenceId) return;
    const intervalId = setInterval(() => {
      void updatePresence(presenceId, data);
    }, HEARTBEAT_PERIOD);
    // Whenever we have any data change, it will get cleared.
    return () => clearInterval(intervalId);
  }, [updatePresence, presenceId, data]);

  const updateSF = useCallback(
    (patch: {}) => {
      setData((last) => {
        const updated = { ...last, ...patch };
        if (presenceId) {
          void updatePresence(presenceId, updated);
        }
        return updated;
      });
    },
    [presenceId, updatePresence]
  );

  return [data, presence, updateSF] as const;
};
