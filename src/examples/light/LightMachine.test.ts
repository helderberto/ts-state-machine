import { LightMachine } from './LightMachine';

describe('LightMachine', () => {
  it('should start in off state', () => {
    const lightMachine = new LightMachine();

    expect(lightMachine.getState()).toEqual({
      value: 'off',
      context: {
        timesTurnedOn: 0,
      },
    });
  });

  it('should toggle from off to on', () => {
    const lightMachine = new LightMachine();

    lightMachine.transition({ type: 'TOGGLE' })

    expect(lightMachine.getState()).toEqual({
      value: 'on',
      context: {
        timesTurnedOn: 1
      }
    })
  })

  it('should toggle from on to off', () => {
    const lightMachine = new LightMachine();

    // Turn on
    lightMachine.transition({ type: 'TOGGLE' });

    // Turn off
    lightMachine.transition({ type: 'TOGGLE' });

    expect(lightMachine.getState()).toEqual({
      value: 'off',
      context: {
        timesTurnedOn: 1
      }
    })
  })
});
