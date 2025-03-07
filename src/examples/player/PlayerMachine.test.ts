import { PlayerMachine } from './PlayerMachine';

describe('PlayerMachine', () => {
  it('should initialize in idle state', () => {
    const machine = new PlayerMachine();
    expect(machine.getState().value).toBe('idle');
  });

  it('should transition from idle to loading when LOAD event is received', () => {
    const machine = new PlayerMachine();
    const videoUrl = 'https://example.com/video.mp4';

    machine.transition({ type: 'LOAD', payload: { videoUrl } });

    expect(machine.getState().value).toBe('loading');
    expect(machine.getState().context.videoUrl).toBe(videoUrl);
  });

  it('should transition from loading to ready when LOADED event is received', () => {
    const machine = new PlayerMachine();

    machine.transition({ type: 'LOAD', payload: { videoUrl: 'test.mp4' } });
    machine.transition({ type: 'LOADED' });

    expect(machine.getState().value).toBe('ready');
  });

  it('should handle error state and allow retry', () => {
    const machine = new PlayerMachine();
    const errorMessage = 'Failed to load video';

    machine.transition({ type: 'LOAD', payload: { videoUrl: 'test.mp4' } });
    machine.transition({ type: 'ERROR', payload: { message: errorMessage } });

    expect(machine.getState().value).toBe('error');
    expect(machine.getState().context.error).toBe(errorMessage);

    machine.transition({ type: 'RETRY' });
    expect(machine.getState().value).toBe('loading');
    expect(machine.getState().context.error).toBeUndefined();
  });

  it('should allow play/pause transitions', () => {
    const machine = new PlayerMachine();

    // Prepare player
    machine.transition({ type: 'LOAD', payload: { videoUrl: 'test.mp4' } });
    machine.transition({ type: 'LOADED' });

    // Playing
    machine.transition({ type: 'PLAY' });
    expect(machine.getState().value).toBe('playing');

    // Pausing
    machine.transition({ type: 'PAUSE' });
    expect(machine.getState().value).toBe('paused');
  });
});
