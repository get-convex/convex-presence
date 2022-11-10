import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useQuery, useMutation } from '../convex/_generated/react'
import { useCallback } from 'react'

const Home: NextPage = () => {
  const counter = useQuery('getCounter', 'clicks') ?? 0
  const increment = useMutation('incrementCounter')
  const incrementByOne = useCallback(() => increment('clicks', 1), [increment])

  return (
    <div className="py-8 flex flex-col min-h-screen">
      <Head>
        <title>Presence-tation</title>
        <meta name="description" content="Live presence feedback" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="flex flex-col justify-center items-center">
        <h1 className="m-0 text-5xl text-center leading-5">
          Presence with <a href="https://convex.dev">Convex</a>
        </h1>

        <div></div>
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
  )
}

export default Home
