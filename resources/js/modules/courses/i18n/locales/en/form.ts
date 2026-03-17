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
  emptyState: {
    index: 'No courses have been created yet.',
  },
  table: {
    title: 'All courses',
    description: 'A list of all courses and certificates registered.',
    columns: {
      course: 'Course',
      started_at: 'Start date',
      completed_at: 'End date',
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
