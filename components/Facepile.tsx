import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { PresenceData } from '../hooks/usePresence';

const OLD_MS = 10000;
const UPDATE_MS = 1000;

type FacePileProps = {
  othersPresence?: PresenceData<{ emoji: string }>[];
};
export default ({ othersPresence }: FacePileProps) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), UPDATE_MS);
    return () => clearInterval(intervalId);
  }, [setNow]);
  return (
    <div className="isolate flex -space-x-2 overflow-hidden">
      {othersPresence
        ?.slice(0, 5)
        .map((presence) => ({
          ...presence,
          old: presence.updated < now - OLD_MS,
        }))
        .sort((presence1, presence2) =>
          presence1.old === presence2.old
            ? presence1.created - presence2.created
            : Number(presence2.old) - Number(presence1.old)
        )
        .map((presence) => (
          <span
            className={classNames(
              'relative inline-block h-6 w-6 rounded-full bg-white ring-2 ring-white text-xl',
              { grayscale: presence.old }
            )}
            key={presence.created}
            title={
              presence.old
                ? 'Last seen ' + new Date(presence.updated).toDateString()
                : 'Online'
            }
          >
            {presence.data.emoji}
          </span>
        ))}
    </div>
  );
};
