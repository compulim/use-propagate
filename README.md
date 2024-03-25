# `use-propagate`

Propagates a value to multiple nodes via callback function using React context and hooks.

## Background

This pattern is useful for triggering multiple nodes via callback function.

Unlike setting a value in a [context](https://react.dev/reference/react/createContext), invoking a callback function will not trigger re-render. Subscribers can choose to save the value into its state and re-render as needed.

## How to use

> [Live demo](https://compulim.github.io/use-propagate)

The following code snippet sends the focus to the text box when the button is tapped.

```tsx
import { createPropagation } from 'use-propagate';

// Creates a namespace for the propagation. This should be placed outside of the component.
const { Provider, useListen, usePropagate } = createPropagation<void>();

const FocusButton = () => {
  const propagate = usePropagate();

  // When tapped, it will trigger all subscribers.
  const handleClick = useCallback(() => propagate(), [propagate]);

  return (
    <button autoFocus={true} onClick={handleClick}>
      Tap to focus to the text box
    </button>
  );
};

const TextBox = () => {
  const ref = useRef<HTMLInputElement>(null);

  // When the callback is called, send the focus to the text box.
  const handleListen = useCallback(() => ref.current?.focus(), [ref]);

  // Listens to the propagation.
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
  Provider: ComponentType<{ children?: ReactNode | undefined }>;
  useListen: (callback: (value: T) => void) => void;
  usePropagate: (value: T) => void;
};
```

## Behaviors

### Why not passing values via `useContext`?

When propagating a value via `useContext`, subscribing nodes will be re-rendered. This behavior may not be desirable for events and certain type of scenarios.

### How to get response from the listener or wait for the listener to complete?

Modifies the passing value by following the [`FetchEvent.respondWith`](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith) or [`ExtendableEvent.waitUntil`](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil) pattern.

### How to re-render when triggered?

Use the following code snippet to save the value to a state, which will rerender the component.

```tsx
const MyComponent = () => {
  const [value, setValue] = useState<number>();

  // When triggered, saves the value to state.
  useListen(setValue);

  return <p>The value is {value}.</p>
};
```

## Contributions

Like us? [Star](https://github.com/compulim/use-propagate/stargazers) us.

Want to make it better? [File](https://github.com/compulim/use-propagate/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/use-propagate/pulls) a pull request.
