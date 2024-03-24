# `use-propagate`

Propagates an event to multiple subscribers using React hooks.

## Background

This pattern is useful for propagating an event to multiple nodes via a callback mechanism.

Unlike setting a value in a [context](https://react.dev/reference/react/createContext), data will be passed via callback function. Subscribe can save the value into state and re-render.

## How to use

```tsx
import { createPropagation } from 'use-propagate';

const { Provider, useListen, usePropagate } = createPropagation<void>();

const FocusButton = () => {
  const propagate = usePropagate();

  // When clicked, it will trigger all subscribers.
  const handleClick = useCallback(() => propagate(), [propagate]);

  return (
    <button autoFocus={true} onClick={handleClick}>
      Tap to focus to the text box
    </button>
  );
};

const TextBox = () => {
  const ref = useRef<HTMLInputElement>(null);

  // When being triggered, send the focus to the text box.
  const handleListen = useCallback(() => ref.current?.focus(), [ref]);

  useListen(handleListen);

  return <input ref={ref} type="text" />;
};

render(
  <Provider>
    <FocusButton />
    <TextBox />
  </Provider>
);
```

## API

```ts
export function createPropagation<T>(): {
  Provider: ComponentType;
  usePropagate: (value: T) => void;
  useListen: (callback: (value: T) => void) => void;
};
```

## Behaviors

### Why not passing values via `useContext`?

> (TBD)

When propagating a value via `useContext`, the children could be re-rendered. For event, this behavior may not be desirable.

### How to get response from the event listener?

> (TBD)

Modifies the passing value by following the [`FetchEvent.respondWith` pattern](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith).

### How to wait for the event listener to complete?

> (TBD)

Modifies the passing value by following the [`ExtendableEvent.waitUntil` pattern](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil).

## Contributions

Like us? [Star](https://github.com/compulim/use-propagate/stargazers) us.

Want to make it better? [File](https://github.com/compulim/use-propagate/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/use-propagate/pulls) a pull request.
