export default {
  fields: {
    locale: {
      label: 'Base locale',
      placeholder: 'Choose the project primary language',
    },
    name: {
      label: 'Name',
      placeholder: 'Enter the project name',
    },
    status: {
      label: 'Status',
      placeholder: 'Choose status',
    },
    summary: {
      label: 'Summary',
      placeholder:
        'Explain the goal and main outcome of the project in one sentence',
    },
    description: {
      label: 'Description',
      placeholder:
        'Describe the context, solution, stack, challenges, and impact of the project',
    },
    display: {
      label: 'Display on landing',
    },
    visibility: {
      label: 'Visibility',
    },
    repository_url: {
      label: 'Project repository link',
      placeholder: 'https://github.com/your-org/your-repository',
    },
    live_url: {
      label: 'Published project link',
      placeholder: 'https://product.example.com',
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
      fileLabel: 'Image file',
      filePlaceholder: 'Select an image',
      altLabel: 'Alt text',
      altPlaceholder: 'Describe the image for accessibility',
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
    createSubtitle:
      'Fill in the editorial details, public links, and images for the new project.',
    editSubtitle:
      'Review the core details, published links, and visual assets for this project.',
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
