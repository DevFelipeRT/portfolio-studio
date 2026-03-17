import type { TranslationTree } from '@/common/i18n/types';

const sections: TranslationTree = {
  list: {
    title: 'Secoes',
    description: 'Gerencie as secoes de conteudo que compoem esta pagina.',
    empty:
      'Nenhuma secao configurada ainda. Use o botao acima para adicionar a primeira secao.',
    position: 'Posicao {{value}}',
  },
  dialog: {
    create: {
      title: 'Adicionar secao',
      selectDescription: 'Escolha um template para visualizar.',
      configureDescription:
        'Configure o template selecionado e posicione-o na pagina.',
    },
    edit: {
      title: 'Editar secao',
      description: 'Atualize os metadados e o conteudo do template desta secao.',
      empty: 'Nenhuma secao selecionada.',
    },
  },
  toolbar: {
    activate: 'Ativar secao',
    deactivate: 'Desativar secao',
    edit: 'Editar secao',
    remove: 'Remover secao',
  },
  visibility: {
    inactive: 'Inativa',
    scheduled: 'Agendada',
    expired: 'Expirada',
    active: 'Ativa',
  },
  meta: {
    slot: 'Slot: {{value}}',
    navigation: 'Nav: {{value}}',
    group: 'Grupo: {{value}}',
  },
  reorder: {
    moveUp: 'Mover secao para cima',
    drag: 'Arrastar para reordenar secao',
    moveDown: 'Mover secao para baixo',
  },
  fields: {
    navigationLabel: 'Rotulo da navegacao',
    navigationLabelPlaceholder: 'Destaques',
    navigationGroup: 'Grupo da navegacao',
    navigationGroupPlaceholder: 'Sobre',
    navigationGroupEmpty: 'Nenhum grupo ainda',
    template: 'Template',
    templatePlaceholder: 'Selecione um template',
    anchor: 'Anchor',
    anchorPlaceholder: 'about, contact',
    slot: 'Slot',
    slotPlaceholder: 'Selecione um slot',
    slotInputPlaceholder: 'hero, main, footer',
    active: 'Ativa',
    activeHelp: 'Quando desabilitada, a secao permanece oculta.',
  },
  deleteConfirm: 'Tem certeza de que deseja excluir esta secao?',
};

export default sections;
