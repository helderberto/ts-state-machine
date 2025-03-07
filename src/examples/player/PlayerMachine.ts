// Possible states
export type PlayerState =
  | 'idle' // initial state, video not loaded
  | 'loading' // Loading video
  | 'ready' // Ready to reproduce
  | 'playing' // Reproducing
  | 'paused' // Video is paused
  | 'error'; // Player error

// Events the player can handle
export type PlayerEvent =
  | { type: 'LOAD'; payload: { videoUrl: string } }
  | { type: 'LOADED' }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'ERROR'; payload: { message: string } }
  | { type: 'RETRY' };

// Player Context
export interface PlayerContext {
  videoUrl?: string;
  error?: string;
  duration?: number;
  currentTime?: number;
}

export class PlayerMachine {
  private state: {
    value: PlayerState;
    context: PlayerContext;
  };

  constructor() {
    this.state = {
      value: 'idle',
      context: {
        currentTime: 0,
      },
    };
  }

  public getState() {
    // Returns a copy, to avoid external mutation
    return { ...this.state };
  }

  public transition(event: PlayerEvent): void {
    const { value: currentState, context } = this.state;

    switch (currentState) {
      case 'idle': {
        if (event.type === 'LOAD') {
          this.state = {
            value: 'loading',
            context: {
              ...context,
              videoUrl: event.payload.videoUrl,
              error: undefined,
            },
          };
        }
        break;
      }

      case 'loading': {
        if (event.type === 'LOADED') {
          this.state = {
            value: 'ready',
            context,
          };
        }

        if (event.type === 'ERROR') {
          this.state = {
            value: 'error',
            context: {
              ...context,
              error: event.payload.message,
            },
          };
        }
        break;
      }

      case 'ready': {
        if (event.type === 'PLAY') {
          this.state = {
            value: 'playing',
            context,
          };
        }
        break;
      }

      case 'playing': {
        if (event.type === 'PAUSE') {
          this.state = {
            value: 'paused',
            context,
          };
        }
        if (event.type === 'ERROR') {
          this.state = {
            value: 'error',
            context: {
              ...context,
              error: event.payload.message,
            },
          };
        }
        break;
      }

      case 'paused': {
        if (event.type === 'PLAY') {
          this.state = {
            value: 'playing',
            context,
          };
        }
        break;
      }

      case 'error': {
        if (event.type === 'RETRY') {
          if (context.videoUrl) {
            this.state = {
              value: 'loading',
              context: {
                ...context,
                error: undefined,
              },
            };
          } else {
            this.state = {
              value: 'idle',
              context: {
                currentTime: 0,
              },
            };
          }
        }
        break;
      }
    }
  }
}
