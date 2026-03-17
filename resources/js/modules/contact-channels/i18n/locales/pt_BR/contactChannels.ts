import type { TranslationTree } from '@/common/i18n/types';

const contactChannels: TranslationTree = {
  socials: {
    email: {
      label: 'E-mail',
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
      label: 'Celular',
    },
    custom: {
      label: 'Personalizado',
    },
    unknown: {
      label: 'Contato',
    },
  },
  sectionDefaults: {
    sectionLabel: 'Contato e colaboracao',
    eyebrow: 'Contato',
    title: 'Vamos conversar sobre oportunidades, projetos ou colaboracao.',
    description:
      'Se voce procura um desenvolvedor para fortalecer seu time, apoiar um projeto especifico ou iniciar uma colaboracao tecnica, use o formulario ou os canais abaixo para entrar em contato.',
    formTitle: 'Envie uma mensagem',
    formDescription: 'Compartilhe o que voce tem em mente e como posso ajudar.',
    nameLabel: 'Nome',
    namePlaceholder: 'Seu nome',
    emailLabel: 'E-mail',
    emailPlaceholder: 'voce@exemplo.com',
    messageLabel: 'Mensagem',
    messagePlaceholder: 'Escreva sua mensagem aqui.',
    submitLabel: 'Enviar mensagem',
    submitProcessingLabel: 'Enviando...',
    socialsHeading: 'Outros canais de contato',
    socialsDescription:
      'Voce tambem pode entrar em contato pelo canal que preferir usando os links abaixo para acessar meus perfis e conhecer melhor o meu trabalho.',
  },
};

export default contactChannels;
