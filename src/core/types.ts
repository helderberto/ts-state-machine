// Structure of possible actions to be send to the machine
export interface Action {
  // Type of action
  type: string;

  // Additional data that can be send with the action
  payload?: any;
}

// Structure of a reducer - function that calculates the next state
export interface Reducer<TState> {
  // Receiving the current state and an action, returns the new state
  (state: TState, action: Action): TState;
}

// Listener function that will be caled when a state changes
export interface Listener {
  (): void;
}

// Contract that every State Machine should implement
export interface Machine<TState> {
  // Returns the current state
  getState(): TState;

  // Process an action and updates the state
  dispatch(action: Action): void;

  // Register a listener to change the state
  subscribe(listener: Listener): () => void;
}
