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
const { useListen, usePropagate } = createPropagation<void>();

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
  <Fragment>
    <FocusButton />
    <TextBox />
  </Fragment>
);
```

### PropagationScope

The `PropagationScope` component allows you to create isolated scopes for propagation. This is useful when you want to limit the scope of propagation to a specific part of your component tree.

Here's an example of how to use `PropagationScope`:

```tsx
import { createPropagation } from 'use-propagate';

const { useListen, usePropagate, PropagationScope } = createPropagation<string>();

const ParentComponent = () => {
  return (
    <div>
      <PropagationScope>
        <ChildComponent1 />
        <ChildComponent2 />
      </PropagationScope>
      <ChildComponent3 />
    </div>
  );
};

const ChildComponent1 = () => {
  const propagate = usePropagate();
  
  return <button onClick={() => propagate('Hello')}>Say Hello</button>;
};

const ChildComponent2 = () => {
  useListen((message) => {
    console.log('ChildComponent2 received:', message);
  });

  return <div>Child 2</div>;
};

const ChildComponent3 = () => {
  useListen((message) => {
    console.log('ChildComponent3 received:', message);
  });

  return <div>Child 3</div>;
};
```

In this example:

- `ChildComponent1` and `ChildComponent2` are wrapped in a `PropagationScope`.
- When the button in `ChildComponent1` is clicked, it will propagate the message "Hello".
- `ChildComponent2` will receive this message and log it.
- `ChildComponent3`, which is outside the `PropagationScope`, will not receive the message.

Using `PropagationScope` allows you to create multiple isolated propagation contexts within your application. This can be particularly useful in larger applications where you want to avoid unintended propagation between different parts of your component tree.

Note that `useListen` and `usePropagate` will use the nearest `PropagationScope` in the component tree. If there's no `PropagationScope` ancestor, they will use a default global scope.

## API

```ts
export function createPropagation<T>(options?: { allowPropagateDuringRender?: boolean }): {
  PropagationScope: React.ComponentType<{ children?: React.ReactNode | undefined }>;
  useListen: (callback: (value: T) => void) => void;
  usePropagate: () => (value: T) => void;
};
```

## Behaviors

### Why not passing values via `useContext`?

When propagating a value via `useContext`, subscribing nodes will be re-rendered. This behavior may not be desirable for events and certain type of scenarios.

### Why I should not call propagate callback function during render-time?

When the propagate callback function is called during rendering, a warning message will be printed and propagation will be stopped.

This is a safety measure to prevent multiple re-render and potential deadlock situation if listeners save the value to a state and trigger another re-render.

If listeners are controlled and would never trigger re-render, you can pass `allowPropagateDuringRender: true` option to ignore this safety measure.

### How to get response from the listener or wait for the listener to complete?

Modifies the passing value by following the [`FetchEvent.respondWith`](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith) or [`ExtendableEvent.waitUntil`](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil) pattern.

### How to re-render when triggered?

Use the following code snippet to save the value to a state, which will re-render the component.

```tsx
const MyComponent = () => {
  const [value, setValue] = useState<number>();

  // When triggered, saves the value to state.
  useListen(setValue);

  return <p>The value is {value}.</p>;
};
```

Please make sure the propagate callback function is not called during render as it could cause multiple re-render and potential deadlock situation.

## Contributions

Like us? [Star](https://github.com/compulim/use-propagate/stargazers) us.

Want to make it better? [File](https://github.com/compulim/use-propagate/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/use-propagate/pulls) a pull request.
