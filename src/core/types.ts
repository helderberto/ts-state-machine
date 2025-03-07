// Structure of possible actions to be send to the machine
export interface Action<T = string> {
  // Type of action
  type: T;

  // Additional data that can be send with the action
  payload?: any;
}

// Structure of a reducer - function that calculates the next state
export interface Reducer<TState, TActionType = string> {
  // Receiving the current state and an action, returns the new state
  (state: TState, action: Action<TActionType>): TState;
}

// Listener function that will be caled when a state changes
export interface Listener {
  (): void;
}

// Contract that every State Machine should implement
export interface Machine<TState, TActionType = string> {
  // Returns the current state
  getState(): TState;

  // Process an action and updates the state
  dispatch(action: Action<TActionType>): void;

  // Register a listener to change the state
  subscribe(listener: Listener): () => void;
}
