import { act } from '@compulim/test-harness/act';
import { cleanup, render, type RenderResult } from '@compulim/test-harness/render';
import { renderHook } from '@compulim/test-harness/renderHook';
import { expect } from 'expect';
import { afterEach, beforeEach, describe, mock, test, type Mock } from 'node:test';
import React, { Fragment, useCallback, useState, type ComponentType } from 'react';

import createPropagation from './createPropagation.tsx';

type Props = { value?: number | undefined };

afterEach(() => cleanup());

describe('A propagation', () => {
  let useListen: ReturnType<typeof createPropagation<number>>['useListen'];
  let usePropagate: ReturnType<typeof createPropagation<number>>['usePropagate'];

  beforeEach(() => {
    ({ useListen, usePropagate } = createPropagation<number>());
  });

  describe('when render initially', () => {
    let listener: Mock<(value: number) => void>;
    let propagate: (value: number) => void;

    beforeEach(() => {
      listener = mock.fn();

      renderHook<void, Props>(() => {
        propagate = usePropagate();

        useListen(listener);
      });
    });

    test('listener should not fire', () => expect(listener.mock.callCount()).toBe(0));

    describe('when usePropagate() is called', () => {
      beforeEach(() => act(() => propagate(123)));

      test('listener should be called once', () => expect(listener.mock.callCount()).toBe(1));
      test('listener should have been called with the value', () =>
        expect(listener.mock.calls[0]?.arguments).toEqual([123]));
    });
  });

  describe('when 2 children listening', () => {
    let count: number;
    let fns: [Mock<(value: number) => void>, Mock<(value: number) => void>];
    let Listener: ComponentType<{ index: 0 | 1 }>;
    let Propagator: ComponentType<object>;

    beforeEach(() => {
      count = 0;
      fns = [mock.fn<(value: number) => void>(), mock.fn<(value: number) => void>()];

      Listener = ({ index }: { index: 0 | 1 }) => {
        useListen(value => fns[index](value));

        return null;
      };

      Propagator = () => {
        const propagate = usePropagate();
        const handleClick = useCallback(() => propagate(++count), [propagate]);

        return <button data-testid="propagator" type="button" onClick={handleClick} />;
      };
    });

    describe('when render initially', () => {
      let result: RenderResult;

      beforeEach(() => {
        result = render(
          <Fragment>
            <Propagator />
            <Listener index={0} />
            <Listener index={1} />
          </Fragment>
        );
      });

      test('listeners should not be called', () => {
        expect(fns[0].mock.callCount()).toBe(0);
        expect(fns[1].mock.callCount()).toBe(0);
      });

      describe('when usePropagate is called', () => {
        beforeEach(() => act(() => result.queryByTestId('propagator')?.click()));

        test('listeners should be called once', () => {
          expect(fns[0].mock.callCount()).toBe(1);
          expect(fns[0].mock.calls[0]?.arguments).toEqual([1]);

          expect(fns[1].mock.callCount()).toBe(1);
          expect(fns[1].mock.calls[0]?.arguments).toEqual([1]);
        });

        describe('when a child is unmounted', () => {
          beforeEach(() =>
            result.rerender(
              <Fragment>
                <Propagator />
                <Listener index={0} />
              </Fragment>
            )
          );

          describe('when usePropagate is called again', () => {
            beforeEach(() => act(() => result.queryByTestId('propagator')?.click()));

            test('mounted listener should be called again', () => {
              expect(fns[0].mock.callCount()).toBe(2);
              expect(fns[0].mock.calls[1]?.arguments).toEqual([2]);
            });

            test('unmounted listener should not be called', () => {
              expect(fns[1].mock.callCount()).toBe(1);
            });
          });
        });
      });
    });
  });

  describe('when propagated during render-time', () => {
    let listener: Mock<(value: number) => void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let spy: Mock<(...data: any[]) => void>;

    beforeEach(() => {
      spy = mock.method(console, 'warn');
      spy.mock.mockImplementation(() => {});
      listener = mock.fn<(value: number) => void>();

      renderHook<void, Props>(() => {
        useListen(listener);
        usePropagate()(123);
      });
    });

    afterEach(() => spy.mock.restore());

    test('should warn', () => {
      expect(spy.mock.callCount()).toBe(1);
      expect(spy.mock.calls[0]?.arguments).toEqual([expect.stringMatching(/^use-propagate:\s/u)]);
    });

    test('should not call listener', () => expect(listener.mock.callCount()).toBe(0));
  });

  describe('when using PropagationScope', () => {
    let { PropagationScope, useListen, usePropagate } = createPropagation();

    beforeEach(() => {
      ({ PropagationScope, useListen, usePropagate } = createPropagation({ allowPropagateDuringRender: true }));
    });

    test('listeners in different scopes should not interfere', () => {
      const listener1 = mock.fn();
      const listener2 = mock.fn();

      const Component = ({ scopeId }: Readonly<{ scopeId: number }>) => {
        const propagate = usePropagate();
        useListen(scopeId === 1 ? listener1 : listener2);

        return (
          <button data-testid={`button-${scopeId}`} onClick={() => propagate(scopeId)}>
            Propagate {scopeId}
          </button>
        );
      };

      const { getByTestId } = render(
        <Fragment>
          <PropagationScope>
            <Component scopeId={1} />
          </PropagationScope>
          <PropagationScope>
            <Component scopeId={2} />
          </PropagationScope>
        </Fragment>
      );

      act(() => {
        getByTestId('button-1').click();
      });

      expect(listener1.mock.callCount()).toBe(1);
      expect(listener1.mock.callCount()).toBe(1);
      expect(listener2.mock.callCount()).toBe(0);

      act(() => {
        getByTestId('button-2').click();
      });

      expect(listener1.mock.callCount()).toBe(1);
      expect(listener2.mock.callCount()).toBe(1);
      expect(listener2.mock.calls[0]?.arguments).toEqual([2]);
    });

    test('multiple listeners in the same scope all receive propagated values', () => {
      const listener1 = mock.fn();
      const listener2 = mock.fn();
      const listener3 = mock.fn();

      const Component = () => {
        useListen(listener1);
        useListen(listener2);
        useListen(listener3);
        const propagate = usePropagate();

        return <button onClick={() => propagate('test')}>Propagate</button>;
      };

      const { getByText } = render(
        <PropagationScope>
          <Component />
        </PropagationScope>
      );

      act(() => {
        getByText('Propagate').click();
      });

      expect(listener1.mock.calls[0]?.arguments).toEqual(['test']);
      expect(listener2.mock.calls[0]?.arguments).toEqual(['test']);
      expect(listener3.mock.calls[0]?.arguments).toEqual(['test']);
    });

    test('nested PropagationScopes should work independently', () => {
      const outerListener = mock.fn();
      const innerListener = mock.fn();

      const OuterComponent = () => {
        const propagate = usePropagate();
        useListen(outerListener);

        return (
          <div>
            <button data-testid="outer-button" onClick={() => propagate('outer')}>
              Outer Propagate
            </button>
            <PropagationScope>
              <InnerComponent />
            </PropagationScope>
          </div>
        );
      };

      const InnerComponent = () => {
        const propagate = usePropagate();
        useListen(innerListener);

        return (
          <button data-testid="inner-button" onClick={() => propagate('inner')}>
            Inner Propagate
          </button>
        );
      };

      const { getByTestId } = render(
        <PropagationScope>
          <OuterComponent />
        </PropagationScope>
      );

      act(() => {
        getByTestId('outer-button').click();
      });

      expect(outerListener.mock.callCount()).toBe(1);
      expect(outerListener.mock.calls[0]?.arguments).toEqual(['outer']);
      expect(innerListener.mock.callCount()).toBe(0);

      act(() => {
        getByTestId('inner-button').click();
      });

      expect(outerListener.mock.callCount()).toBe(1);
      expect(innerListener.mock.callCount()).toBe(1);
      expect(innerListener.mock.calls[0]?.arguments).toEqual(['inner']);
    });

    test('listeners should be cleaned up when components unmount', () => {
      const listener = mock.fn();

      const ChildComponent = () => {
        useListen(listener);
        return <div>Child Component</div>;
      };

      const ParentComponent = () => {
        const [showChild, setShowChild] = useState(true);
        const propagate = usePropagate();

        return (
          <div>
            <button onClick={() => setShowChild(!showChild)}>Toggle Child</button>
            <button onClick={() => propagate('test')}>Propagate</button>
            {showChild && <ChildComponent />}
          </div>
        );
      };

      const { getByText } = render(
        <PropagationScope>
          <ParentComponent />
        </PropagationScope>
      );

      // Initial propagation, child is mounted
      act(() => {
        getByText('Propagate').click();
      });
      expect(listener.mock.callCount()).toBe(1);
      expect(listener.mock.calls[0]?.arguments).toEqual(['test']);

      // Unmount the child
      act(() => {
        getByText('Toggle Child').click();
      });

      // Reset the mock to clear previous calls
      listener.mock.resetCalls();

      // Propagate again, child is unmounted
      act(() => {
        getByText('Propagate').click();
      });

      // Listener should not be called as the component is unmounted
      expect(listener.mock.callCount()).toBe(0);
    });

    test('usePropagate should return stable function reference', () => {
      const propagateRefs: Array<(value: number) => void> = [];

      const Component = () => {
        const propagate = usePropagate();
        propagateRefs.push(propagate);
        return null;
      };

      const { rerender } = render(
        <PropagationScope>
          <Component />
        </PropagationScope>
      );

      // Force re-render
      rerender(
        <PropagationScope>
          <Component />
        </PropagationScope>
      );

      // The function reference should be stable across re-renders
      expect(propagateRefs[0]).toBe(propagateRefs[1]);
    });
  });
});

describe('A propagation with allowPropagateDuringRender set to true', () => {
  let useListen: ReturnType<typeof createPropagation<number>>['useListen'];
  let usePropagate: ReturnType<typeof createPropagation<number>>['usePropagate'];

  beforeEach(() => {
    ({ useListen, usePropagate } = createPropagation<number>({ allowPropagateDuringRender: true }));
  });

  describe('when propagated during render-time', () => {
    let listener: Mock<(value: number) => void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let spy: Mock<(...data: any[]) => void>;

    beforeEach(() => {
      spy = mock.method(console, 'warn');
      spy.mock.mockImplementation(() => {});
      listener = mock.fn<(value: number) => void>();

      renderHook<void, Props>(() => {
        useListen(listener);
        usePropagate()(123);
      });
    });

    afterEach(() => spy.mock.restore());

    test('should not warn', () => expect(spy.mock.callCount()).toBe(0));
    test('should have called the listener', () => {
      expect(listener.mock.callCount()).toBe(1);
      expect(listener.mock.calls[0]?.arguments).toEqual([123]);
    });
  });
});
