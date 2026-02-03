export default {
    translations: {
        title: 'Translations',
        subtitle: 'Manage translations for',
        manage: 'Manage translations',
        existing: 'Existing translations',
        empty: 'No translations yet.',
        add: 'Add translation',
        allCovered: 'All supported locales already have translations.',
        loading: 'Loading translations...',
        confirmDelete: 'Delete translation for {{locale}}?',
        fields: {
            locale: 'Locale',
            position: 'Position',
            company: 'Company',
            summary: 'Summary',
            description: 'Description',
        },
        placeholders: {
            position: 'Translated position title',
            company: 'Translated company name',
            summary: 'Translated summary',
            description: 'Translated description',
        },
        actions: {
            save: 'Save',
            add: 'Add',
            close: 'Close',
        },
        errors: {
            localeRequired: 'Select a locale.',
            atLeastOne: 'Provide at least one translated field.',
        },
        confirmBaseLocaleSwitch: 'Changing the base locale to {{locale}} will delete the existing translation for that locale. Continue?',
    },
    fields: {
        locale: {
            label: 'Base locale',
            placeholder: 'Select a locale',
        },
    },
};
