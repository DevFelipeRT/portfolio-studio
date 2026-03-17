import type { TranslationTree } from '@/common/i18n/types';

const templates: TranslationTree = {
  origin: {
    generic: 'Generic',
  },
  filters: {
    label: 'Filters',
    all: 'All',
    generic: 'Generic',
    domain: 'Domain',
    domainLabel: 'Domain',
  },
  emptyMatch: 'No templates match the selected filter.',
  noDescription: 'No description',
  noSlotsRestrictions: 'No slots restrictions',
  collection: {
    empty: 'No items configured. Use "Add item" to create one.',
    noItemFields: 'This collection has no item fields defined in the template.',
    item: 'Item {{index}}',
  },
  helpers: {
    integerArray: 'Comma-separated list of integer identifiers.',
    integerArrayPlaceholder: '1, 2, 3',
    image:
      'Use a valid image ID. A dedicated media picker can be integrated here later.',
    imageGallery:
      'Enter image IDs separated by commas. The order will be used as the gallery ordering.',
    richText: 'Rich text content stored as JSON.',
  },
};

export default templates;
