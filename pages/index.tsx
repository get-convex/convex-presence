import classNames from 'classnames';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRef } from 'react';
import usePresence, { PresenceData } from '../hooks/usePresence';

type Data = { text: string; emoji: string; x: number; y: number };
const OldMs = 10000;

const FacePile = ({ people }: { people: PresenceData<Data>[] }) => {
  const now = Date.now();
  return (
    <div className="isolate flex -space-x-2 overflow-hidden">
      {people
        .slice(0, 10)
        .map((p) => ({ ...p, old: p.updated < now - OldMs }))
        .sort((p1, p2) =>
          p1.old === p2.old
            ? p1._id.toString() < p2._id.toString()
              ? -1
              : 1
            : Number(p1.old) - Number(p2.old)
        )
        .map((p) => {
          return (
            <span
              className={classNames(
                'relative inline-block h-6 w-6 rounded-full bg-white ring-2 ring-white text-xl',
                { grayscale: p.old }
              )}
              title={
                p.data.text +
                ' Last seen: ' +
                new Date(p.updated).toDateString()
              }
            >
              {p.data.emoji}
            </span>
          );
        })
        .reverse()}
    </div>
  );
};

const Emojis =
  '😀 😃 😄 😁 😆 😅 😂 🤣 🥲 🥹 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 🥺 😢 😭 😮‍💨 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🫣 🤗 🫡 🤔 🫢 🤭 🤫 🤥 😶 😶‍🌫️ 😐 😑 😬 🫠 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 😵‍💫 🫥 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠'.split(
    ' '
  );

const PresencePane = () => {
  const [data, others, updatePresence] = usePresence('my-page-id', {
    text: '',
    emoji: '🥸',
    x: 0,
    y: 0,
  });
  const ref = useRef<HTMLDivElement>(null);
  const presentOthers = (others ?? []).filter(
    (p) => p.updated > Date.now() - OldMs
  );
  return (
    <div className="flex flex-grow flex-col items-center">
      <h2>Facepile:</h2>
      <div className="flex p4 border-b border-solid flex-row justify-end">
        <FacePile people={others ?? []} />
        <select
          className="mx-2 text-xl"
          onChange={(e) => updatePresence({ emoji: e.target.value })}
        >
          {Emojis.map((e) => (
            <option selected={data.emoji === e}>{e}</option>
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
              key={p._id?.toString()}
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
            .sort((p1, p2) => (p1._id.toString() < p2._id.toString() ? -1 : 1))
            .map((p) => (
              <li key={p._id.toString()}>
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
