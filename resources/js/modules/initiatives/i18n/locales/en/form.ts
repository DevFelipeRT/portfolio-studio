export default {
  fields: {
    locale: { label: 'Base locale', placeholder: 'Select a locale' },
    name: { label: 'Name' },
    start_date: { label: 'Start date', placeholder: 'Select a date' },
    end_date: { label: 'End date', placeholder: 'Select a date' },
    summary: { label: 'Summary' },
    description: { label: 'Description' },
    display: { label: 'Display on landing' },
    images: { label: 'Images', empty: 'No images added yet.' },
    updated_at: { label: 'Updated at' },
    actions: { label: 'Actions' },
    display_count: { label: 'Display' },
    period: { label: 'Date / Period' },
    image_count: { label: 'Images' },
  },
  help: {
    managementSubtitle:
      'Activities you led, such as talks, workshops and community actions.',
  },
  stats: {
    total: 'Total: {{count}}',
    visible: 'Visible: {{count}}',
  },
  emptyState: {
    title: 'No initiatives yet',
    description:
      'Start by registering a talk, workshop or action you led so it can be highlighted in your portfolio.',
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
    visible: 'Visible',
    hidden: 'Hidden',
    from: 'From',
    to: 'To',
  },
  overlay: {
    createdOn: 'Created on {{date}} at {{time}}',
    summary: 'Summary',
    details: 'Details',
    images: 'Images',
    happenedOn: 'Happened on {{date}}',
    fromTo: 'From {{start}} to {{end}}',
  },
  card: {
    highlightEyebrow: 'Featured initiatives',
  },
  errors: {
    translationsLoad:
      'Unable to load translations for locale conflict checks.',
  },
};
