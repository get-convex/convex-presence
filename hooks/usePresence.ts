import { ReactMutation } from 'convex/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Id } from '../convex/_generated/dataModel';
import { useQuery, useMutation } from '../convex/_generated/react';
import { useLatestValue } from './useLatestValue';


const useSingleFlightThrottle = <T>(fn: () => Promise<T>) => {};



export default (location: string, recencyMs: number = 10000) => {
  const [presenceId, setPresenceId] = useState<Id<'presence'>>();
  let presence = useQuery('getPresence', location, recencyMs);
  presence = presence?.filter((p) => p.updated > Date.now() - recencyMs);
  if (presence && presenceId) {
    presence = presence.filter((p) => !p._id.equals(presenceId));
  }

  const updatePresence = useMutation('updatePresence');
  const createPresence = useMutation('createPresence');

  const [getValue, update] = useLatestValue<{}>();

  useEffect(() => {
      let stop = false;
    const init = async () => {
      const initialData = await getValue();
      const presenceId = await createPresence(location, initialData);
      setPresenceId(presenceId);
      while (!stop) {
        const data = await getValue();
        if (stop) break;
        await updatePresence(presenceId, data);
      }
    };
    init();
        return () => {
          stop = true;
        };
  }, []);



  useEffect(() => {
  }, [getValue]);

  return [presence, update] as const;
};
