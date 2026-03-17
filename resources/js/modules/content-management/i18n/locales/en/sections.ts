import type { TranslationTree } from '@/common/i18n/types';

const sections: TranslationTree = {
  list: {
    title: 'Sections',
    description: 'Manage the content sections that compose this page.',
    empty: 'No sections configured yet. Use the button above to add the first section.',
    position: 'Position {{value}}',
  },
  dialog: {
    create: {
      title: 'Add section',
      selectDescription: 'Choose a template to preview.',
      configureDescription:
        'Configure the selected template and place it on the page.',
    },
    edit: {
      title: 'Edit section',
      description: 'Update this section metadata and template content.',
      empty: 'No section selected.',
    },
  },
  toolbar: {
    activate: 'Activate section',
    deactivate: 'Deactivate section',
    edit: 'Edit section',
    remove: 'Remove section',
  },
  visibility: {
    inactive: 'Inactive',
    scheduled: 'Scheduled',
    expired: 'Expired',
    active: 'Active',
  },
  meta: {
    slot: 'Slot: {{value}}',
    navigation: 'Nav: {{value}}',
    group: 'Group: {{value}}',
  },
  reorder: {
    moveUp: 'Move section up',
    drag: 'Drag to reorder section',
    moveDown: 'Move section down',
  },
  fields: {
    navigationLabel: 'Navigation label',
    navigationLabelPlaceholder: 'Highlights',
    navigationGroup: 'Navigation group',
    navigationGroupPlaceholder: 'About',
    navigationGroupEmpty: 'No groups yet',
    template: 'Template',
    templatePlaceholder: 'Select a template',
    anchor: 'Anchor',
    anchorPlaceholder: 'about, contact',
    slot: 'Slot',
    slotPlaceholder: 'Select a slot',
    slotInputPlaceholder: 'hero, main, footer',
    active: 'Active',
    activeHelp: 'When disabled, the section stays hidden.',
  },
  deleteConfirm: 'Are you sure you want to delete this section?',
};

export default sections;
