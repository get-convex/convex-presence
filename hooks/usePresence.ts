import { Value } from 'convex/values';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '../convex/_generated/react';
import useSingleFlight from './useSingleFlight';

export type PresenceData<D> = {
  created: number;
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

  let presence: PresenceData<T>[] | undefined = useQuery(
    'presence:list',
    location,
    user
  );
  if (recencyMs) {
    presence = presence?.filter((p) => p.updated > Date.now() - recencyMs);
  }

  const updatePresence = useSingleFlight(useMutation('presence:update'));

  useEffect(() => {
    void updatePresence(location, user, initialRef.current, true);
  }, [updatePresence, location, user]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void updatePresence(location, user, data);
    }, HEARTBEAT_PERIOD);
    // Whenever we have any data change, it will get cleared.
    return () => clearInterval(intervalId);
  }, [updatePresence, location, user, data]);

  const updateSF = useCallback(
    (patch: {}) => {
      setData((last) => {
        const updated = { ...last, ...patch };
        void updatePresence(location, user, updated);
        return updated;
      });
    },
    [location, user, updatePresence]
  );

  return [data, presence, updateSF] as const;
};
