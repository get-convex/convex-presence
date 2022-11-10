import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import clientConfig from '../convex/_generated/clientConfig';
const convex = new ConvexReactClient(clientConfig);

// Trying out vivid.lol
if (
  typeof window !== 'undefined' &&
  process.env.NODE_ENV === 'development'
  // && /VIVID_ENABLED=true/.test(document.cookie)
) {
  import('vivid-studio').then((v) => v.run());
  import('vivid-studio/style.css');
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConvexProvider client={convex}>
      <Component {...pageProps} />
    </ConvexProvider>
  );
}

export default MyApp;
