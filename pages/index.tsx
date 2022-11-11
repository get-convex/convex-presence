import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import usePresence from '../hooks/usePresence';

const Home: NextPage = () => {
  const [presence, update] = usePresence('test');
  const [name, setName] = useState('');

  return (
    <div className="py-8 flex flex-col min-h-screen">
      <Head>
        <title>Presence-tation</title>
        <meta name="description" content="Live presence feedback" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="flex flex-grow flex-col justify-center items-center">
        <h1 className="m-5 text-5xl text-center leading-5">
          Presence with <a href="https://convex.dev">Convex</a>
        </h1>
        <input
          className="border rounded-full text-center m-2"
          type="text"
          placeholder="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div
          className="flex flex-row justify-between text-7xl w-[500] h-[500] border-2 rounded p-6"
          onMouseMove={(e) => update({ x: e.clientX, y: e.clientY, name })}
        >
          <div className="p-4">{'↪️'}</div>
          <div className="p-4">{'⏸️'}</div>
          <div className="p-4">{'▶️'}</div>
          <div className="p-4">{'⏩'}</div>
          {presence &&
            presence.map((p) => {
              return (
                <span
                  className="text-base absolute"
                  key={p._id.toString()}
                  style={{
                    left: p.data.x,
                    top: p.data.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {'🐁 ' + p.data.name}
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
