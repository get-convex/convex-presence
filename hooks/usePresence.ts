import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Id } from '../convex/_generated/dataModel';
import { useQuery, useMutation } from '../convex/_generated/react';

type Unlock = () => {};

const makeGate = () => {
  let unlock;
  const gate = new Promise<undefined>((resolver) => (unlock = resolver));
  return [gate, unlock as unknown as Unlock] as const;
};

export default (location: string, recencySecs: number = 10) => {
  const [presenceId, setPresenceId] = useState<Id<'presence'>>();
  let presence = useQuery('getPresence', location, recencySecs * 1000);
  presence = presence?.filter(
    (p) => p.updated > Date.now() - recencySecs * 1000
  );
  if (presence && presenceId) {
    presence = presence.filter((p) => !p._id.equals(presenceId));
  }

  const updatePresence = useMutation('updatePresence');
  const createPresence = useMutation('createPresence');

  const initial = useMemo(() => {
    const [gate, unlock] = makeGate();
    return { data: {}, gate, unlock };
  }, []);

  const ref = useRef(initial);
  const getValue = useCallback(async () => {
    await ref.current.gate;
    const [gate, unlock] = makeGate();
    ref.current.gate = gate;
    ref.current.unlock = unlock;
    return ref.current.data;
  }, [ref]);

  useEffect(() => {
    let stop = false;
    (async () => {
      const initialData = await getValue();
      const presenceId = await createPresence(location, initialData);
      setPresenceId(presenceId);
      while (!stop) {
        const data = await getValue();
        if (stop) break;
        await updatePresence(presenceId, data);
      }
      return () => {
        stop = true;
      };
    })();
  }, [getValue]);

  const update = (data: any) => {
    ref.current.data = data;
    ref.current.unlock();
  };
  return [presence, update] as const;
};
