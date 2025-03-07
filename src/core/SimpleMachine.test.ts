import { SimpleMachine } from './SimpleMachine';
import type { Action } from './types';

interface TestState {
  count: number;
  text: string;
}

const actions = {
  increment: 'INCREMENT',
  decrement: 'DECREMENT',
  setText: 'SET_TEXT',
  noChange: 'NO_CHANGE',
} as const;

describe('SimpleMachine', () => {
  // Helper to setup the tests
  function createTestMachine() {
    const initialState: TestState = {
      count: 0,
      text: '',
    };

    const reducer = (state: TestState, action: Action) => {
      switch (action.type) {
        case actions.increment: {
          return { ...state, count: state.count + 1 };
        }
        case actions.decrement: {
          return { ...state, count: state.count - 1 };
        }
        case actions.setText: {
          return { ...state, text: action.payload };
        }
        case actions.noChange: {
          return state;
        }
        default: {
          return state;
        }
      }
    };

    return new SimpleMachine(initialState, reducer);
  }

  describe('Initialization', () => {
    it('should initialize with the provided initial state', () => {
      const machine = createTestMachine();

      expect(machine.getState()).toEqual({
        count: 0,
        text: '',
      });
    });
  });

  describe('State Management', () => {
    it('should update state when dispatching a valid action', () => {
      const machine = createTestMachine();

      machine.dispatch({ type: actions.increment });

      expect(machine.getState().count).toBe(1);
    });

    it('should handle multiple state updates', () => {
      const machine = createTestMachine();

      machine.dispatch({ type: actions.increment });
      machine.dispatch({ type: actions.increment });
      machine.dispatch({ type: actions.decrement });

      expect(machine.getState().count).toBe(1);
    });

    it('should handle actions with payload', () => {
      const machine = createTestMachine();
      const testText = 'Hello, World!';

      machine.dispatch({ type: actions.setText, payload: testText });

      expect(machine.getState().text).toBe(testText);
    });

    it('should not modify state for unknown actions', () => {
      const machine = createTestMachine();
      const initialState = machine.getState();

      machine.dispatch({ type: 'UNKNOWN_ACTION' });

      expect(machine.getState()).toEqual(initialState);
    });

    it('should not notify listeners if state does not change', () => {
      const machine = createTestMachine();
      const listener = vi.fn();

      machine.subscribe(listener);
      machine.dispatch({ type: actions.noChange });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Listener System', () => {
    it('should notify listeners when state changes', () => {
      const machine = createTestMachine();
      const listener = vi.fn();

      machine.subscribe(listener);
      machine.dispatch({ type: actions.increment });

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should allow multiple listeners', () => {
      const machine = createTestMachine();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      machine.subscribe(listener1);
      machine.subscribe(listener2);

      machine.dispatch({ type: actions.increment });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should allow unsubscribing listeners', () => {
      const machine = createTestMachine();
      const listener = vi.fn();

      const unsubscribe = machine.subscribe(listener);
      machine.dispatch({ type: actions.increment });

      unsubscribe();
      machine.dispatch({ type: actions.increment });

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple subscriptions and unsubscriptions', () => {
      const machine = createTestMachine();
      const listeners = [vi.fn(), vi.fn(), vi.fn()];
      const unsubscribes = listeners.map((listener) => machine.subscribe(listener));

      machine.dispatch({ type: actions.increment });
      expect(listeners[0]).toHaveBeenCalledTimes(1);
      expect(listeners[1]).toHaveBeenCalledTimes(1);
      expect(listeners[2]).toHaveBeenCalledTimes(1);

      // Unsubscribe middle listener
      unsubscribes[1]();

      machine.dispatch({ type: actions.increment });
      expect(listeners[0]).toHaveBeenCalledTimes(2);
      expect(listeners[1]).toHaveBeenCalledTimes(1); // Still 1
      expect(listeners[2]).toHaveBeenCalledTimes(2);
    });

    it('should maintain correct listener order', () => {
      const machine = createTestMachine();
      const executionOrder: number[] = [];

      machine.subscribe(() => executionOrder.push(1));
      machine.subscribe(() => executionOrder.push(2));
      machine.subscribe(() => executionOrder.push(3));

      machine.dispatch({ type: actions.increment });

      expect(executionOrder).toEqual([1, 2, 3]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle subscribing the same listener multiple times', () => {
      const machine = createTestMachine();
      const listener = vi.fn();

      machine.subscribe(listener);
      machine.subscribe(listener); // Same listener again

      machine.dispatch({ type: actions.increment });

      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('should handle unsubscribing a non-existent listener', () => {
      const machine = createTestMachine();
      const listener = vi.fn();

      const unsubscribe = () => {
        machine.subscribe(listener)();
      };

      expect(unsubscribe).not.toThrow();
    });

    it('should handle multiple state changes', () => {
      const machine = createTestMachine();
      const listener = vi.fn();

      machine.subscribe(listener);

      machine.dispatch({ type: actions.increment });
      machine.dispatch({ type: actions.increment });
      machine.dispatch({ type: actions.decrement });
      machine.dispatch({ type: actions.setText, payload: 'test' });

      expect(listener).toHaveBeenCalledTimes(4);
    });
  });

  describe('Direct Notification', () => {
    it('should allow direct notification of listeners', () => {
      const machine = createTestMachine();
      const listener = vi.fn();

      machine.subscribe(listener);
      machine.notify();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});
