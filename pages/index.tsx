import classNames from 'classnames';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRef } from 'react';
import usePresence, { PresenceData } from '../hooks/usePresence';

type Data = { name: string; emoji: string; x: number; y: number };
const OldFaceMs = 30000;

const FacePile = ({ people }: { people: PresenceData<Data>[] }) => {
  const now = Date.now();
  return (
    <div className="isolate flex -space-x-2 overflow-hidden">
      {people.map((p) => {
        const old = p.updated < now - OldFaceMs;
        return (
          <span
            className={classNames(
              'relative inline-block h-6 w-6 rounded-full bg-white ring-2 ring-white text-xl',
              { grayscale: old }
            )}
            title={
              p.data.name + ' Last seen: ' + new Date(p.updated).toDateString()
            }
          >
            {p.data.emoji}
          </span>
        );
      })}
    </div>
  );
};

const MyFace = (props: {
  emoji: string;
  selectFace: (value: string) => void;
}) => {
  return (
    <select
      value={props.emoji}
      className="relative inline-block text-xl"
      onChange={(e) => props.selectFace(e.target.value)}
    >
      {'😀 😃 😄 😁 😆 😅 😂 🤣 🥲 🥹 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 🥺 😢 😭 😮‍💨 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🫣 🤗 🫡 🤔 🫢 🤭 🤫 🤥 😶 😶‍🌫️ 😐 😑 😬 🫠 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 😵‍💫 🫥 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠'
        .split(' ')
        .map((e) => (
          <option>{e}</option>
        ))}
    </select>
  );
};

const Home: NextPage = () => {
  const [data, others, setPresence] = usePresence('my-page-id', {
    name: '',
    emoji: '👻',
    x: 0,
    y: 0,
  });
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="py-8 flex flex-col min-h-screen">
      <Head>
        <title>Presence-tation</title>
        <meta name="description" content="Live presence feedback" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <header className="flex p4 border-b border-solid flex-row justify-end">
        <FacePile people={others ?? []} />
        <input
          className="border rounded-md text-center mx-2"
          type="text"
          placeholder="name"
          name="name"
          value={data.name}
          onChange={(e) => setPresence({ name: e.target.value })}
        />
        <MyFace
          emoji={data.emoji}
          selectFace={(e) => setPresence({ emoji: e })}
        />
      </header>
      <main className="flex flex-grow flex-col justify-center items-center">
        <h1 className="m-6 text-5xl text-center leading-5">
          Presence with <a href="https://convex.dev">Convex</a>
        </h1>
        <p>How are you feeling ?</p>
        <div
          ref={ref}
          className="flex flex-row relative flex-wrap overflow-hidden justify-between text-7xl w-[500px] h-[500px] border-2 rounded p-6 m-2"
          onPointerMove={(e) => {
            const { x, y } = ref.current!.getBoundingClientRect();
            void setPresence({ x: e.clientX - x, y: e.clientY - y });
          }}
        >
          <span
            className="text-base absolute cursor-none"
            key="mine"
            style={{
              left: data.x,
              top: data.y,
              transform: 'translate(-50%, -50%)',
              //transition: 'all 0.1s ease-out',
            }}
          >
            {data.emoji + ' ' + data.name}
          </span>
          {(others ?? [])
            .filter((p) => p.data.x && p.data.y)
            .map((p) => {
              return (
                <span
                  className="text-base absolute"
                  key={p._id?.toString()}
                  style={{
                    left: p.data.x,
                    top: p.data.y,
                    transform: 'translate(-50%, -50%) rotate(140deg)',
                    transition: 'all 0.2s ease-out',
                  }}
                >
                 {'▼ ' + p.data.name}
                </span>
              );
            })}
        </div>
      </main>

      <footer className="flex px-8 border-t border-solid border-slate-300 justify-center items-center">
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
