import React, { Fragment, useCallback, useRef } from 'react';
import { createPropagation } from 'use-propagate';

const { useListen, usePropagate } = createPropagation<void>();

const FocusButton = () => {
  const propagate = usePropagate();

  const handleClick = useCallback(() => propagate(), [propagate]);

  return (
    <button autoFocus={true} onClick={handleClick}>
      Tap to focus to the text box
    </button>
  );
};

const TextBox = () => {
  const ref = useRef<HTMLInputElement>(null);

  const handleListen = useCallback(() => ref.current?.focus(), [ref]);

  useListen(handleListen);

  return <input ref={ref} type="text" />;
};

const App = () => (
  <Fragment>
    <FocusButton />
    <TextBox />
  </Fragment>
);

export default App;
