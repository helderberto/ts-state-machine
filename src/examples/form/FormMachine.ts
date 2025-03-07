import { SimpleMachine } from '../../core/SimpleMachine';
import { actions, ActionType, FormAction, FormState, VALID_FIELDS } from './types';

const validators = {
  name: (value: string) => {
    if (!value) return 'Name is required';
    if (value.length < 3) return 'Name should be greater than 3 characters';
    return '';
  },

  email: (value: string) => {
    if (!value) return 'Email is required';
    if (!value.includes('@')) return 'Invalid email';
    return '';
  },

  password: (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password should be greater than 6 characters';
    return '';
  },
};

// Initial form state
export const initialState: FormState = {
  data: {
    name: '',
    email: '',
    password: '',
  },
  errors: {},
  isValid: false,
  isSubmitting: false,
  step: 'name',
};

// Form reducer
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case actions.updateField: {
      const { field, value } = action.payload || {};
      if (!field || !VALID_FIELDS.includes(field) || value === undefined) {
        return state;
      }

      return {
        ...state,
        data: {
          ...state.data,
          [field]: value,
        },
      };
    }

    case actions.validateField: {
      const { field } = action.payload || {};
      if (!field) return state;

      const value = state.data[field];
      const error = validators[field](value);

      return {
        ...state,
        errors: {
          ...state.errors,
          [field]: error,
        },
        isValid: !error,
      };
    }

    case actions.nextStep: {
      const steps: FormState['step'][] = ['name', 'email', 'password', 'review', 'success'];
      const currentIndex = steps.indexOf(state.step);

      if (currentIndex < steps.length - 1) {
        return {
          ...state,
          step: steps[currentIndex + 1],
        };
      }
      return state;
    }

    case actions.previousStep: {
      const steps: FormState['step'][] = ['name', 'email', 'password', 'review', 'success'];
      const currentIndex = steps.indexOf(state.step);

      if (currentIndex > 0) {
        return {
          ...state,
          step: steps[currentIndex - 1],
        };
      }
      return state;
    }

    case actions.submit: {
      return {
        ...state,
        isSubmitting: true,
      };
    }

    case actions.submitSuccess: {
      return {
        ...state,
        isSubmitting: false,
        step: 'success',
      };
    }

    case actions.reset: {
      return initialState;
    }

    default:
      return state;
  }
}

// Exporting the state machine
export const formMachine = new SimpleMachine<FormState, ActionType>(initialState, formReducer);
