import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import usePresence from '../hooks/usePresence';

const Home: NextPage = () => {
  const [presence, update] = usePresence('test');

  return (
    <div
      className="py-8 flex flex-col min-h-screen"
      onMouseMove={(e) => update({ x: e.pageX, y: e.pageY })}
    >
      <Head>
        <title>Presence-tation</title>
        <meta name="description" content="Live presence feedback" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="flex flex-grow flex-col justify-center items-center">
        <h1 className="m-0 text-5xl text-center leading-5">
          Presence with <a href="https://convex.dev">Convex!</a>
        </h1>
        <div className="fixed top-0 bottom-0 left-0 right-0"></div>
        {presence &&
          presence.map((p) => {
            return (
              <div
                key={p._id.toString()}
                style={{
                  position: 'absolute',
                  left: p.data.x,
                  top: p.data.y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {'🐁'}
              </div>
            );
          })}
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
