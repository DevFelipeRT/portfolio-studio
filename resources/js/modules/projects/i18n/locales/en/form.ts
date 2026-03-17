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
      placeholder: 'Example: draft, published',
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
    actions: {
      label: 'Actions',
    },
  },
  help: {
    managementSubtitle:
      'Manage the projects displayed on your portfolio landing page.',
  },
  emptyState: {
    index: 'No projects have been created yet.',
    publicSection: 'No projects were returned for this section.',
  },
  values: {
    empty: '\u2014',
  },
  carousel: {
    progress: '{{current}} of {{total}}',
  },
  card: {
    untitled: 'Untitled project',
    noSummary: 'No summary available.',
    noSkills: 'No skills listed yet.',
  },
  errors: {
    translationsLoad:
      'Unable to load translations for locale conflict checks.',
  },
};
