import type { TranslationTree } from '../../types';

const validation: TranslationTree = {
    required: 'Este campo é obrigatório.',
    invalidEmail: 'Informe um endereço de e-mail válido.',
    minLength: 'Use pelo menos {{min}} caracteres.',
    maxLength: 'Use no máximo {{max}} caracteres.',
    betweenLength: 'Use entre {{min}} e {{max}} caracteres.',
    pattern: 'O valor não corresponde ao formato esperado.',
    oneOf: 'Selecione uma das opções disponíveis.',
    mismatch: 'Os valores não correspondem.',
};

export default validation;
