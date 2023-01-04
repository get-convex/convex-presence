import classNames from 'classnames';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRef, useState } from 'react';
import usePresence, { PresenceData } from '../hooks/usePresence';

type Data = { text: string; emoji: string; x: number; y: number };
const OLD_MS = 10000;

const FacePile = ({ people }: { people: PresenceData<Data>[] }) => {
  const now = Date.now();
  return (
    <div className="isolate flex -space-x-2 overflow-hidden">
      {people
        .slice(0, 10)
        .map((p) => ({ ...p, old: p.updated < now - OLD_MS }))
        .sort((p1, p2) =>
          p1.old === p2.old
            ? p1.created - p2.created
            : Number(p2.old) - Number(p1.old)
        )
        .map((p) => (
          <span
            className={classNames(
              'relative inline-block h-6 w-6 rounded-full bg-white ring-2 ring-white text-xl',
              { grayscale: p.old }
            )}
            key={p.created}
            title={
              (p.data.text || p.user) +
              ': Last seen ' +
              new Date(p.updated).toDateString()
            }
          >
            {p.data.emoji}
          </span>
        ))}
    </div>
  );
};

const Emojis =
  '😀 😃 😄 😁 😆 😅 😂 🤣 🥲 🥹 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 🥺 😢 😭 😮‍💨 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🫣 🤗 🫡 🤔 🫢 🤭 🤫 🤥 😶 😶‍🌫️ 😐 😑 😬 🫠 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 😵‍💫 🫥 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠'.split(
    ' '
  );

const PresencePane = () => {
  const [userId] = useState(() => Math.floor(Math.random() * 10000));
  const [location, setLocation] = useState('PageA');
  const [data, others, updatePresence] = usePresence(
    location,
    'User' + userId,
    {
      text: '',
      emoji: Emojis[userId % Emojis.length],
      x: 0,
      y: 0,
    }
  );
  const ref = useRef<HTMLDivElement>(null);
  const presentOthers = (others ?? []).filter(
    (p) => p.updated > Date.now() - OLD_MS
  );
  return (
    <div className="flex flex-grow flex-col items-center">
      <select
        value={location}
        className="text-xl"
        onChange={(e) => setLocation(e.target.value)}
      >
        <option key="A"> PageA </option>
        <option key="B"> PageB </option>
        <option key="C"> PageC </option>
      </select>
      <p className="text-sm leading-5 text-gray-500">
        Simulating being on different pages
      </p>
      <br />
      <h2>Facepile:</h2>
      <div className="flex p4 border-b border-solid flex-row justify-end">
        <FacePile people={others ?? []} />
        <select
          className="mx-2 text-xl"
          defaultValue={data.emoji}
          onChange={(e) => updatePresence({ emoji: e.target.value })}
        >
          {Emojis.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </div>
      <h2 className="mt-1">Shared cursors:</h2>
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
          key="mine"
          style={{
            left: data.x,
            top: data.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {data.emoji + ' ' + data.text}
        </span>
        {presentOthers
          .filter((p) => p.data.x && p.data.y)
          .map((p) => (
            <span
              className="text-base absolute"
              key={p.created}
              style={{
                left: p.data.x,
                top: p.data.y,
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.20s ease-out',
              }}
            >
              {p.data.emoji + ' ' + p.data.text}
            </span>
          ))}
      </div>
      <h2>Shared text:</h2>
      <div className="w-1/2">
        <span>
          {data.emoji + ': '}
          <input
            className="inline-block border rounded-md "
            type="text"
            placeholder="type something!"
            name="name"
            value={data.text}
            onChange={(e) => updatePresence({ text: e.target.value })}
          />
        </span>
        <ul className="flex flex-col justify-start">
          {presentOthers
            .filter((p) => p.data.text)
            .sort((p1, p2) => p2.created - p1.created)
            .map((p) => (
              <li key={p.created}>
                <p>{p.data.emoji + ': ' + p.data.text}</p>
              </li>
            ))}
        </ul>
      </div>
      <div className="h-48"></div>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <div className="py-8 flex flex-col min-h-screen">
      <Head>
        <title>Presence with Convex</title>
        <meta name="description" content="Live presence feedback" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="flex flex-grow flex-col justify-center items-center">
        <h1 className="m-6 text-3xl text-center leading-5">
          Presence with{' '}
          <a className="text-[#8d2676]" href="https://convex.dev">
            Convex
          </a>
        </h1>
        <div className="flex flex-row">
          <PresencePane />
          <PresencePane />
        </div>
      </main>

      <footer className="flex p-8 border-t border-solid border-slate-300 justify-center items-center">
        <p>Hint: try opening up multiple tabs</p>
        <a
          href="https://www.convex.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center flex-grow"
        >
          Powered by{' '}
          <span className="ml-2 h-4">
            <Image src="/convex.svg" alt="Convex Logo" width={90} height={18} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
