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
        confirmBaseLocaleSwitch:
            'Changing the base locale to {{locale}} will delete the existing translation for that locale. Continue?',
        fields: {
            locale: 'Locale',
            name: 'Project name',
            summary: 'Summary',
            description: 'Description',
        },
        placeholders: {
            name: 'Translated project name',
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
    },
    fields: {
        locale: {
            label: 'Base locale',
            placeholder: 'Select a locale',
        },
    },
};
