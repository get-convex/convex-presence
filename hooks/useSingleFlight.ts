import { DependencyList, useCallback, useRef } from 'react';

export default function useSingleFlight<
  F extends (...args: any[]) => Promise<any>
>(fn: F, deps: DependencyList) {
  const flightStatus = useRef({
    inFlight: false,
    upNext: null as null | { resolve: any; reject: any; args: Parameters<F> },
  });

  return useCallback((...args: Parameters<F>) => {
    if (!flightStatus.current.inFlight) {
      flightStatus.current.inFlight = true;
      const firstReq = fn(...args);
      (async (_) => {
        await firstReq;
        while (flightStatus.current.upNext) {
          let cur = flightStatus.current.upNext;
          flightStatus.current.upNext = null;
          await fn(...cur.args)
            .then(cur.resolve)
            .catch(cur.reject);
        }
        flightStatus.current.inFlight = false;
      })();
      return firstReq;
    }
    return new Promise((resolve, reject) => {
      flightStatus.current.upNext = { resolve, reject, args };
    });
  }, deps);
}
