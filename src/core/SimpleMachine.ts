import type { Action, Listener, Machine, Reducer } from './types';

// Base implementation of a state machine
export class SimpleMachine<TState> implements Machine<TState> {
  // Current machine state
  private state: TState;

  // Function to process state changes
  private reducer: Reducer<TState>;

  // Array of functions to be called when a state changes
  private listeners: Listener[] = [];

  constructor(initialState: TState, reducer: Reducer<TState>) {
    this.state = initialState;
    this.reducer = reducer;
  }

  // Returns a copu of the current state
  public getState(): TState {
    return this.state;
  }

  // Notifies all the registered listeners
  public notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // Process an action and updates the state if necessary
  public dispatch(action: Action): void {
    // Evaluates the next state using the reducer
    const nextState = this.reducer(this.state, action);

    // Only updates the state if it really changed
    if (nextState !== this.state) {
      this.state = nextState;
      this.notify();
    }
  }

  // Register a function to be called when a state changes
  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);

    // Returns a function to remove the listener
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}
