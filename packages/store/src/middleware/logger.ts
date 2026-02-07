import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string,
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T>(
  f: StateCreator<T, [], []>,
  name?: string,
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  const loggedSet: typeof set = (...args) => {
    const prev = get();
    set(...(args as Parameters<typeof set>));
    const next = get();

    if (process.env.NODE_ENV === 'development') {
      console.groupCollapsed(
        `%c[ARCHLENS STORE] ${name ?? 'anonymous'} @ ${new Date().toLocaleTimeString()}`,
        'color: #2f81f7; font-weight: bold;',
      );
      console.log('%cprev state', 'color: #f85149', prev);
      console.log('%cnext state', 'color: #3fb950', next);
      console.groupEnd();
    }
  };

  return f(loggedSet, get, store);
};

export const logger = loggerImpl as Logger;
