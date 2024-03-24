import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useRefFrom } from 'use-ref-from';

import removeInline from './private/removeInline';

type ObserverFunction<T> = (observation: T) => void;

type ContextType<T> = {
  addObserver: (observer: ObserverFunction<T>) => void;
  next: ObserverFunction<T>;
  removeObserver: (observer: ObserverFunction<T>) => void;
};

export default function createPropagation<T>() {
  type Fn = ObserverFunction<T>;

  const Context = createContext<ContextType<T>>(
    new Proxy({} as ContextType<T>, {
      get() {
        throw new Error('This hook can only used under its corresponding <Provider>.');
      }
    })
  );

  const Provider = ({ children }: Readonly<{ children?: ReactNode | undefined }>) => {
    const observerRef = useRef<Fn[]>([]);

    const addObserver = useCallback(
      (observer: Fn): void => {
        observerRef.current.push(observer);
      },
      [observerRef]
    );

    const removeObserver = useCallback(
      (observer: Fn): void => removeInline(observerRef.current, observer),
      [observerRef]
    );

    const next = useMemo<Fn>(
      () => (observation: T) => {
        observerRef.current.forEach(observer => observer(observation));
      },
      [observerRef]
    );

    const context = useMemo<ContextType<T>>(
      () => ({ addObserver, next, removeObserver }),
      [addObserver, next, removeObserver]
    );

    return <Context.Provider value={context}>{children}</Context.Provider>;
  };

  return {
    Provider,
    useListen: (observer: Fn) => {
      const { addObserver, removeObserver } = useContext(Context);
      const observerRef = useRefFrom(observer);

      useEffect(() => {
        const wrappingObserver = (observation: T) => observerRef.current(observation);

        addObserver(wrappingObserver);

        return () => removeObserver(wrappingObserver);
      }, [addObserver, observerRef, removeObserver]);
    },
    usePropagate: () => useContext(Context).next
  };
}
