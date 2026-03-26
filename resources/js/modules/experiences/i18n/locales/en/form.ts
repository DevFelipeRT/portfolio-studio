export default {
  fields: {
    locale: {
      label: 'Base locale',
      placeholder: 'Select a locale',
    },
    position: {
      label: 'Position',
    },
    company: {
      label: 'Company',
    },
    summary: {
      label: 'Summary',
    },
    description: {
      label: 'Description',
    },
    start_date: {
      label: 'Start date',
    },
    end_date: {
      label: 'End date',
    },
    display: {
      label: 'Display on portfolio',
    },
    visibility: {
      label: 'Visibility',
    },
    period: {
      label: 'Period',
    },
    created_at: {
      label: 'Created at',
    },
    updated_at: {
      label: 'Updated at',
    },
    actions: {
      label: 'Actions',
    },
  },
  help: {
    managementSubtitle:
      'Manage the experiences displayed on your portfolio and resume sections.',
  },
  filters: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search by position, company, or summary',
    searchSubmit: 'Search experiences',
    visibilityLabel: 'Visibility',
    visibilityPlaceholder: 'All visibility states',
    publicOnly: 'Public only',
    privateOnly: 'Private only',
    reset: 'Clear',
  },
  emptyState: {
    index: 'No experiences have been created yet.',
  },
  values: {
    empty: '\u2014',
  },
  visibility: {
    public: 'Public',
    private: 'Private',
  },
  status: {
    editing: 'Editing: {{position}} at {{company}}',
  },
  errors: {
    translationsLoad:
      'Unable to load translations for locale conflict checks.',
  },
};
