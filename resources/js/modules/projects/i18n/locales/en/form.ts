export default {
  fields: {
    locale: {
      label: 'Base locale',
      placeholder: 'Select a locale',
    },
    name: {
      label: 'Name',
    },
    status: {
      label: 'Status',
      placeholder: 'Select a status',
    },
    summary: {
      label: 'Summary',
    },
    description: {
      label: 'Description',
    },
    display: {
      label: 'Display on landing',
    },
    visibility: {
      label: 'Visibility',
    },
    repository_url: {
      label: 'Repository URL',
    },
    live_url: {
      label: 'Live URL',
    },
    skill_ids: {
      label: 'Skills',
      empty: 'No skills available.',
      emptyInline: 'No skills',
      otherLabel: 'Other',
      placeholder: 'Search and select skills…',
    },
    images: {
      label: 'Images',
      empty: 'No images added yet.',
      addDisabledTitle: 'Select an image file before adding another field.',
    },
    updated_at: {
      label: 'Updated at',
    },
    image_count: {
      label: 'Images',
    },
    actions: {
      label: 'Actions',
    },
  },
  help: {
    managementSubtitle:
      'Manage the projects displayed on your portfolio landing page.',
  },
  filters: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search by name or summary',
    searchSubmit: 'Search projects',
    statusLabel: 'Status',
    statusPlaceholder: 'Status',
    clearStatus: 'Clear status filter',
    visibilityLabel: 'Visibility',
    visibilityPlaceholder: 'Visibility',
    clearVisibility: 'Clear visibility filter',
    publicOnly: 'Public only',
    privateOnly: 'Private only',
    reset: 'Clear',
  },
  emptyState: {
    index: 'No projects have been created yet.',
    filteredDescription: 'No projects match the current filters.',
    publicSection: 'No projects were returned for this section.',
  },
  values: {
    empty: '\u2014',
  },
  visibility: {
    public: 'Public',
    private: 'Private',
  },
  status: {
    delivered: 'Delivered',
    in_progress: 'In Progress',
    maintenance: 'Maintenance',
    planned: 'Planned',
  },
  carousel: {
    progress: '{{current}} of {{total}}',
    showImage: 'Show image {{index}}',
  },
  card: {
    untitled: 'Untitled project',
    noSummary: 'No summary available.',
    noSkills: 'No skills listed yet.',
    noImages: 'No images available.',
  },
  overlay: {
    loading: 'Loading project details...',
    loadError: 'Unable to load project details right now.',
    createdOn: 'Created on {{date}}',
    updatedOn: 'Updated on {{date}}',
    summary: 'Summary',
    details: 'Details',
    skills: 'Skills',
    images: 'Gallery',
  },
  errors: {
    translationsLoad:
      'Unable to load translations for locale conflict checks.',
  },
};
