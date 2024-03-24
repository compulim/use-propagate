import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useRefFrom } from 'use-ref-from';

import removeInline from './private/removeInline';

type Listener<T> = (value: T) => void;

type ContextType<T> = {
  addListener: (listener: Listener<T>) => void;
  propagate: Listener<T>;
  removeListener: (listener: Listener<T>) => void;
};

export default function createPropagation<T>() {
  type Fn = Listener<T>;

  const Context = createContext<ContextType<T>>(
    new Proxy({} as ContextType<T>, {
      get() {
        throw new Error('This hook can only used under its corresponding <Provider>.');
      }
    })
  );

  const Provider = ({ children }: Readonly<{ children?: ReactNode | undefined }>) => {
    const listenersRef = useRef<Fn[]>([]);

    const addListener = useCallback(
      (listener: Fn): void => {
        listenersRef.current.push(listener);
      },
      [listenersRef]
    );

    const propagate = useMemo<Fn>(
      () => (value: T) => {
        listenersRef.current.forEach(listener => listener(value));
      },
      [listenersRef]
    );

    const removeListener = useCallback(
      (listener: Fn): void => removeInline(listenersRef.current, listener),
      [listenersRef]
    );

    const context = useMemo<ContextType<T>>(
      () => ({ addListener, propagate, removeListener }),
      [addListener, propagate, removeListener]
    );

    return <Context.Provider value={context}>{children}</Context.Provider>;
  };

  return {
    Provider,
    useListen: (listener: Fn) => {
      const { addListener, removeListener } = useContext(Context);
      const listenerRef = useRefFrom(listener);

      useEffect(() => {
        const wrappingListener = (value: T) => listenerRef.current(value);

        addListener(wrappingListener);

        return () => removeListener(wrappingListener);
      }, [addListener, listenerRef, removeListener]);
    },
    usePropagate: () => useContext(Context).propagate
  };
}
