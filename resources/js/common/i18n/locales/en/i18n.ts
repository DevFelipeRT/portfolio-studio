import type { TranslationTree } from '../../core/types';

const i18n: TranslationTree = {
    languageSwitcher: {
        ariaLabel: 'Change language (current: {{locale}})',
        label: 'Language',
    },

    locales: {
        en: { label: 'English', short: 'en' },
        pt_BR: { label: 'Português (Brasil)', short: 'pt_BR' },
    },
};

export default i18n;

