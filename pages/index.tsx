import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import Facepile from '../components/Facepile';
import SharedCursors from '../components/SharedCursors';
import usePresence from '../hooks/usePresence';

const OLD_MS = 10000;

const Emojis =
  '😀 😃 😄 😁 😆 😅 😂 🤣 🥲 🥹 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 😎 🥸 🤩 🥳 😏 😳 🤔 🫢 🤭 🤫 😶 🫠 😮 🤤 😵‍💫 🥴 🤑 🤠'.split(
    ' '
  );

const PresencePane = () => {
  const [userId] = useState(() => Math.floor(Math.random() * 10000));
  const [location, setLocation] = useState('RoomA');
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
        <option key="A"> RoomA </option>
        <option key="B"> RoomB </option>
        <option key="C"> RoomC </option>
      </select>
      <p className="text-sm leading-5 text-gray-500">
        Simulating being on different pages
      </p>
      <br />
      <h2>Facepile:</h2>
      <div className="flex p4 border-b border-solid flex-row justify-end">
        <Facepile othersPresence={others} />
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
      <SharedCursors
        myPresenceData={data}
        othersPresence={others}
        updatePresence={updatePresence}
      />
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

const PresencePaneNoSSR = dynamic(() => Promise.resolve(PresencePane), {
  ssr: false,
});

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
          <PresencePaneNoSSR />
          <PresencePaneNoSSR />
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
