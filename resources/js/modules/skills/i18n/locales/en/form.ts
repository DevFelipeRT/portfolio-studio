export default {
  fields: {
    locale: { label: 'Locale', placeholder: 'Select a locale' },
    name: { label: 'Name' },
    category: {
      label: 'Category',
      placeholder: 'Select a category',
      uncategorized: 'Uncategorized',
    },
    slug: { label: 'Slug', placeholder: 'Leave blank to auto-generate' },
    updated_at: { label: 'Updated' },
    actions: { label: 'Actions' },
  },
  help: {
    managementSubtitle:
      'Manage the reusable skills referenced by your portfolio projects.',
    categoriesDescription:
      'Organize skills by category for grouping and filtering.',
  },
  emptyState: {
    skills: 'No skills have been created yet.',
    categories: 'No categories have been created yet.',
  },
  table: {
    title: 'Skills',
    description: 'Review and manage the skills used across your projects.',
    menu: 'Menu',
  },
  sections: {
    categoriesTitle: 'Skill categories',
  },
  values: {
    empty: '\u2014',
  },
  public: {
    sectionLabel: 'Skills used across my projects',
    eyebrow: 'Tech stack',
    title: 'Skills I work with on a daily basis.',
    description:
      'A selection of tools and frameworks that I use to design, build and operate web applications.',
  },
};
