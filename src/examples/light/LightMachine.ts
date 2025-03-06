// All possible states for a bulb
type LightState = 'on' | 'off'

// Possible events
type LightEvent = {
  type: 'TOGGLE'
}

// Context for additional data
type LightContext = {
  timesTurnedOn: number;
}

export class LightMachine {
  private state: LightState;
  private context: LightContext;

  constructor() {
    // Initial state
    this.state = 'off';
    this.context = {
      timesTurnedOn: 0
    }
  }

  // Get current state
  public getState() {
    return {
      value: this.state,
      context: this.context
    }
  }

  // Handle transitions
  public transition(event: LightEvent) {
    switch (this.state) {
      case 'off': {
        if (event.type === 'TOGGLE') {
          this.state = 'on';
          this.context.timesTurnedOn += 1;
        }
        break;
      }

      case 'on': {
        if (event.type === 'TOGGLE') {
          this.state = 'off';
        }
        break;
      }
    }
  }
}

