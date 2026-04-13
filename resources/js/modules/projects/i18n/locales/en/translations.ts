export default {
  title: 'Translations',
  subtitle: 'Manage translations for',
  manage: 'Manage translations',
  existing: 'Existing translations',
  empty: 'No translations yet.',
  add: 'Add translation',
  addPanelTitle: 'Add translation',
  editPanelTitle: 'Edit translation in {{locale}}',
  allCovered: 'All supported locales already have translations.',
  loading: 'Loading translations...',
  confirmDelete: 'Delete translation for {{locale}}?',
  confirmBaseLocaleSwitch:
    'Changing the base locale to {{locale}} will delete the existing translation for that locale. Continue?',
  fields: {
    locale: 'Translation locale',
    name: 'Translated name',
    summary: 'Translated summary',
    description: 'Translated description',
    status: 'Status',
  },
  placeholders: {
    locale: 'Choose the language for this translation',
    name: 'Use the project name as it should appear in this locale',
    summary: 'Write a short summary that sounds natural in this locale',
    description:
      'Adapt the full description to this locale while preserving context and intent',
    status: 'Translated status',
  },
  actions: {
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
  },
  errors: {
    localeRequired: 'Select a locale.',
    atLeastOne: 'Provide at least one translated field.',
    unexpected: 'Unexpected error. Please try again.',
  },
};
