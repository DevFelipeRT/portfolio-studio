export default {
  fields: {
    locale: {
      label: 'Locale',
      placeholder: 'Select a locale',
      error: 'Locale is required',
    },
    name: {
      label: 'Course Title',
      placeholder: 'e.g., Advanced React Patterns',
      error: 'Course title is required',
    },
    institution: {
      label: 'Institution',
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
    status: {
      label: 'Status',
    },
    visibility: {
      label: 'Visibility',
    },
    actions: {
      label: 'Actions',
    },
  },
  help: {
    managementSubtitle: 'Manage the courses displayed on your portfolio.',
  },
  filters: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search by course, institution, or summary',
    searchSubmit: 'Search courses',
    institutionLabel: 'Institution',
    institutionPlaceholder: 'Filter by institution',
    statusLabel: 'Status',
    statusPlaceholder: 'All statuses',
    visibilityLabel: 'Visibility',
    visibilityPlaceholder: 'All visibility states',
    publicOnly: 'Public only',
    privateOnly: 'Private only',
    reset: 'Clear',
  },
  emptyState: {
    index: 'No courses have been created yet.',
  },
  table: {
    title: 'All courses',
    description: 'A list of all courses and certificates registered.',
    columns: {
      name: 'Name',
      started_at: 'Start',
      completed_at: 'End',
    },
  },
  status: {
    planned: 'Planned',
    in_progress: 'In Progress',
    completed: 'Completed',
  },
  visibility: {
    public: 'Public',
    private: 'Private',
    hidden: 'Hidden',
    notHighlighted: 'Not currently highlighted',
  },
  overlay: {
    about: 'About the course',
    noDescription: 'No detailed description provided.',
  },
  values: {
    empty: '\u2014',
    present: 'Present',
  },
  errors: {
    translationsLoad:
      'Unable to load translations for locale conflict checks.',
  },
};
