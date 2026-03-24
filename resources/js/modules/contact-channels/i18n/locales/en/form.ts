export default {
  sections: {
    managementTitle: 'Contact channels',
  },
  help: {
    managementSubtitle: 'Manage the contact channels displayed on your website.',
  },
  filters: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search by label or value',
    searchSubmit: 'Search channels',
    typeLabel: 'Type',
    typePlaceholder: 'All types',
    activeLabel: 'Status',
    activePlaceholder: 'All statuses',
    activeOnly: 'Active only',
    inactiveOnly: 'Inactive only',
    reset: 'Clear',
  },
  emptyState: {
    index: 'No contact channels configured yet.',
  },
  columns: {
    type: 'Type',
    label: 'Label',
    value: 'Value',
    active: 'Active',
    order: 'Order',
    actions: 'Actions',
  },
  fields: {
    locale: {
      label: 'Locale',
    },
    channel_type: {
      label: 'Type',
      placeholder: 'Select a type',
    },
    label: {
      label: 'Label',
      placeholder: 'Optional label',
    },
    value: {
      label: 'Value',
      placeholder: 'Email, phone number, handle, or URL',
    },
    sort_order: {
      label: 'Order',
    },
    is_active: {
      label: 'Active',
    },
  },
  values: {
    active: 'Active',
    inactive: 'Inactive',
  },
};
