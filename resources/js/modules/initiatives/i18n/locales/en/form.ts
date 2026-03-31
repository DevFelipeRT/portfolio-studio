export default {
  fields: {
    locale: { label: 'Base locale', placeholder: 'Select a locale' },
    name: { label: 'Name' },
    start_date: { label: 'Start date', placeholder: 'Select a date' },
    end_date: { label: 'End date', placeholder: 'Select a date' },
    summary: { label: 'Summary' },
    description: { label: 'Description' },
    display: { label: 'Display on landing' },
    visibility: { label: 'Visibility' },
    images: { label: 'Images', empty: 'No images added yet.' },
    updated_at: { label: 'Updated at' },
    actions: { label: 'Actions' },
    period: { label: 'Date / Period' },
    image_count: { label: 'Images' },
  },
  help: {
    managementSubtitle:
      'Activities you led, such as talks, workshops and community actions.',
  },
  filters: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search by initiative name or summary',
    searchSubmit: 'Search initiatives',
    visibilityLabel: 'Visibility',
    visibilityPlaceholder: 'All visibility states',
    imagePresenceLabel: 'Images',
    imagePresencePlaceholder: 'Any image state',
    withImages: 'With images',
    withoutImages: 'Without images',
    publicOnly: 'Public only',
    privateOnly: 'Private only',
    reset: 'Clear',
  },
  stats: {
    total: 'Total: {{count}}',
    public: 'Public: {{count}}',
  },
  emptyState: {
    title: 'No initiatives yet',
    description:
      'Start by registering a talk, workshop or action you led so it can be highlighted in your portfolio.',
    filteredDescription:
      'No initiatives match the current filters.',
    unavailableResults:
      'No initiatives are available for the current page view.',
    publicSection: 'No initiatives were returned for this section.',
  },
  table: {
    title: 'Initiatives overview',
    description:
      'Manage initiatives that will be highlighted in your portfolio.',
    menu: 'Menu',
  },
  values: {
    empty: '-',
    public: 'Public',
    private: 'Private',
    from: 'From',
    to: 'To',
  },
  carousel: {
    progress: '{{current}} of {{total}}',
  },
  overlay: {
    loading: 'Loading initiative details...',
    loadError: 'Unable to load initiative details right now.',
    createdOn: 'Created on {{date}} at {{time}}',
    summary: 'Summary',
    details: 'Details',
    images: 'Images',
    happenedOn: 'Happened on {{date}}',
    fromTo: 'From {{start}} to {{end}}',
  },
  card: {
    highlightEyebrow: 'Featured initiatives',
    untitled: 'Untitled initiative',
    noSummary: 'No summary available.',
    noImages: 'No images available.',
    noPeriod: 'No period available.',
  },
  errors: {
    translationsLoad:
      'Unable to load translations for locale conflict checks.',
  },
};
