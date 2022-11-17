import { useCallback, useState } from 'react';
import { Id } from '../convex/_generated/dataModel';
import { useQuery, useMutation } from '../convex/_generated/react';
import useSingleFlight from './useSingleFlight';

export default (location: string, recencyMs: number = 10000) => {
  let [presenceId, setPresenceId] = useState<Id<'presence'>>();
  let presence = useQuery('getPresence', location, recencyMs);
  presence = presence?.filter((p) => p.updated > Date.now() - recencyMs);
  if (presence && presenceId) {
    presence = presence.filter((p) => !p._id.equals(presenceId));
  }

  const updatePresence = useMutation('updatePresence');
  const createPresence = useMutation('createPresence');

  const updateSF = useSingleFlight(
    async (data: {}) => {
      if (!presenceId) {
        presenceId = await createPresence(location, data);
        setPresenceId(presenceId);
      } else {
        await updatePresence(presenceId, data);
      }
    },
    [presenceId, createPresence, setPresenceId, updatePresence]
  );

  return [presence, updateSF] as const;
};
