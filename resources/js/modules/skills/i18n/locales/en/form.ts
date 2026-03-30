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
    created_at: { label: 'Created at' },
    updated_at: { label: 'Updated at' },
    actions: { label: 'Actions' },
  },
  help: {
    managementSubtitle:
      'Manage the reusable skills referenced by your portfolio projects.',
    categoriesDescription:
      'Organize skills by category for grouping and filtering.',
    categoriesSummary: 'Registered categories',
    categoriesStandaloneHint:
      'Open the dedicated categories page to browse, paginate, and manage this catalog.',
  },
  filters: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search by skill name or category',
    searchSubmit: 'Search skills',
    categoryLabel: 'Category',
    categoryPlaceholder: 'All categories',
    categoriesSearchLabel: 'Search',
    categoriesSearchPlaceholder: 'Search by category name or slug',
    categoriesSearchSubmit: 'Search categories',
    reset: 'Clear',
  },
  emptyState: {
    skills: 'No skills have been created yet.',
    filteredSkills: 'No skills match the current filters.',
    categories: 'No categories have been created yet.',
    filteredCategories: 'No categories match the current filters.',
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
