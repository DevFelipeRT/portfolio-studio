export default {
    sections: {
        details: 'Course Details',
        timeline: 'Timeline',
        visibility: 'Portfolio Visibility',
    },
    fields: {
        name: {
            label: 'Course Title',
            placeholder: 'e.g., Advanced React Patterns',
            error: 'Course title is required',
        },
        institution: {
            label: 'Provider / Institution',
            placeholder: 'e.g., Udemy, Coursera, Harvard',
            error: 'Institution is required',
        },
        category: {
            label: 'Category',
            placeholder: 'Select a category',
            error: 'Category is required',
        },
        summary: {
            label: 'Summary',
            placeholder: 'Brief overview for cards and lists',
            error: 'Summary is required',
        },
        description: {
            label: 'Full Description',
            placeholder: 'Detailed syllabus or key learnings',
            error: 'Description is required',
        },
        started_at: {
            label: 'Start Date',
            error: 'Start date is invalid',
        },
        completed_at: {
            label: 'Completion Date',
            error: 'Completion date is invalid',
        },
        display: {
            label: 'Publicly visible on portfolio',
        },
    },
    actions: {
        cancel: 'Cancel',
        save: 'Save Entry',
        saving: 'Saving...',
    },
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
            name: 'Course title',
            institution: 'Provider / institution',
            summary: 'Summary',
            description: 'Full description',
        },
        placeholders: {
            name: 'Translated course title',
            institution: 'Translated provider',
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
};
