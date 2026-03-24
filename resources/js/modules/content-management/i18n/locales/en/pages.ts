import type { TranslationTree } from '@/common/i18n/types';

const pages: TranslationTree = {
  index: {
    headTitle: 'Content pages',
    title: 'Content pages',
    description:
      'Manage content-managed pages, their metadata and section composition.',
  },
  create: {
    headTitle: 'Create page',
    title: 'Create content page',
    description:
      'Define a new content-managed page before composing its sections.',
  },
  edit: {
    headTitle: 'Edit page - {{title}}',
    title: 'Edit content page',
    description: 'Update this page metadata and manage its sections.',
    deleteCta: 'Delete page',
    deleteConfirm:
      'Are you sure you want to delete this page and all its sections?',
  },
  form: {
    createTitle: 'Create page',
    editTitle: 'Edit page',
    createDescription: 'Configure basic metadata for a new content-managed page.',
    editDescription:
      'Update metadata and behavior of this content-managed page.',
    internalIdentifier: 'Internal identifier:',
    fields: {
      title: 'Title',
      slug: 'Slug',
      internalName: 'Internal name',
      locale: 'Locale',
      layoutKey: 'Layout key',
      metaTitle: 'Meta title',
      metaDescription: 'Meta description',
      published: 'Published',
      indexable: 'Indexable',
      allowIndexing: 'Allow indexing',
    },
    placeholders: {
      title: 'Landing page',
      slug: 'home, about, portfolio',
      internalName: 'landing_home, about_me',
      locale: 'pt_BR, en_US',
      layoutKey: 'default, landing_full',
      metaTitle: 'SEO title for this page',
      metaDescription: 'Short description used for SEO and social sharing.',
    },
    submitCreate: 'Create page',
  },
  filters: {
    search: 'Search',
    submitSearch: 'Search pages',
    status: 'Status',
    locale: 'Locale',
    searchPlaceholder: 'Filter by title, internal name, or slug',
    allStatuses: 'All statuses',
    allLocales: 'All locales',
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
  },
  listing: {
    columns: {
      name: 'Name',
      title: 'Title',
      slug: 'Slug',
      locale: 'Locale',
      status: 'Status',
      lastUpdated: 'Last updated',
      rowActions: 'Row actions',
    },
    empty: 'No pages found for the current filters.',
    openNewTab: 'Open page in a new tab',
    home: 'Home',
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
    deleteConfirm: 'Delete "{{title}}"? This cannot be undone.',
  },
  info: {
    title: 'Page details',
    description:
      'Snapshot of the current page metadata as returned by the backend.',
    badges: {
      published: 'Published',
      draft: 'Draft',
      archived: 'Archived',
      indexable: 'Indexable',
      noindex: 'Noindex',
    },
    fields: {
      title: 'Title',
      internalName: 'Internal name',
      slug: 'Slug',
      layoutKey: 'Layout key',
      metaTitle: 'Meta title',
      metaDescription: 'Meta description',
      metaImageUrl: 'Meta image URL',
      publishedAt: 'Published at',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
    },
  },
};

export default pages;
