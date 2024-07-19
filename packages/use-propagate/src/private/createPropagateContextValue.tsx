import { Listener } from './createPropagation';

export type PropagateContext<T> = Readonly<{
  addListener(listener: Listener<T>): void;
  removeListener(listener: Listener<T>): void;
  runListeners(value: T): void;
}>;

export function createPropagateContextValue<T>(): PropagateContext<T> {
  type Fn = Listener<T>;
  const listeners = new Set<Fn>();
  return {
    addListener(listener: Fn) {
      listeners.add(listener);
    },
    removeListener(listener: Fn) {
      listeners.delete(listener);
    },
    runListeners(value: T) {
      listeners.forEach(listener => listener(value));
    }
  };
}
