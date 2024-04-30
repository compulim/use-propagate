/** @jest-environment jsdom */

import { render, type RenderResult } from '@testing-library/react';
import React, { Fragment, useCallback, type ComponentType } from 'react';

import createPropagation from './createPropagation';

const act: (fn: () => void) => void =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@testing-library/react').renderHook ||
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@testing-library/react-hooks').renderHook;

type RenderHookResult<T, P> = { rerender: (props?: P) => void; result: { current: T } };

const renderHook: <T, P>(render: (props: P) => T, options?: { initialProps: P }) => RenderHookResult<T, P> =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@testing-library/react').renderHook ||
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@testing-library/react-hooks').renderHook;

type Props = { value?: number | undefined };

describe('A propagation', () => {
  let useListen: ReturnType<typeof createPropagation<number>>['useListen'];
  let usePropagate: ReturnType<typeof createPropagation<number>>['usePropagate'];

  beforeEach(() => {
    ({ useListen, usePropagate } = createPropagation<number>());
  });

  describe('when render initially', () => {
    let listener: jest.Mock<void, [number]>;
    let propagate: (value: number) => void;

    beforeEach(() => {
      listener = jest.fn<void, [number]>();

      renderHook<void, Props>(() => {
        propagate = usePropagate();

        useListen(listener);
      });
    });

    test('listener should not fire', () => expect(listener).toHaveBeenCalledTimes(0));

    describe('when usePropagate() is called', () => {
      beforeEach(() => act(() => propagate(123)));

      test('listener should be called once', () => expect(listener).toHaveBeenCalledTimes(1));
      test('listener should have been called with the value', () => expect(listener).toHaveBeenNthCalledWith(1, 123));
    });
  });

  describe('when 2 children listening', () => {
    let count: number;
    let fns: [jest.Mock<void, [number]>, jest.Mock<void, [number]>];
    let Listener: ComponentType<{ index: 0 | 1 }>;
    let Propagator: ComponentType<object>;

    beforeEach(() => {
      count = 0;
      fns = [jest.fn<void, [number]>(), jest.fn<void, [number]>()];

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
        expect(fns[0]).toHaveBeenCalledTimes(0);
        expect(fns[1]).toHaveBeenCalledTimes(0);
      });

      describe('when usePropagate is called', () => {
        beforeEach(() => act(() => result.queryByTestId('propagator')?.click()));

        test('listeners should be called once', () => {
          expect(fns[0]).toHaveBeenCalledTimes(1);
          expect(fns[0]).toHaveBeenNthCalledWith(1, 1);

          expect(fns[1]).toHaveBeenCalledTimes(1);
          expect(fns[1]).toHaveBeenNthCalledWith(1, 1);
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
              expect(fns[0]).toHaveBeenCalledTimes(2);
              expect(fns[0]).toHaveBeenNthCalledWith(2, 2);
            });

            test('unmounted listener should not be called', () => {
              expect(fns[1]).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
    });
  });

  describe('when propagated during render-time', () => {
    let listener: jest.Mock<void, [number]>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let spy: jest.SpyInstance<void, any[], any>;

    beforeEach(() => {
      spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      listener = jest.fn<void, [number]>();

      renderHook<void, Props>(() => {
        useListen(listener);
        usePropagate()(123);
      });
    });

    afterEach(() => spy.mockRestore());

    test('should warn', () => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenNthCalledWith(1, expect.stringMatching(/^use-propagate:\s/u));
    });

    test('should not call listener', () => expect(listener).toHaveBeenCalledTimes(0));
  });
});

describe('A propagation with allowPropagateDuringRender set to true', () => {
  let useListen: ReturnType<typeof createPropagation<number>>['useListen'];
  let usePropagate: ReturnType<typeof createPropagation<number>>['usePropagate'];

  beforeEach(() => {
    ({ useListen, usePropagate } = createPropagation<number>({ allowPropagateDuringRender: true }));
  });

  describe('when propagated during render-time', () => {
    let listener: jest.Mock<void, [number]>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let spy: jest.SpyInstance<void, any[], any>;

    beforeEach(() => {
      spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      listener = jest.fn<void, [number]>();

      renderHook<void, Props>(() => {
        useListen(listener);
        usePropagate()(123);
      });
    });

    afterEach(() => spy.mockRestore());

    test('should not warn', () => expect(spy).toHaveBeenCalledTimes(0));
    test('should have called the listener', () => {
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenNthCalledWith(1, 123);
    });
  });
});
