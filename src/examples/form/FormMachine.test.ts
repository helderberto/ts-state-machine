import { initialState as formInitialState, formMachine } from './FormMachine';
import { actions } from './types';

describe('FormMachine', () => {
  beforeEach(() => {
    // Reset the machine to the initial state before running each test case
    formMachine.dispatch({ type: actions.reset });
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const state = formMachine.getState();

      expect(state).toEqual(formInitialState);
    });
  });

  describe('Field Updates', () => {
    it('shuld update name field', () => {
      const testName = 'Helder Berto';
      formMachine.dispatch({
        type: actions.updateField,
        payload: {
          field: 'name',
          value: testName,
        },
      });

      const state = formMachine.getState();
      expect(state.data.name).toBe(testName);
    });

    it('should update email field', () => {
      formMachine.dispatch({
        type: actions.updateField,
        payload: { field: 'email', value: 'john@example.com' },
      });

      const state = formMachine.getState();
      expect(state.data.email).toBe('john@example.com');
    });

    it('should update password field', () => {
      formMachine.dispatch({
        type: actions.updateField,
        payload: { field: 'password', value: 'secret123' },
      });

      const state = formMachine.getState();
      expect(state.data.password).toBe('secret123');
    });

    it('should not update state for invalid field', () => {
      const initialState = formMachine.getState();

      formMachine.dispatch({
        type: actions.updateField,
        payload: { field: 'invalid' as any, value: 'test' },
      });

      const currentState = formMachine.getState();
      expect(currentState).toEqual(initialState);
    });
  });

  describe('Field Validation', () => {
    it('should validate name field - empty', () => {
      formMachine.dispatch({
        type: actions.validateField,
        payload: { field: 'name' },
      });

      const state = formMachine.getState();
      expect(state.errors.name).toBe('Name is required');
    });

    it('should validate name field - too short', () => {
      formMachine.dispatch({
        type: actions.updateField,
        payload: { field: 'name', value: 'Jo' },
      });

      formMachine.dispatch({
        type: actions.validateField,
        payload: { field: 'name' },
      });

      const state = formMachine.getState();
      expect(state.errors.name).toBe('Name should be greater than 3 characters');
    });

    it('should validate email field - invalid format', () => {
      formMachine.dispatch({
        type: actions.updateField,
        payload: { field: 'email', value: 'invalid-email' },
      });

      formMachine.dispatch({
        type: actions.validateField,
        payload: { field: 'email' },
      });

      const state = formMachine.getState();
      expect(state.errors.email).toBe('Invalid email');
    });

    it('should validate password field - too short', () => {
      formMachine.dispatch({
        type: actions.updateField,
        payload: { field: 'password', value: '123' },
      });

      formMachine.dispatch({
        type: actions.validateField,
        payload: { field: 'password' },
      });

      const state = formMachine.getState();
      expect(state.errors.password).toBe('Password should be greater than 6 characters');
    });

    it('should clear error when field becomes valid', () => {
      // Primeiro, criar um erro
      formMachine.dispatch({
        type: actions.updateField,
        payload: { field: 'name', value: 'Jo' },
      });

      formMachine.dispatch({
        type: actions.validateField,
        payload: { field: 'name' },
      });

      // Depois, corrigir o valor
      formMachine.dispatch({
        type: actions.updateField,
        payload: { field: 'name', value: 'John Doe' },
      });

      formMachine.dispatch({
        type: actions.validateField,
        payload: { field: 'name' },
      });

      const state = formMachine.getState();
      expect(state.errors.name).toBe('');
    });
  });
});
