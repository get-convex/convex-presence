import { useCallback, useMemo, useRef} from 'react';

export function useLatestValue<T>() {
  const initial = useMemo(() => {
    const [promise, resolve] = makeSignal();
    return { data: undefined as T, promise, resolve };
  }, []);
  const ref = useRef(initial);
  const getValue = useCallback(async () => {
    await ref.current.promise;
    const [promise, resolve] = makeSignal();
    ref.current.promise = promise;
    ref.current.resolve = resolve;
    return ref.current.data;
  }, [ref]);

  const update = (data: T) => {
    ref.current.data = data;
    ref.current.resolve();
  };

  return [getValue, update] as const;
}

const makeSignal = () => {
  let resolve: (value?: PromiseLike<undefined>) => void;
  const promise = new Promise<undefined>((resolver) => (resolve = resolver));
  return [promise, resolve!] as const;
};
