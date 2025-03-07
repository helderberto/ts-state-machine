import { Action } from '../../core/types';

export interface FormData {
  name: string;
  email: string;
  password: string;
}

export const VALID_FIELDS: Array<keyof FormData> = ['name', 'email', 'password'];

export interface FormState {
  data: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  isValid: boolean;
  isSubmitting: boolean;
  step: 'name' | 'email' | 'password' | 'review' | 'success';
}

export const actions = {
  updateField: 'UPDATE_FIELD',
  validateField: 'VALIDATE_FIELD',
  nextStep: 'NEXT_STEP',
  previousStep: 'PREVIOUS_STEP',
  submit: 'SUBMIT',
  submitSuccess: 'SUBMIT_SUCCESS',
  reset: 'RESET',
} as const;

export type ActionType = (typeof actions)[keyof typeof actions];

export interface FormAction extends Action<ActionType> {
  payload?: {
    field?: keyof FormData;
    value?: string;
  };
}
