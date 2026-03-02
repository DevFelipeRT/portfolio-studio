import type { TranslationTree } from '../../core/types';

const validation: TranslationTree = {
    required: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    minLength: 'Use at least {{min}} characters.',
    maxLength: 'Use at most {{max}} characters.',
    betweenLength: 'Use between {{min}} and {{max}} characters.',
    pattern: 'The value does not match the required format.',
    oneOf: 'Select one of the available options.',
    mismatch: 'The values do not match.',
};

export default validation;
