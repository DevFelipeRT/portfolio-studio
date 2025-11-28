import type { TranslationTree } from '../../core/types';

const common: TranslationTree = {
    languageSwitcher: {
        ariaLabel: 'Change language (current: {{locale}})',
        label: 'Language',
    },

    themeToggle: {
        label: 'Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
    },

    navigation: {
        skipToContent: 'Skip to main content',
        openMenu: 'Open navigation menu',
        closeMenu: 'Close navigation menu',
        openUserMenu: 'Open user menu',
        closeUserMenu: 'Close user menu',
        openSidebar: 'Open sidebar',
        closeSidebar: 'Close sidebar',
    },

    accessibility: {
        openDialog: 'Open dialog',
        closeDialog: 'Close dialog',
        expandSection: 'Expand section',
        collapseSection: 'Collapse section',
    },

    actions: {
        save: 'Save',
        cancel: 'Cancel',
        close: 'Close',
        edit: 'Edit',
        delete: 'Delete',
        submit: 'Submit',
        view: 'View',
        viewMore: 'View more',
        viewDetails: 'View details',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        tryAgain: 'Try again',
        refresh: 'Refresh',
        reset: 'Reset',
        clear: 'Clear',
        apply: 'Apply',
        copy: 'Copy',
        copyLink: 'Copy link',
        share: 'Share',
        download: 'Download',
        openExternal: 'Open in a new tab',
        confirm: 'Confirm',
        dismiss: 'Dismiss',
    },

    state: {
        loading: 'Loading…',
        loadingContent: 'Loading content…',
        empty: 'Nothing to display yet.',
        noResults: 'No results found.',
        error: 'Something went wrong.',
        success: 'Operation completed successfully.',
        offline: 'You appear to be offline.',
        unauthorized: 'You do not have permission to perform this action.',
        notFound: 'The requested resource was not found.',
    },

    labels: {
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        optional: 'Optional',
        required: 'Required',
        name: 'Name',
        fullName: 'Full name',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm password',
        search: 'Search',
        filters: 'Filters',
        status: 'Status',
        createdAt: 'Created at',
        updatedAt: 'Updated at',
        actions: 'Actions',
        description: 'Description',
        details: 'Details',
        type: 'Type',
        category: 'Category',
        language: 'Language',
    },

    feedback: {
        saved: 'Changes have been saved.',
        created: 'Item has been created.',
        updated: 'Information has been updated.',
        deleted: 'The item has been removed.',
        sent: 'Your message has been sent.',
        copied: 'Copied to clipboard.',
        linkCopied: 'Link copied to clipboard.',
        genericError: 'Unable to complete the operation. Please try again.',
    },

    validation: {
        required: 'This field is required.',
        invalidEmail: 'Enter a valid email address.',
        minLength: 'Use at least {{min}} characters.',
        maxLength: 'Use at most {{max}} characters.',
        betweenLength: 'Use between {{min}} and {{max}} characters.',
        pattern: 'The value does not match the required format.',
        oneOf: 'Select one of the available options.',
        mismatch: 'The values do not match.',
    },

    pagination: {
        label: 'Pagination',
        previousPage: 'Previous page',
        nextPage: 'Next page',
        pageOf: 'Page {{page}} of {{total}}',
        results: '{{count}} results',
        resultsWithRange: '{{from}}–{{to}} of {{total}} results',
        itemsPerPage: 'Items per page',
    },

    dateTime: {
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
        justNow: 'Just now',
        minutesAgo: '{{count}} minutes ago',
        hoursAgo: '{{count}} hours ago',
        daysAgo: '{{count}} days ago',
    },

    form: {
        submit: 'Submit',
        reset: 'Reset form',
        clear: 'Clear fields',
        optionalHint: 'Optional field',
        requiredHint: 'Required field',
        searchPlaceholder: 'Type to search…',
        selectPlaceholder: 'Select an option',
        multiSelectPlaceholder: 'Select one or more options',
    },

    table: {
        empty: 'No records to display.',
        loading: 'Loading rows…',
        sortAscending: 'Sort ascending',
        sortDescending: 'Sort descending',
        noSortableColumns: 'Sorting is not available for this table.',
    },

    dialog: {
        confirmTitle: 'Confirm action',
        confirmMessage:
            'Are you sure you want to proceed? This operation cannot be undone.',
        confirmAction: 'Confirm',
        cancelAction: 'Cancel',
    },

    contact: {
        socials: {
            email: {
                label: 'Email',
            },
            github: {
                label: 'GitHub',
            },
            linkedin: {
                label: 'LinkedIn',
            },
            whatsapp: {
                label: 'WhatsApp',
            },
            phone: {
                label: 'Phone',
            },
        },
    },
};

export default common;
