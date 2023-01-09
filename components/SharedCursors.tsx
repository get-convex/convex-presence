import { useRef } from 'react';
import { PresenceData } from '../hooks/usePresence';

const OLD_MS = 10000;
type Data = { text: string; emoji: string; x: number; y: number };
type SharedCursorsProps = {
  myPresenceData: Data;
  othersPresence?: PresenceData<Data>[];
  updatePresence: (p: Partial<Data>) => void;
};
export default ({
  myPresenceData,
  othersPresence,
  updatePresence,
}: SharedCursorsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="flex flex-row relative flex-wrap overflow-hidden justify-between text-7xl w-[500px] h-[500px] border-2 rounded p-6 m-2"
      onPointerMove={(e) => {
        const { x, y } = ref.current!.getBoundingClientRect();
        void updatePresence({ x: e.clientX - x, y: e.clientY - y });
      }}
    >
      <span
        className="text-base absolute cursor-none"
        key="me"
        style={{
          left: myPresenceData.x,
          top: myPresenceData.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {myPresenceData.emoji + ' ' + myPresenceData.text}
      </span>
      {othersPresence &&
        othersPresence
          .filter(
            (presence) =>
              presence.data.x &&
              presence.data.y &&
              presence.updated > Date.now() - OLD_MS
          )
          .map((presence) => (
            <span
              className="text-base absolute"
              key={presence.created}
              style={{
                left: presence.data.x,
                top: presence.data.y,
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.20s ease-out',
              }}
            >
              {presence.data.emoji + ' ' + presence.data.text}
            </span>
          ))}
    </div>
  );
};
