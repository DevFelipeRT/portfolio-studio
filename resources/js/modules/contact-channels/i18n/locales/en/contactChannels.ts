import type { TranslationTree } from '@/common/i18n/types';

const contactChannels: TranslationTree = {
  socials: {
    email: {
      label: 'Email',
    },
    github: {
      label: 'GitHub',
    },
    linkedin: {
      label: 'LinkedIn',
    },
    whatsapp: {
      label: 'WhatsApp',
    },
    phone: {
      label: 'Phone',
    },
    custom: {
      label: 'Custom',
    },
    unknown: {
      label: 'Contact',
    },
  },
  sectionDefaults: {
    sectionLabel: 'Contact and collaboration',
    eyebrow: 'Contact',
    title: 'Let us talk about opportunities, projects, or collaboration.',
    description:
      'If you are looking for a developer to strengthen your team, support a specific project, or start a technical collaboration, use the form or the channels below to get in touch.',
    formTitle: 'Send a message',
    formDescription: 'Share what you have in mind and how I can help.',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Write your message here.',
    submitLabel: 'Send message',
    submitProcessingLabel: 'Sending...',
    socialsHeading: 'Other contact channels',
    socialsDescription:
      'You can also contact me through your preferred channel using the links below to access my profiles and learn more about my work.',
  },
};

export default contactChannels;
